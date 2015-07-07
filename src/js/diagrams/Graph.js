var dPositionFn = d.utils.positionFn,
  dTextFn = d.utils.textFn,
  helpers = {
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
    generateNode: function() {
      var node = {
          name: arguments[0]
        },
        linksInfo;

      linksInfo = _.isString(arguments[1]) ? arguments[1] : String(arguments[1]);
      linksInfo = linksInfo.split(' ').map(Number);
      if (linksInfo.length > 0) node.id = linksInfo[0];
      if (linksInfo.length > 1) {
        node.calledBy = [];
        _.each(linksInfo, function(nodeId, index) {
          if (index > 0) node.calledBy.push(nodeId);
        });
      }
      if (arguments.length > 2) node.description = arguments[2];
      if (arguments.length > 3) node.options = helpers.generateNodeOptions(arguments[3]);

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
    }
  },
  Graph, helpers;

Graph = class Graph extends d.Diagram {
  create(data, conf) {
    var bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      svg = d.svg.generateSvg(),
      container = svg.append('g'),
      height = bodyHeight - 250,
      width = svg.attr('width'),
      tick = function() {
        link.select('path.link-path').attr("d", function(d) {
          var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
          return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
        });

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
          nodeId, color, options, sourceNode;

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
            calledBy: node.calledBy || [],
            description: node.description || null,
            color: color,
            shape: options.shape || 'circle',
            bold: options.bold || false
          });
          idsMap[nodeId] = {
            index: nodeIndex
          };
          if (_.isArray(node.calledBy) && node.calledBy.length > 0) {
            idsMap[nodeId].color = color;
            markers.push({
              id: nodeId,
              color: color
            });
          }
        });

        _.each(parsedData.nodes, function(node, nodeIndex) {
          if (node.calledBy.length > 0) {
            _.each(node.calledBy, function(calledById) {
              sourceNode = idsMap[calledById];
              if (sourceNode) {
                if (conf.hideNodesWithoutLinks) {
                  nodesWithLinkMap[idsMap[calledById].index] = true;
                  nodesWithLinkMap[nodeIndex] = true;
                }
                parsedData.links.push({
                  source: idsMap[calledById].index,
                  target: nodeIndex,
                  color: idsMap[node.id].color,
                  targetId: node.id
                });
              }
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
      setDependantsAndDependencies = function() {
        _.each(parsedData.nodes, function(node) {
          node.dependants = [];
          node.dependencies = [];
        });
        _.each(parsedData.links, function(link) {
          link.source.dependencies.push(link.target);
          link.target.dependants.push(link.source);
        });
      },
      force, drag, link, node, zoom, singleNodeEl, shape, shapeEl, markers, parsedData;

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
      "marker-end": dTextFn('targetId', 'url(#arrow-head-', ')')
    }).style('stroke', dTextFn('color'));
    node = container.selectAll(".node").data(parsedData.nodes).enter().append('g').attr({
      'class': function(d) {
        var finalClass = 'node';
        if (d.hidden === true) finalClass += ' node-hidden';
        return finalClass;
      },
      id: dTextFn('id', 'node-')
    });

    node.each(function(singleNode) {
      var itemText = d.tooltip.generateATextDescriptionStr(singleNode.name, singleNode.description),
        singleNodeClasses = '';
      singleNodeEl = d3.select(this);
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

      // Add this when there is a checkbox to disable it as it may be annoying

      d.tooltip.setMouseListeners(shapeEl, 'node-' + singleNode.id, itemText);
    });
    node.append("text").text(dTextFn('name'));

    setDependantsAndDependencies();
  }
};

new Graph({
  name: 'graph',
  helpers: helpers
});
