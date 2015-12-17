import d from 'diagrams';

export default () => {
  let linksNumberMap = {};
  const SHY_CONNECTIONS = 'Show connections selectively';
  const GRAPH_ZOOM = 'dia graph zoom';
  const GRAPH_DRAG = 'Drag nodes on click (may make links difficult)';
  const CURVED_ARROWS = 'All arrows are curved';
  const graphZoomConfig = {
    private: true,
    type: Number,
    value: 1,
  };
  const dPositionFn = d.utils.positionFn;
  const dTextFn = d.utils.textFn;
  const helpers = {
    generateConnectionWithText(nodesIds, text) {
      if (_.isArray(nodesIds) && _.isArray(nodesIds[0])) {
        return _.map(nodesIds, (args) => {
          return helpers.generateConnectionWithText.apply({}, args);
        });
      }

      if (_.isString(nodesIds)) nodesIds = nodesIds.split(' ').map(Number);
      else if (_.isNumber(nodesIds)) nodesIds = [nodesIds];

      return d.graph.mergeWithDefaultConnection({ nodesIds, text });
    },
    connectionFnFactory(baseFn, changedProp, changedVal) {
      return () => {
        const connection = baseFn(...arguments);
        const setVal = (singleConnection) => {
          singleConnection[changedProp] = changedVal;

          return connection;
        };

        return (_.isArray(connection)) ? _.map(connection, setVal) : setVal(connection);
      };
    },
    generateNodeOptions: (options) => {
      const obj = {};
      let shape;

      if (_.isString(options)) return helpers.generateNodeOptions(options.split(' '));
      else if (_.isArray(options)) {
        _.each(options, (opt) => {
          if (opt.substr(0, 2) === 's-') {
            shape = opt.substr(2, opt.length - 2);
            obj.shape = (shape === 't') ? 'triangle' :
              (shape === 's') ? 'square' :
              'circle';
          } else if (opt === 'b') obj.bold = true;
          else if (opt.substr(0, 2) === 'l~') obj.linkToUrl = opt.substr(2, opt.length - 2);
        });

        return obj;
      }
    },
    mergeWithDefaultConnection(connection) {
      const defaultConnection = {
        direction: 'out',
        symbol: 'arrow',
        line: 'plain',
      };

      return _.defaults(connection, defaultConnection);
    },
    generateNodeWithTargetLink(file, target) {
      return () => {
        const args = Array.prototype.slice.call(arguments);

        if (_.isUndefined(args[3])) args[3] = '';
        else args[3] += ' ';
        args[3] += `l~${file}?target=${encodeURIComponent(target)}`;

        return helpers.generateNode.apply({}, args);
      };
    },
    generateNodeWithTextAsTargetLink(file) {
      return () => {
        return d.graph.generateNodeWithTargetLink(file, arguments[0]).apply({}, arguments);
      };
    },
    generatePrivateNode() {
      const args = Array.prototype.slice.call(arguments);

      args[2] += '<br><strong>PRIVATE</strong>';
      args[3] = 's-t';

      return helpers.generateNode(...args);
    },
    generateNode() {
      const node = {
        name: arguments[0],
      };
      const addDefaultConnectionFromNumber = (nodeId) => {
        node.connections.push(helpers.mergeWithDefaultConnection({
          nodesIds: [nodeId],
        }));
      };
      const addConnection = (connection) => {
        if (_.isArray(connection)) _.each(connection, addConnection);
        else if (_.isNumber(connection)) addConnection({
          nodesIds: [connection],
        });
        else if (_.isObject(connection)) {
          helpers.mergeWithDefaultConnection(connection);
          node.connections.push(connection);
        }
      };
      let connections;

      if (arguments.length > 1) {
        connections = arguments[1];
        node.connections = [];

        if (_.isString(connections)) {
          connections = connections.split(' ').map(Number);

          if (connections.length > 0) node.id = connections[0];

          if (connections.length > 1) {
            _.each(connections, (nodeId, index) => {
              if (index > 0) addConnection(nodeId);
            });
          }
        } else if (_.isArray(connections)) {
          node.id = connections[0];
          connections = connections.slice(1);
          _.each(connections, (connection) => {
            if (_.isNumber(connection)) addDefaultConnectionFromNumber(connection);
            else addConnection(connection);
          });
        } else if (_.isNumber(connections)) node.id = connections;

        if (arguments.length > 2) node.description = arguments[2];

        if (arguments.length > 3) node.options = helpers.generateNodeOptions(arguments[3]);
      }

      return node;
    },
    generateNodeWithSharedGet() {
      const text = arguments[0];
      let sharedKey, preffix, options;

      preffix = (arguments.length > 2) ? arguments[2] : '';
      sharedKey = preffix + text.split('(')[0];
      options = (arguments.length > 3) ? arguments[3] : null;

      return helpers.generateNode(text, arguments[1], d.shared.get(sharedKey), options);
    },
    generateFnNodeWithSharedGetAndBoldIfFile(file) {
      return () => {
        let opts = '';
        let preffix = '';

        if (arguments[0].split('@')[0] === file) opts = 'b';

        if (arguments.length > 2) preffix = arguments[2];

        if (arguments.length > 3) opts = `${arguments[3]} ${opts}`;

        return helpers.generateNodeWithSharedGet(arguments[0], arguments[1], preffix, opts);
      };
    },
    dataFromGeneralToSpecific(generalData) {
      const finalItems = [];
      const idToIndexMap = {};
      let targetItem;

      _.each(generalData.items, (item, index) => {
        finalItems.push({
          name: item.name,
          id: item.id,
          description: item.description,
        });
        idToIndexMap[item.id] = index;
      });

      _.each(generalData.connections, (connection) => {
        targetItem = finalItems[idToIndexMap[connection.to]];
        targetItem.connections = targetItem.connections || [];
        targetItem.connections.push({
          direction: 'in',
          nodesIds: [connection.from],
        });
      });

      return finalItems;
    },
    dataFromSpecificToGeneral(data) {
      const finalItems = [];
      const connections = [];
      const setConnection = (node, connection) => {
        _.each(connection.nodesIds, (otherNodeId) => {
          newConnection = {};

          if (connection.direction === 'out') {
            newConnection.from = node.id;
            newConnection.to = otherNodeId;
          } else if (connection.direction === 'in') {
            newConnection.from = otherNodeId;
            newConnection.to = node.id;
          }

          connections.push(newConnection);
        });
      };
      let newConnection;

      _.each(data, (node) => {
        finalItems.push({
          id: node.id,
          name: node.name,
          description: node.description,
        });
        _.each(node.connections, (connection) => setConnection(node, connection));
      });

      return {
        items: finalItems,
        connections,
      };
    },
    doWithMinIdAndMaxIdOfLinkNodes(link, cb) {
      const getIndex = (item) => {
        return (_.isNumber(item)) ? item : item.index;
      };
      const ids = [getIndex(link.source), getIndex(link.target)];
      const minIndex = _.min(ids);
      const maxIndex = _.max(ids);

      return cb(minIndex, maxIndex);
    },
    updateLinksNumberMapWithLink(link) {
      helpers.doWithMinIdAndMaxIdOfLinkNodes(link, (minIndex, maxIndex) => {
        if (_.isUndefined(linksNumberMap[minIndex])) linksNumberMap[minIndex] = {};

        if (_.isUndefined(linksNumberMap[minIndex][maxIndex])) {
          linksNumberMap[minIndex][maxIndex] = 1;
        } else linksNumberMap[minIndex][maxIndex] += 1;
      });
    },
    getLinksNumberMapItemWithLink(link) {
      return helpers.doWithMinIdAndMaxIdOfLinkNodes(link, (minIndex, maxIndex) => {
        return linksNumberMap[minIndex][maxIndex];
      });
    },
    addDiagramInfo(diagram, svg, info) {
      if (_.isString(info)) info = [info];
      const hasDescription = info.length === 2;
      const svgWidth = svg[0][0].getBoundingClientRect().width;
      const infoText = info[0] + (hasDescription ? ' (...)' : '');
      const el = svg.append('g').attr({
        transform: 'translate(10, 50)',
        class: 'graph-info',
      }).append('text').text(infoText).each(d.svg.textEllipsis(svgWidth));

      if (hasDescription) {
        diagram.addMouseListenersToEl(el, {
          el,
          fullText: d.utils.generateATextDescriptionStr(info[0], info[1]),
        });
      }
    },
    setReRender(diagram, creationId, data) {
      diagram.reRender = (conf) => {
        diagram.unlisten('configuration-changed');
        diagram.reRender = null;
        diagram.removePreviousAndCreate(creationId, data, conf);
      };
    },
  };

  const Graph = class Graph extends d.Diagram {
    create(creationId, data, conf) {
      const diagram = this;
      const bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const svg = d.svg.generateSvg();
      const container = svg.append('g');
      const width = svg.attr('width');
      const dragNodesConfig = diagram.config(GRAPH_DRAG);
      const curvedArrows = diagram.config(CURVED_ARROWS);

      linksNumberMap = {};

      let force, drag, link, linkOuter, node, zoom,
        singleNodeEl, shape, shapeEl, markers, parsedData;

      const height = d.svg.selectScreenHeightOrHeight(bodyHeight - 250);

      const tick = () => {
        const setPathToLink = (pathClass) => {
          link.select(`path.${pathClass}`).attr("d", (d) => {
            const linksNumber = helpers.getLinksNumberMapItemWithLink(d);
            const linkIndex = d.data.linkIndex;
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * (curvedArrows ? 3.5 : 1)
              * (linkIndex + (curvedArrows ? 1 : 0) / (linksNumber * 3));

            return `M${d.source.x},${d.source.y}A`
              + `${dr},${dr} 0 0,1 `
              + `${d.target.x},${d.target.y}`;
          });
        };

        _.each(['link-path', 'link-path-outer'], setPathToLink);

        node.each((singleNode) => {
          if (singleNode.shape === 'circle') {
            node.select('circle').attr("cx", dPositionFn('x')).attr("cy", dPositionFn('y'));
          } else {
            if (singleNode.shape === 'triangle') shapeEl = node.select('path.triangle');
            else if (singleNode.shape === 'square') shapeEl = node.select('path.square');

            d.utils.applySimpleTransform(shapeEl);
          }
        });
        node.select('text').attr("x", dPositionFn('x')).attr("y", dPositionFn('y', -20));
      };
      const parseData = () => {
        let maxId = _.reduce(data, (memo, node) => {
          const id = node.id || 0;

          return (memo > id) ? memo : id;
        }, 0);
        const idsMap = {};
        const nodesWithLinkMap = {};
        const colors = d3.scale.category20();
        let nodeId, color, options, otherNode, linkObj;

        parsedData = {
          links: [],
          nodes: [],
        };
        markers = [];
        _.each(data, (node, nodeIndex) => {
          nodeId = _.isUndefined(node.id) ? maxId++ : node.id;
          color = colors(nodeIndex);
          options = node.options || {};

          parsedData.nodes.push({
            bold: options.bold || false,
            color,
            connections: node.connections || [],
            description: node.description || null,
            id: nodeId,
            linkToUrl: options.linkToUrl || null,
            name: node.name,
            shape: options.shape || 'circle',
          });
          idsMap[nodeId] = {
            index: nodeIndex,
          };
          idsMap[nodeId].color = color;
          markers.push({
            color,
            id: nodeId,
          });

        });

        diagram.config(conf);

        if (conf.info) helpers.addDiagramInfo(diagram, svg, conf.info);

        _.each(parsedData.nodes, (node, nodeIndex) => {
          if (node.connections.length > 0) {
            _.each(node.connections, (connection) => {
              _.each(connection.nodesIds, (otherNodeId) => {
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
                  linkObj.color = parsedData.nodes[linkObj.source].color;
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
          _.each(parsedData.nodes, (node, nodeIndex) => {
            if (nodesWithLinkMap[nodeIndex] !== true) node.hidden = true;
          });
        }
      };

      const zoomed = (translate, scale) => {
        scale = scale || 1;
        container.attr("transform", `translate(${translate})scale(${scale})`);
        graphZoomConfig.value = scale;
        diagram.config(GRAPH_ZOOM, graphZoomConfig);
      };

      const dragstarted = function() {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
        force.start();
      };

      const dragged = function(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      };

      const dragended = function() {
        d3.select(this).classed("dragging", false);
      };

      const setRelationships = () => {
        _.each(parsedData.nodes, diagram.generateEmptyRelationships, diagram);
        _.each(parsedData.nodes, (node) => {
          diagram.addSelfRelationship(node, node.shapeEl, node);
        });
        _.each(parsedData.links, (link) => {
          diagram.addDependencyRelationship(link.source, link.target.shapeEl, link.target);
          diagram.addDependantRelationship(link.target, link.source.shapeEl, link.source);
        });
      };

      const getAllLinks = () => {
        return container.selectAll(".link");
      };

      const getLinksWithIsHiding = () => {
        return getAllLinks().filter((d) => {
          return d.data.hasOwnProperty('shyIsHiding');
        });
      };

      const setLinkIsHidingIfNecessary = (isHiding, link) => {
        let linksWithIsHiding;

        if (diagram.config(SHY_CONNECTIONS)) {
          if (isHiding === false) link.data.shyIsHiding = isHiding;
          else if (isHiding === true) {
            linksWithIsHiding = getLinksWithIsHiding();
            linksWithIsHiding.each((d) => {
              d.data.shyIsHiding = true;
            });
          }
          link.data.shyIsHidingChanged = true;
        }
      };

      const setDisplayOfShyConnections = (display, node) => {
        const isShowing = display === 'show';
        const isHiding = display === 'hide';
        const nodeData = node.data;
        const linksWithIsHiding = getLinksWithIsHiding();
        const nodeLinks = getAllLinks().filter((d) => {
          return d.source.id === nodeData.id || d.target.id === nodeData.id;
        });
        const setDisplay = (links, show) => {
          links.classed('shy-link-hidden', !show);
          links.classed('shy-link-showed', show);
        };
        const hideLinks = (links) => {
          setDisplay(links, false);
          links.each((d) => {
            delete d.data.shyIsHiding;
          });
        };
        const futureConditionalHide = () => {
          setTimeout(() => {
            allAreHiding = true;
            shyIsHidingIsSame = true;
            nodeLinks.each((d) => {
              allAreHiding = allAreHiding && d.data.shyIsHiding;

              if (d.data.shyIsHidingChanged) {
                shyIsHidingIsSame = false;
                delete d.data.shyIsHidingChanged;
              }
            });

            if (allAreHiding && shyIsHidingIsSame) hideLinks(nodeLinks);
            else futureConditionalHide();
          }, 500);
        };
        let allAreHiding, shyIsHidingIsSame;

        if (linksWithIsHiding[0].length === 0) {
          if (isShowing) setDisplay(nodeLinks, true);
          else if (isHiding) {
            nodeLinks.each((d) => {
              d.data.shyIsHiding = true;
            });
            futureConditionalHide();
          }
        } else {
          if (isShowing) {
            linksWithIsHiding.each((d, index) => {
              if (index === 0) d.data.shyIsHiding = false;
            });
          } else if (isHiding) setLinkIsHidingIfNecessary(true, linksWithIsHiding.data()[0]);
        }
      };

      const setReRender = _.partial(helpers.setReRender, diagram, creationId, data, _);

      diagram.markRelatedFn = (item) => {
        item.el.style('stroke-width', '20px');
      };
      diagram.unmarkAllItems = () => {
        _.each(parsedData.nodes, (node) => {
          node.shapeEl.style('stroke-width', '1px');
        });
      };

      conf = conf || {};
      parseData();

      svg.attr({
        height,
        class: 'graph-diagram',
      });

      zoom = d3.behavior.zoom().scaleExtent([0.1, 10]).on("zoom", () => {
        zoomed(d3.event.translate, d3.event.scale);
      });

      svg.call(zoom);

      zoom.translate([100, 100])
        .scale(diagram.config(GRAPH_ZOOM).value);

      zoomed(zoom.translate(), zoom.scale());

      force = d3.layout.force()
        .size([width, height])
        .charge(conf.charge || -10000)
        .linkDistance(conf.linkDistance || 140)
        .on("tick", tick);

      drag = d3.behavior.drag().origin((d) => {
        return d;
      }).on("dragstart", dragstarted).on("drag", dragged).on("dragend", dragended);

      force.nodes(parsedData.nodes).links(parsedData.links).start();

      container.append("svg:defs").selectAll("marker")
        .data(markers)
        .enter().append("svg:marker")
        .attr({
          class: 'arrow-head',
          fill: dTextFn('color'),
          id: dTextFn('id', 'arrow-head-'),
          markerHeight: 8,
          markerWidth: 8,
          orient: 'auto',
          refX: 19,
          refY: curvedArrows ? -1.5 : 0,
          viewBox: '0 -5 10 10',
        }).append("svg:path").attr("d", "M0,-5L10,0L0,5");

      link = container.selectAll(".link").data(parsedData.links).enter().append('g')
        .attr("class", () => {
          let finalClass = 'link';

          if (diagram.config(SHY_CONNECTIONS)) finalClass += ' shy-link shy-link-hidden';

          return finalClass;
        });
      link.append("svg:path").attr({
        class: 'link-path',
        "marker-end": (d) => {
          return `url(#arrow-head-${d.source.id})`;
        },
      }).style({
        stroke: dTextFn('color'),
        'stroke-dasharray': (d) => {
          if (d.data.line === 'plain') return null;
          else if (d.data.line === 'dotted') return '5,5';
        },
      });

      linkOuter = link.append('g');
      linkOuter.append('svg:path').attr('class', 'link-path-outer');
      linkOuter.each(function(d) {
        diagram.addMouseListenersToEl(d3.select(this), d.data, {
          mouseenter(link) {
            setLinkIsHidingIfNecessary(false, link);
          },
          mouseleave(link) {
            setLinkIsHidingIfNecessary(true, link);
          },
        });
      });

      node = container.selectAll(".node").data(parsedData.nodes).enter().append('g').attr({
        class(d) {
          let finalClass = 'node';

          if (d.hidden === true) finalClass += ' node-hidden';

          return finalClass;
        },
        id: dTextFn('id', 'node-'),
      });

      node.each(function(singleNode) {
        let singleNodeClasses = '';

        singleNodeEl = d3.select(this);
        singleNode.fullText = d.utils
          .generateATextDescriptionStr(singleNode.name, singleNode.description);

        if (singleNode.shape === 'circle') {
          shapeEl = singleNodeEl.append("circle").attr({
            r: 12,
            fill: dTextFn('color'),
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
            fill: dTextFn('color'),
          });
          d.utils.applySimpleTransform(shapeEl);
        }

        if (dragNodesConfig === true) shapeEl.call(drag);

        if (singleNode.bold === true) singleNodeClasses += ' bold';
        else singleNodeClasses += ' thin';
        shapeEl.attr('class', singleNodeClasses);

        singleNode.shapeEl = shapeEl;
        diagram.addMouseListenersToEl(shapeEl, singleNode, {
          mouseenter(data) {
            if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('show', data);
          },
          mouseleave(data) {
            if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('hide', data);
          },
          click(node) {
            if (node.data.linkToUrl) window.open(node.data.linkToUrl);
          },
        });
      });

      node.append("text").text(dTextFn('name'));

      setRelationships();
      setReRender(conf);
      diagram.listen('configuration-changed', (conf) => {
        if (conf.key === SHY_CONNECTIONS || conf.key === GRAPH_DRAG) {
          setReRender(conf);
          diagram.removePreviousAndCreate(creationId, data, conf);
        }
      });
    }
  };

  new Graph({
    name: 'graph',
    helpers,
    configurationKeys: {
      SHY_CONNECTIONS,
    },
    configuration: {
      info: null,
      [SHY_CONNECTIONS]: true,
      [GRAPH_ZOOM]: graphZoomConfig,
      [GRAPH_DRAG]: false,
      [CURVED_ARROWS]: false,
    },
  });
};
