// The links number map is between two nodesalso starts with the lower id
var linksNumberMap = {},
  dPositionFn = d.utils.positionFn,
  dTextFn = d.utils.textFn,
  helpers = {
    generateConnectionWithText: function(nodesIds, text) {
      if (_.isArray(nodesIds) && _.isArray(nodesIds[0])) {
        return _.map(nodesIds, function(args) {
          return helpers.generateConnectionWithText.apply({}, args);
        });
      }
      if (_.isString(nodesIds)) nodesIds = nodesIds.split(' ').map(Number);
      else if (_.isNumber(nodesIds)) nodesIds = [nodesIds];
      return diagrams.graph.mergeWithDefaultConnection({
        nodesIds: nodesIds,
        text: text
      });
    },
    connectionFnFactory: function(baseFn, changedProp, changedVal) {
      return function() {
        var connection = baseFn.apply(this, arguments),
          setVal = function(singleConnection) {
            singleConnection[changedProp] = changedVal;
            return connection;
          };

        if (_.isArray(connection)) return _.map(connection, setVal);
        else return setVal(connection);
      };
    },
    generateNodeOptions: function(options) {
      var obj = {},
        shape;
      if (_.isString(options)) return helpers.generateNodeOptions(options.split(' '));
      else if (_.isArray(options)) {
        _.each(options, function(opt) {
          if (opt.substr(0, 2) === 's-') {
            shape = opt.substr(2, opt.length - 2);
            if (shape === 't') obj.shape = 'triangle';
            else if (shape === 's') obj.shape = 'square';
            else obj.shape = 'circle';
          } else if (opt === 'b') obj.bold = true;
        });
        return obj;
      }
    },
    getDefaultConnection: function() {
      var defaultConnection = {
        direction: 'out',
        symbol: 'arrow',
        line: 'plain'
      };

      return _.cloneDeep(defaultConnection);
    },
    mergeWithDefaultConnection: function(connection) {
      return _.defaults(connection, helpers.getDefaultConnection());
    },
    generateNode: function() {
      var node = {
          name: arguments[0]
        },
        addDefaultConnectionFromNumber = function(nodeId) {
          node.connections.push(helpers.mergeWithDefaultConnection({
            nodesIds: [nodeId]
          }));
        },
        addConnection = function(connection) {
          if (_.isArray(connection)) _.each(connection, addConnection);
          else if (_.isObject(connection)) {
            helpers.mergeWithDefaultConnection(connection);
            node.connections.push(connection);
          }
        },
        connections;

      if (arguments.length > 1) {
        connections = arguments[1];
        node.connections = [];
        if (_.isString(arguments[1])) {
          connections = connections.split(' ').map(Number);
          if (connections.length > 0) node.id = connections[0];
          if (connections.length > 1) {
            _.each(connections, function(nodeId, index) {
              if (index > 0) addConnection(nodeId);
            });
          }
        } else if (_.isArray(connections)) {
          node.id = connections[0];
          connections = connections.slice(1);
          _.each(connections, function(connection) {
            if (_.isNumber(connection)) addDefaultConnectionFromNumber(connection);
            else addConnection(connection);
          });
        } else if (_.isNumber(connections)) node.id = connections;

        if (arguments.length > 2) node.description = arguments[2];
        if (arguments.length > 3) node.options = helpers.generateNodeOptions(arguments[3]);
      }

      return node;
    },
    generateNodeWithSharedGet: function() {
      var text = arguments[0],
        sharedKey, preffix, options;

      preffix = (arguments.length > 2) ? arguments[2] : '';
      sharedKey = preffix + text.split('(')[0];
      options = (arguments.length > 3) ? arguments[3] : null;

      return helpers.generateNode(text, arguments[1], d.shared.get(sharedKey), options);
    },
    generateFnNodeWithSharedGetAndBoldIfFile: function(file) {
      return function() {
        var opts = '',
          preffix = '';
        if (arguments[0].split('@')[0] === file) opts = 'b';
        if (arguments.length > 2) preffix = arguments[2];
        if (arguments.length > 3) opts = arguments[3] + ' ' + opts;
        return helpers.generateNodeWithSharedGet(arguments[0], arguments[1], preffix, opts);
      };
    },
    dataFromGeneralToSpecific: function(generalData) {
      var finalItems = [],
        idToIndexMap = {},
        targetItem;

      _.each(generalData.items, function(item, index) {
        finalItems.push({
          name: item.name,
          id: item.id,
          description: item.description
        });
        idToIndexMap[item.id] = index;
      });

      _.each(generalData.connections, function(connection) {
        targetItem = finalItems[idToIndexMap[connection.to]];
        targetItem.connections = targetItem.connections || [];
        targetItem.connections.push({
          direction: 'in',
          nodesIds: [connection.from]
        });
      });

      return finalItems;
    },
    dataFromSpecificToGeneral: function(data) {
      var finalItems = [],
        connections = [];

      _.each(data, function(node) {
        finalItems.push({
          id: node.id,
          name: node.name,
          description: node.description
        });
        _.each(node.connections, function(connection) {
          _.each(connection.nodesIds, function(otherNodeId) {
            connections.push({
              from: node.id,
              to: otherNodeId
            });
          });
        });
      });

      return {
        items: finalItems,
        connections: connections
      };
    },
    doWithMinIdAndMaxIdOfLinkNodes: function(link, cb) {
      var getIndex = function(item) {
          return (_.isNumber(item)) ? item : item.index;
        },
        ids = [getIndex(link.source), getIndex(link.target)],
        minIndex = _.min(ids),
        maxIndex = _.max(ids);

      return cb(minIndex, maxIndex);
    },
    updateLinksNumberMapWithLink: function(link) {
      helpers.doWithMinIdAndMaxIdOfLinkNodes(link, function(minIndex, maxIndex) {
        if (_.isUndefined(linksNumberMap[minIndex])) linksNumberMap[minIndex] = {};

        if (_.isUndefined(linksNumberMap[minIndex][maxIndex])) linksNumberMap[minIndex][maxIndex] = 1;
        else linksNumberMap[minIndex][maxIndex] += 1;
      });
    },
    getLinksNumberMapItemWithLink: function(link) {
      return helpers.doWithMinIdAndMaxIdOfLinkNodes(link, function(minIndex, maxIndex) {
        return linksNumberMap[minIndex][maxIndex];
      });
    }
  },
  Graph, helpers;

Graph = class Graph extends d.Diagram {
  create(creationId, data, conf) {
    var diagram = this,
      bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      svg = d.svg.generateSvg(),
      container = svg.append('g'),
      height = bodyHeight - 250,
      width = svg.attr('width'),
      tick = function() {
        var setPathToLink = function(pathClass) {
          link.select('path.' + pathClass).attr("d", function(d) {
            var linksNumber = helpers.getLinksNumberMapItemWithLink(d),
              linkIndex = d.data.linkIndex,
              dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy) * 3.5 * ((linkIndex + 1) / (linksNumber * 3));
            return "M" +
              d.source.x + "," +
              d.source.y + "A" +
              dr + "," + dr + " 0 0,1 " +
              d.target.x + "," +
              d.target.y;
          });
        };

        _.each(['link-path', 'link-path-title'], setPathToLink);

        node.each(function(singleNode) {
          if (singleNode.shape === 'circle') {
            node.select('circle').attr("cx", dPositionFn('x')).attr("cy", dPositionFn('y'));
          } else {
            if (singleNode.shape === 'triangle') shapeEl = node.select('path.triangle');
            else if (singleNode.shape === 'square') shapeEl = node.select('path.square');

            d.utils.applySimpleTransform(shapeEl);
          }
        });
        node.select('text').attr("x", dPositionFn('x')).attr("y", dPositionFn('y', -20));
      },
      parseData = function() {
        var maxId = _.reduce(data, function(memo, node) {
            var id = node.id || 0;
            return (memo > id) ? memo : id;
          }, 0),
          idsMap = {},
          nodesWithLinkMap = {},
          colors = d3.scale.category10(),
          nodeId, color, options, otherNode, linkObj;
        parsedData = {
          links: [],
          nodes: []
        };
        markers = [];
        _.each(data, function(node, nodeIndex) {
          nodeId = _.isUndefined(node.id) ? maxId++ : node.id;
          color = colors(nodeIndex);
          options = node.options || {};

          parsedData.nodes.push({
            name: node.name,
            id: nodeId,
            connections: node.connections || [],
            description: node.description || null,
            color: color,
            shape: options.shape || 'circle',
            bold: options.bold || false
          });
          idsMap[nodeId] = {
            index: nodeIndex
          };
          if (_.isArray(node.connections) && node.connections.length > 0) {
            idsMap[nodeId].color = color;
            markers.push({
              id: nodeId,
              color: color
            });
          }
        });

        _.each(parsedData.nodes, function(node, nodeIndex) {
          if (node.connections.length > 0) {
            _.each(node.connections, function(connection) {
              _.each(connection.nodesIds, function(otherNodeId) {
                otherNode = idsMap[otherNodeId];

                if (otherNode) {
                  if (conf.hideNodesWithoutLinks) {
                    nodesWithLinkMap[otherNode.index] = true;
                    nodesWithLinkMap[nodeIndex] = true;
                  }

                  linkObj = {};
                  if (connection.direction === 'out') {
                    linkObj.source = nodeIndex;
                    linkObj.target = otherNode.index;
                  } else {
                    linkObj.source = otherNode.index;
                    linkObj.target = nodeIndex;
                  }
                  linkObj.data = connection;
                  linkObj.color = idsMap[node.id].color;
                  helpers.updateLinksNumberMapWithLink(linkObj);
                  linkObj.data.linkIndex = helpers.getLinksNumberMapItemWithLink(linkObj) - 1;
                  if (linkObj.data.text) linkObj.data.fullText = linkObj.data.text;
                  parsedData.links.push(linkObj);
                }
              });
            });
          }
        });

        if (conf.hideNodesWithoutLinks === true) {
          _.each(parsedData.nodes, function(node, nodeIndex) {
            if (nodesWithLinkMap[nodeIndex] !== true) node.hidden = true;
          });
        }
      },
      zoomed = function() {
        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      },
      dragstarted = function() {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
        force.start();
      },
      dragged = function(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      },
      dragended = function() {
        d3.select(this).classed("dragging", false);
      },
      setRelationships = function() {
        _.each(parsedData.nodes, diagram.generateEmptyRelationships, diagram);
        _.each(parsedData.nodes, function(node) {
          diagram.addSelfRelationship(node, node.shapeEl, node);
        });
        _.each(parsedData.links, function(link) {
          diagram.addDependencyRelationship(link.source, link.target.shapeEl, link.target);
          diagram.addDependantRelationship(link.target, link.source.shapeEl, link.source);
        });
      },
      force, drag, link, linkTitle, node, zoom, singleNodeEl, shape, shapeEl, markers, parsedData;

    diagram.markRelatedFn = function(item) {
      item.el.style('stroke-width', '10px');
    };
    diagram.unmarkAllItems = function() {
      _.each(parsedData.nodes, function(node) {
        node.shapeEl.style('stroke-width', '1px');
      });
    };

    conf = conf || {};
    parseData();

    svg.attr({
      height: height,
      'class': 'graph-diagram'
    });


    zoom = d3.behavior.zoom().scaleExtent([0.1, 10]).on("zoom", zoomed);
    svg.call(zoom);

    force = d3.layout.force().size([width, height]).charge(conf.charge || -10000).linkDistance(conf.linkDistance || 140).on("tick", tick);

    drag = d3.behavior.drag().origin(function(d) {
      return d;
    }).on("dragstart", dragstarted).on("drag", dragged).on("dragend", dragended);

    force.nodes(parsedData.nodes).links(parsedData.links).start();

    container.append("svg:defs").selectAll("marker")
      .data(markers)
      .enter().append("svg:marker")
      .attr({
        id: dTextFn('id', 'arrow-head-'),
        'class': 'arrow-head',
        fill: dTextFn('color'),
        viewBox: '0 -5 10 10',
        refX: 19,
        refY: -1.5,
        markerWidth: 8,
        markerHeight: 8,
        orient: 'auto'
      })
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    link = container.selectAll(".link").data(parsedData.links).enter().append('g').attr("class", "link");
    link.append("svg:path").attr({
      'class': 'link-path',
      "marker-end": function(d) {
        var markerItem = (d.data.direction === 'out') ? 'source' : 'target';
        return 'url(#arrow-head-' + d[markerItem].id + ')';
      }
    }).style({
      'stroke': dTextFn('color'),
      'stroke-dasharray': function(d) {
        if (d.data.line === 'plain') return null;
        else if (d.data.line === 'dotted') return '5,5';
      }
    });

    linkTitle = link.append('g');
    linkTitle.filter(function(d) {
      return _.isUndefined(d.data.text) === false;
    }).append('svg:path').attr('class', 'link-path-title');
    linkTitle.each(function(d) {
      diagram.addMouseListenersToEl(d3.select(this), d.data);
    });

    node = container.selectAll(".node").data(parsedData.nodes).enter().append('g').attr({
      'class': function(d) {
        var finalClass = 'node';
        if (d.hidden === true) finalClass += ' node-hidden';
        return finalClass;
      },
      id: dTextFn('id', 'node-')
    });

    node.each(function(singleNode) {
      var singleNodeClasses = '';
      singleNodeEl = d3.select(this);
      singleNode.fullText = d.utils.generateATextDescriptionStr(singleNode.name, singleNode.description);

      if (singleNode.shape === 'circle') {
        shapeEl = singleNodeEl.append("circle").attr({
          r: 12,
          fill: dTextFn('color')
        });
      } else {
        shape = d3.svg.symbol().size(750);
        shapeEl = singleNodeEl.append("path");
        if (singleNode.shape === 'triangle') {
          shape = shape.type('triangle-up');
          singleNodeClasses += ' triangle';
        } else if (singleNode.shape === 'square') {
          shape = shape.type('square');
          singleNodeClasses += ' square';
        }
        shapeEl = shapeEl.attr({
          d: shape,
          fill: dTextFn('color')
        });
        d.utils.applySimpleTransform(shapeEl);
      }

      shapeEl.call(drag);
      if (singleNode.bold === true) singleNodeClasses += ' bold';
      else singleNodeClasses += ' thin';
      shapeEl.attr('class', singleNodeClasses);

      singleNode.shapeEl = shapeEl;
      diagram.addMouseListenersToEl(shapeEl, singleNode);
    });
    node.append("text").text(dTextFn('name'));

    setRelationships();
  }
};

new Graph({
  name: 'graph',
  helpers: helpers
});
