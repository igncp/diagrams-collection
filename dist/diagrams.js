'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (scope) {
  var diagrams = {},
      d = diagrams;

  (function () {})();(function () {
    d.Diagram = (function () {
      function Diagram(opts) {
        _classCallCheck(this, Diagram);

        var prototype = Object.getPrototypeOf(this);

        this.name = opts.name;
        _.defaults(prototype, opts.helpers);
        this.register();
      }

      _createClass(Diagram, [{
        key: 'register',
        value: function register() {
          var diagram = this;
          d[diagram.name] = function () {
            var args = arguments;
            d.utils.runIfReady(function () {
              diagram.create.apply(diagram, args);
            });
          };

          _.defaults(d[diagram.name], Object.getPrototypeOf(diagram));
        }
      }]);

      return Diagram;
    })();
  })();(function () {
    d.shapes = {};
    d.shapes.hexagon = function (opts) {
      var halfHeight = opts.height / 2,
          halfWidth = opts.width / 2,
          gap = opts.widthPercent ? (1 - opts.widthPercent / 100) * opts.width : (opts.width - opts.height) / 2,
          result = '',
          center,
          cx,
          cy;

      center = opts.center || [halfWidth, halfHeight];
      cx = center[0];
      cy = center[1];

      result += 'M' + (cx - halfWidth) + ',' + cy;
      result += 'L' + (cx - halfWidth + gap) + ',' + (cy + halfHeight);
      result += 'L' + (cx + halfWidth - gap) + ',' + (cy + halfHeight);
      result += 'L' + (cx + halfWidth) + ',' + cy;
      result += 'L' + (cx + halfWidth - gap) + ',' + (cy - halfHeight);
      result += 'L' + (cx - halfWidth + gap) + ',' + (cy - halfHeight);
      result += 'Z';

      return result;
    };
  })();(function () {
    d.shared = {
      get: function get(key) {
        if (key === 'set' || key === 'get') throw new Error('Reserved keyword: ' + key);
        return d.shared[key];
      },
      set: function set(data) {
        var keys = Object.keys(data);
        if (_.contains(keys, 'get') || _.contains(keys, 'set')) throw new Error('Reserved keyword in data: ' + data);
        d.shared = _.defaults(d.shared, data);
      }
    };
  })();(function () {
    d.svg = {};
    d.svg.addVerticalGradientFilter = function (container, id, colors) {
      var defs = container.append('defs'),
          linearGradient = defs.append('linearGradient').attr({
        id: id,
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%'
      });

      linearGradient.append('stop').attr('offset', '0%').style({
        'stop-color': colors[0],
        'stop-opacity': 1
      });
      linearGradient.append('stop').attr('offset', '100%').style({
        'stop-color': colors[1],
        'stop-opacity': 1
      });
    };

    d.svg.addFilterColor = function (id, container, deviation, slope, extra) {
      var defs = container.append('defs'),
          filter = defs.append('filter').attr({
        id: 'diagrams-drop-shadow-' + id
      });

      if (extra) filter.attr({
        width: '500%',
        height: '500%',
        x: '-200%',
        y: '-200%'
      });
      filter.append('feOffset').attr({
        result: 'offOut',
        'in': 'SourceGraphic',
        dx: 0.5,
        dy: 0.5
      });
      filter.append('feGaussianBlur').attr({
        result: 'blurOut',
        'in': 'offOut',
        stdDeviation: deviation
      });
      filter.append('feBlend').attr({
        'in': 'SourceGraphic',
        in2: 'blurOut',
        mode: 'normal'
      });
      filter.append('feComponentTransfer').append('feFuncA').attr({
        type: 'linear',
        slope: slope
      });
    };

    d.svg.generateSvg = function (style) {
      var bodyDims = document.body.getBoundingClientRect();

      return d3.select('body').append('svg').attr({
        width: bodyDims.width - 40,
        height: 4000
      }).style(style);
    };

    d.svg.updateHeigthOfElWithOtherEl = function (el, otherEl, offset) {
      el.attr({
        height: otherEl[0][0].getBoundingClientRect().height + (offset || 0)
      });
    };

    d.svg.textEllipsis = function (width) {
      return function () {
        var self = d3.select(this),
            textLength = self.node().getComputedTextLength(),
            text = self.text();
        while (textLength > width && text.length > 0) {
          text = text.slice(0, -4);
          self.text(text + '...');
          textLength = self.node().getComputedTextLength();
        }
      };
    };
  })();(function () {
    d.tooltip = function (display, elementAbove, content) {
      var tooltipId = 'diagrams-tooltip',
          tooltip = d3.select('#' + tooltipId),
          tooltipStyle = '',
          bodyHeight = (function () {
        var body = document.body,
            html = document.documentElement;
        return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      })(),
          highlightCodeIfAny = function highlightCodeIfAny() {
        content = d.utils.formatTextFragment(content);
      },
          formatAndAddContent = function formatAndAddContent() {
        highlightCodeIfAny();
        tooltip.html(content);
      },
          tooltipHeight,
          tooltipTop,
          body,
          otherElementDims;

      if (content !== false) {
        if (tooltip[0][0] === null) {
          body = d3.select('body');
          tooltip = body.insert('div', 'svg').attr({
            id: tooltipId
          });
        }

        if (display === 'show') {
          tooltipStyle += 'display: inline-block; ';
          formatAndAddContent();

          if (typeof elementAbove === 'string') elementAbove = document.getElementById(elementAbove);else elementAbove = document.getElementById(elementAbove[0][0].id);
          otherElementDims = elementAbove.getBoundingClientRect();

          tooltip.attr('style', tooltipStyle + '; opacity: 0');
          tooltipHeight = tooltip.node().getBoundingClientRect().height;

          tooltipTop = otherElementDims.top + otherElementDims.height + document.body.scrollTop + 20;
          if (tooltipTop + tooltipHeight > bodyHeight) {
            tooltipTop = otherElementDims.top + document.body.scrollTop - 20 - tooltipHeight;
            if (tooltipTop < 0) {
              tooltipTop = otherElementDims.top + otherElementDims.height + document.body.scrollTop - tooltipHeight;
            }
          }
          tooltipStyle += 'top: ' + tooltipTop + 'px; ';
        } else if (display === 'hide') tooltipStyle += 'display: none; ';

        tooltip.attr('style', tooltipStyle);
      }
    };

    d.tooltip.onMouseEnterListenerFn = _.partial(d.tooltip, 'show');
    d.tooltip.onMouseLeaveListenerFn = _.partial(d.tooltip, 'hide');

    d.tooltip.setMouseListeners = function (el, elId, text) {
      el.on('mouseenter', function () {
        d.tooltip.onMouseEnterListenerFn(elId, text);
      });
      el.on('mouseleave', function () {
        d.tooltip.onMouseLeaveListenerFn();
      });
    };
    d.tooltip.generateATextDescriptionStr = function (text, description) {
      return '<strong>' + text + '</strong>' + (description ? '<br>' + description : '');
    };
  })();(function () {
    d.utils = {};
    d.utils.d3DefaultReturnFn = function (props, preffix, suffix) {
      props = props.split('.');
      return function (d) {
        var position = _.reduce(props, function (memo, property) {
          return memo[property];
        }, d);
        return preffix || suffix ? preffix + position + suffix : position;
      };
    };
    d.utils.applySimpleTransform = function (el) {
      el.attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    };
    d.utils.positionFn = function (props, offset) {
      offset = offset || 0;
      return d.utils.d3DefaultReturnFn(props, 0, offset);
    };
    d.utils.textFn = function (props, preffix, suffix) {
      preffix = preffix || '';
      suffix = suffix || '';
      return d.utils.d3DefaultReturnFn(props, preffix, suffix);
    };
    d.utils.runIfReady = function (fn) {
      if (document.readyState === 'complete') fn();else window.onload = fn;
    };
    d.utils.fillBannerWithText = function (content) {
      var bannerId = 'diagrams-banner',
          previousBanner = d3.select('#' + bannerId),
          body = d3.select('body');

      if (previousBanner) previousBanner.remove();
      body.insert('div', 'svg').attr({
        id: bannerId
      }).html(d.utils.formatTextFragment(content));
    };
    d.utils.replaceCodeFragmentOfText = function (text, predicate) {
      var codeRegex = /``([\s\S]*?)``([\s\S]*?)``/g,
          allMatches = text.match(codeRegex);

      return text.replace(codeRegex, function (matchStr, language, codeBlock) {
        return predicate(matchStr, language, codeBlock, allMatches);
      });
    };
    d.utils.formatTextFragment = function (text) {
      text = d.utils.replaceCodeFragmentOfText(text, function (matchStr, language, code, allMatches) {
        var lastMatch = matchStr === _.last(allMatches);
        return '<pre' + (lastMatch ? ' class="last-code-block" ' : '') + '><code>' + hljs.highlight(language, code).value + '</pre></code>';
      });
      return text;
    };
    d.utils.codeBlockOfLanguageFn = function (language, commentsSymbol) {
      commentsSymbol = commentsSymbol || '';
      return function (codeBlock, where, withInlineStrs) {
        if (withInlineStrs === true) codeBlock = commentsSymbol + ' ...\n' + codeBlock + '\n' + commentsSymbol + ' ...';
        if (_.isString(where)) codeBlock = commentsSymbol + ' @' + where + '\n' + codeBlock;
        return '``' + language + '``' + codeBlock + '``';
      };
    };
    // This function is created to be able to reference it in the diagrams
    d.utils.wrapInParagraph = function (text) {
      return '<p>' + text + '</p>';
    };
  })();(function () {
    var helpers = {
      generateDefinitionWithSharedGet: function generateDefinitionWithSharedGet() {
        var text = arguments[0],
            sharedKey,
            preffix;

        preffix = arguments.length > 1 ? arguments[1] : '';
        sharedKey = preffix + text.split('(')[0];

        return Box.generateDefinition(text, d.shared.get(sharedKey));
      },

      addConvertToLayersButton: function addConvertToLayersButton(origConf) {
        var body = d3.select('body');

        body.insert('div', 'svg').append('input').attr({
          type: 'button',
          'class': 'conversion-button',
          value: 'Convert to layers diagram',
          onclick: 'diagrams.box.convertToLayerWrapper()' // refactor this
        });

        diagrams.box.convertToLayerWrapper = function () {
          helpers.convertToLayer(origConf);
        };
      },

      convertToLayer: function convertToLayer(origConf) {
        var convertDataToLayers = function convertDataToLayers(items) {
          _.each(items, function (item, index) {
            if (_.isString(item)) {
              item = items[index] = {
                text: item
              };
            }
            if (item.description) item.text += ': ' + item.description;
            if (item.items) convertDataToLayers(item.items);else item.items = [];
          });
        },
            createLayers = function createLayers() {
          var svg = d3.select('svg'),
              input = d3.select('input');

          svg.remove();
          input.remove();
          d.layer(layersData);
        },
            layersData = [];

        layersData.push({
          text: origConf.name,
          items: origConf.body
        });
        convertDataToLayers(layersData[0].items);
        createLayers();
      },

      generateContainer: function generateContainer(text, description, items) {
        var container;

        if (_.isArray(description)) {
          items = description;
          description = null;
        }

        container = {
          type: 'container',
          text: text,
          items: items,
          description: description
        };

        return container;
      },

      generateLink: function generateLink(text, url) {
        return {
          type: 'link',
          text: text,
          url: url
        };
      },

      generateDefinition: function generateDefinition(text, description) {
        return {
          type: 'definition',
          text: text,
          description: description
        };
      }
    },
        textGId = 0,
        Box;

    Box = (function (_d$Diagram) {
      function Box() {
        _classCallCheck(this, Box);

        _get(Object.getPrototypeOf(Box.prototype), 'constructor', this).apply(this, arguments);
      }

      _inherits(Box, _d$Diagram);

      _createClass(Box, [{
        key: 'create',
        value: function create(conf) {
          var origConf = _.cloneDeep(conf),
              svg = d.svg.generateSvg(),
              width = svg.attr('width') - 40,
              nameHeight = 50,
              boxG = svg.append('g').attr({
            transform: 'translate(20, 20)',
            'class': 'box-diagram'
          }),
              nameG = boxG.append('g'),
              bodyG = boxG.append('g').attr({
            transform: 'translate(0, ' + nameHeight + ')'
          }),
              bodyPosition = 1,
              rowHeight = 30,
              depthWidth = 35,
              addBodyItems = function addBodyItems(items, container, depth) {
            var newContainer, text, textG, textWidth, descriptionWidth, containerText;

            items = items || conf.body;
            container = container || bodyG;
            depth = depth || 1;

            _.each(items, function (item) {
              var currentTextGId, tooltipText;

              currentTextGId = 'diagrams-box-text-' + textGId++;
              if (item.type === 'container') {
                newContainer = container.append('g');
                containerText = '· ' + item.text;
                if (item.items && item.items.length > 0) containerText += ':';
                if (item.description) {
                  tooltipText = d.tooltip.generateATextDescriptionStr(containerText, item.description);
                  containerText += ' (...)';
                } else {
                  tooltipText = false;
                }
                textG = newContainer.append('text').text(containerText).attr({
                  x: depthWidth * depth,
                  y: rowHeight * ++bodyPosition,
                  id: currentTextGId
                });
                // item.items = _.sortBy(item.items, 'text');
                addBodyItems(item.items, newContainer, depth + 1);
              } else if (item.type === 'link') {
                textG = container.append('svg:a').attr('xlink:href', item.url).append('text').text(item.text).attr({
                  id: currentTextGId,
                  x: depthWidth * depth,
                  y: rowHeight * ++bodyPosition,
                  fill: '#3962B8'
                });

                tooltipText = item.text + ' (' + item.url + ')';
              } else if (item.type === 'definition') {
                textG = container.append('g').attr({
                  id: currentTextGId
                });
                text = textG.append('text').text(item.text).attr({
                  x: depthWidth * depth,
                  y: rowHeight * ++bodyPosition
                }).style({
                  'font-weight': 'bold'
                });
                if (item.description) {
                  textWidth = text[0][0].getBoundingClientRect().width;
                  descriptionWidth = svg[0][0].getBoundingClientRect().width - textWidth - depthWidth * depth - 30;

                  textG.append('text').text('- ' + item.description).attr({
                    x: depthWidth * depth + textWidth + 5,
                    y: rowHeight * bodyPosition - 1
                  }).each(d.svg.textEllipsis(descriptionWidth));
                }

                tooltipText = d.tooltip.generateATextDescriptionStr(item.text, item.description);
              } else if (_.isString(item)) {
                textG = container.append('text').text(item).attr({
                  id: currentTextGId,
                  x: depthWidth * depth,
                  y: rowHeight * ++bodyPosition
                });

                tooltipText = item;
              }
              d.tooltip.setMouseListeners(textG, currentTextGId, tooltipText);
            });
          },
              bodyRect;

          d.svg.addFilterColor('box', svg, 3, 4);

          nameG.append('rect').attr({
            height: nameHeight,
            width: width,
            stroke: '#000',
            fill: '#fff'
          }).style({
            filter: 'url(#diagrams-drop-shadow-box)'
          });
          nameG.append('text').attr({
            x: width / 2,
            y: 30
          }).text(conf.name).style({
            'font-weight': 'bold',
            'text-anchor': 'middle'
          });

          bodyRect = bodyG.append('rect').attr({
            width: width,
            stroke: '#000',
            fill: '#fff'
          }).style({
            filter: 'url(#diagrams-drop-shadow-box)'
          });
          addBodyItems();
          d.svg.updateHeigthOfElWithOtherEl(svg, boxG, 50);
          d.svg.updateHeigthOfElWithOtherEl(bodyRect, boxG, 25 - nameHeight);
          helpers.addConvertToLayersButton(origConf);
        }
      }]);

      return Box;
    })(d.Diagram);

    new Box({
      name: 'box',
      helpers: helpers
    });
  })();(function () {
    var dPositionFn = d.utils.positionFn,
        dTextFn = d.utils.textFn,
        helpers = {
      generateNodeOptions: function generateNodeOptions(options) {
        var obj = {},
            shape;
        if (_.isString(options)) return helpers.generateNodeOptions(options.split(' '));else if (_.isArray(options)) {
          _.each(options, function (opt) {
            if (opt.substr(0, 2) === 's-') {
              shape = opt.substr(2, opt.length - 2);
              if (shape === 't') obj.shape = 'triangle';else if (shape === 's') obj.shape = 'square';else obj.shape = 'circle';
            } else if (opt === 'b') obj.bold = true;
          });
          return obj;
        }
      },
      generateNode: function generateNode() {
        var node = {
          name: arguments[0]
        },
            linksInfo;

        linksInfo = _.isString(arguments[1]) ? arguments[1] : String(arguments[1]);
        linksInfo = linksInfo.split(' ').map(Number);
        if (linksInfo.length > 0) node.id = linksInfo[0];
        if (linksInfo.length > 1) {
          node.calledBy = [];
          _.each(linksInfo, function (nodeId, index) {
            if (index > 0) node.calledBy.push(nodeId);
          });
        }
        if (arguments.length > 2) node.description = arguments[2];
        if (arguments.length > 3) node.options = helpers.generateNodeOptions(arguments[3]);

        return node;
      },
      generateNodeWithSharedGet: function generateNodeWithSharedGet() {
        var text = arguments[0],
            sharedKey,
            preffix,
            options;

        preffix = arguments.length > 2 ? arguments[2] : '';
        sharedKey = preffix + text.split('(')[0];
        options = arguments.length > 3 ? arguments[3] : null;

        return helpers.generateNode(text, arguments[1], d.shared.get(sharedKey), options);
      },
      generateFnNodeWithSharedGetAndBoldIfFile: function generateFnNodeWithSharedGetAndBoldIfFile(file) {
        return function () {
          var opts = '',
              preffix = '';
          if (arguments[0].split('@')[0] === file) opts = 'b';
          if (arguments.length > 2) preffix = arguments[2];
          if (arguments.length > 3) opts = arguments[3] + ' ' + opts;
          return helpers.generateNodeWithSharedGet(arguments[0], arguments[1], preffix, opts);
        };
      }
    },
        Graph,
        helpers;

    Graph = (function (_d$Diagram2) {
      function Graph() {
        _classCallCheck(this, Graph);

        _get(Object.getPrototypeOf(Graph.prototype), 'constructor', this).apply(this, arguments);
      }

      _inherits(Graph, _d$Diagram2);

      _createClass(Graph, [{
        key: 'create',
        value: function create(data, conf) {
          var bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
              svg = d.svg.generateSvg(),
              container = svg.append('g'),
              height = bodyHeight - 50,
              width = svg.attr('width'),
              tick = function tick() {
            link.select('path.link-path').attr('d', function (d) {
              var dx = d.target.x - d.source.x,
                  dy = d.target.y - d.source.y,
                  dr = Math.sqrt(dx * dx + dy * dy);
              return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
            });

            node.each(function (singleNode) {
              if (singleNode.shape === 'circle') {
                node.select('circle').attr('cx', dPositionFn('x')).attr('cy', dPositionFn('y'));
              } else {
                if (singleNode.shape === 'triangle') shapeEl = node.select('path.triangle');else if (singleNode.shape === 'square') shapeEl = node.select('path.square');

                d.utils.applySimpleTransform(shapeEl);
              }
            });
            node.select('text').attr('x', dPositionFn('x')).attr('y', dPositionFn('y', -20));
          },
              parseData = function parseData() {
            var maxId = _.reduce(data, function (memo, node) {
              var id = node.id || 0;
              return memo > id ? memo : id;
            }, 0),
                idsMap = {},
                nodesWithLinkMap = {},
                colors = d3.scale.category10(),
                nodeId,
                color,
                options,
                sourceNode;

            parsedData = {
              links: [],
              nodes: []
            };
            markers = [];
            _.each(data, function (node, nodeIndex) {
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

            _.each(parsedData.nodes, function (node, nodeIndex) {
              if (node.calledBy.length > 0) {
                _.each(node.calledBy, function (calledById) {
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
              _.each(parsedData.nodes, function (node, nodeIndex) {
                if (nodesWithLinkMap[nodeIndex] !== true) node.hidden = true;
              });
            }
          },
              zoomed = function zoomed() {
            container.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
          },
              dragstarted = function dragstarted() {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed('dragging', true);
            force.start();
          },
              dragged = function dragged(d) {
            d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
          },
              dragended = function dragended() {
            d3.select(this).classed('dragging', false);
          },
              force,
              drag,
              link,
              node,
              zoom,
              singleNodeEl,
              shape,
              shapeEl,
              markers,
              parsedData;

          conf = conf || {};
          parseData();

          svg.attr({
            height: height,
            'class': 'graph-diagram'
          });

          zoom = d3.behavior.zoom().scaleExtent([0.1, 10]).on('zoom', zoomed);
          svg.call(zoom);

          force = d3.layout.force().size([width, height]).charge(conf.charge || -10000).linkDistance(conf.linkDistance || 140).on('tick', tick);

          drag = d3.behavior.drag().origin(function (d) {
            return d;
          }).on('dragstart', dragstarted).on('drag', dragged).on('dragend', dragended);

          force.nodes(parsedData.nodes).links(parsedData.links).start();

          container.append('svg:defs').selectAll('marker').data(markers).enter().append('svg:marker').attr({
            id: dTextFn('id', 'arrow-head-'),
            'class': 'arrow-head',
            fill: dTextFn('color'),
            viewBox: '0 -5 10 10',
            refX: 19,
            refY: -1.5,
            markerWidth: 8,
            markerHeight: 8,
            orient: 'auto'
          }).append('svg:path').attr('d', 'M0,-5L10,0L0,5');

          link = container.selectAll('.link').data(parsedData.links).enter().append('g').attr('class', 'link');
          link.append('svg:path').attr({
            'class': 'link-path',
            'marker-end': dTextFn('targetId', 'url(#arrow-head-', ')')
          }).style('stroke', dTextFn('color'));
          node = container.selectAll('.node').data(parsedData.nodes).enter().append('g').attr({
            'class': function _class(d) {
              var finalClass = 'node';
              if (d.hidden === true) finalClass += ' node-hidden';
              return finalClass;
            },
            id: dTextFn('id', 'node-')
          });

          node.each(function (singleNode) {
            var tooltipText = d.tooltip.generateATextDescriptionStr(singleNode.name, singleNode.description),
                singleNodeClasses = '';
            singleNodeEl = d3.select(this);
            if (singleNode.shape === 'circle') {
              shapeEl = singleNodeEl.append('circle').attr({
                r: 12,
                fill: dTextFn('color')
              });
            } else {
              shape = d3.svg.symbol().size(750);
              shapeEl = singleNodeEl.append('path');
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
            if (singleNode.bold === true) singleNodeClasses += ' bold';else singleNodeClasses += ' thin';
            shapeEl.attr('class', singleNodeClasses);
            d.tooltip.setMouseListeners(shapeEl, 'node-' + singleNode.id, tooltipText);
          });
          node.append('text').text(dTextFn('name'));
        }
      }]);

      return Graph;
    })(d.Diagram);

    new Graph({
      name: 'graph',
      helpers: helpers
    });
  })();(function () {
    var layerGId = 0,
        dTextFn = d.utils.textFn,
        helpers = {
      ids: 0,
      Grid: (function () {
        function Grid(fixedWidth) {
          _classCallCheck(this, Grid);

          this.position = {
            x: 0,
            y: 0
          };
          this.width = fixedWidth;
          this.cells = [];
        }

        _createClass(Grid, [{
          key: 'addItemAtNewRow',
          value: function addItemAtNewRow(item) {
            var counter = 0;

            this.position.x = 0;
            while (counter < 1000) {
              this.position.y += 1;
              if (this.itemFitsAtCurrentPos(item)) break;
            }
            this.addItemAtCurrentPos(item);
          }
        }, {
          key: 'addItemAtCurrentPos',
          value: function addItemAtCurrentPos(item) {
            this.addItemAtPos(item, this.position);
          }
        }, {
          key: 'createRowIfNecessary',
          value: function createRowIfNecessary(posY) {
            if (_.isUndefined(this.cells[posY])) this.cells[posY] = [];
          }
        }, {
          key: 'addItemAtPos',
          value: function addItemAtPos(item, pos) {
            var row;
            item.x = pos.x;
            item.y = pos.y;
            for (var i = 0; i < item.height; i++) {
              this.createRowIfNecessary(i + pos.y);
              row = this.cells[i + pos.y];
              for (var j = 0; j < item.width; j++) {
                row[j + pos.x] = true;
              }
            }
            this.updatePosition();
          }
        }, {
          key: 'updatePosition',
          value: function updatePosition() {
            var counter = 0;
            while (counter < 1000) {
              this.position.x += 1;
              if (this.position.x === this.width) {
                this.position.x = -1;
                this.position.y += 1;
                this.createRowIfNecessary(this.position.y);
              } else if (this.cells[this.position.y][this.position.x] !== true) {
                break;
              }
              counter++;
            }
          }
        }, {
          key: 'itemFitsAtPos',
          value: function itemFitsAtPos(item, pos) {
            var row;
            for (var i = 0; i < item.height; i++) {
              row = this.cells[i + pos.y];
              if (_.isUndefined(row)) return true;
              for (var j = 0; j < item.width; j++) {
                if (row[j + pos.x] === true) return false;
                if (j + pos.x + 1 > this.width) return false;
              }
            }
            return true;
          }
        }, {
          key: 'itemFitsAtCurrentPos',
          value: function itemFitsAtCurrentPos(item) {
            return this.itemFitsAtPos(item, this.position);
          }
        }, {
          key: 'movePositionToNextRow',
          value: function movePositionToNextRow() {
            this.position.y++;
            this.position.x = 0;
            this.createRowIfNecessary(this.position.y);
          }
        }, {
          key: 'lastRowIsEmpty',
          value: function lastRowIsEmpty() {
            var rows = this.cells.length;
            for (var i = 0; i < this.width; i++) {
              if (this.cells[rows - 1][i] === true) return false;
            }
            return true;
          }
        }, {
          key: 'getSize',
          value: function getSize() {
            var rows = this.cells.length;
            return {
              width: this.width,
              height: this.lastRowIsEmpty() ? rows - 1 : rows
            };
          }
        }]);

        return Grid;
      })(),

      config: {
        widthSize: 350,
        heightSize: 60,
        depthWidthFactor: 4,
        depthHeightFactor: 2,
        showNumbersAll: false
      },

      handleConnectedToNextCaseIfNecessary: function handleConnectedToNextCaseIfNecessary(layers, currentIndex) {
        var layer = layers[currentIndex],
            nextLayer = layers[currentIndex + 1],
            connectedTo,
            newId;

        if (layer.hasOwnProperty('connectedWithNext') === true && nextLayer) {
          if (nextLayer.id) newId = nextLayer.id;else {
            newId = 'to-next-' + String(++helpers.ids);
            nextLayer.id = newId;
          }

          if (_.isObject(layer.connectedWithNext) && layer.connectedWithNext.type) {
            connectedTo = {
              id: newId,
              type: layer.connectedWithNext.type
            };
          } else connectedTo = newId;

          if (layer.connectedTo) layer.connectedTo.push(connectedTo);else layer.connectedTo = [connectedTo];
        }
      },

      itemsOfLayerShouldBeSorted: function itemsOfLayerShouldBeSorted(itemsArray) {
        var ret = true;
        _.each(itemsArray, function (item) {
          if (item.hasOwnProperty('connectedTo')) ret = false;
          if (item.hasOwnProperty('connectToNext')) ret = false;
        });
        return ret;
      },

      calculateLayerWithChildrenDimensions: function calculateLayerWithChildrenDimensions(layer) {
        var totalWidth = 0,
            totalHeight = 0,
            maxWidth = 0,
            maxHeight = 0,
            itemsArray = [],
            whileCounter = 0,
            itemsOfLayer,
            grid,
            itemsOfLayerIndex,
            width,
            gridSize,
            itemsShouldBeSorted,
            addedItemToGrid = function addedItemToGrid(index) {
          if (itemsOfLayer[index].inNewRow === true) {
            grid.addItemAtNewRow(itemsOfLayer[index]);
            itemsOfLayer.splice(index, 1);
            return true;
          } else if (grid.itemFitsAtCurrentPos(itemsOfLayer[index])) {
            grid.addItemAtCurrentPos(itemsOfLayer[index]);
            itemsOfLayer.splice(index, 1);
            return true;
          } else return false;
        };

        _.each(layer.items, function (item) {
          totalWidth += item.width;
          totalHeight += item.height;
          maxHeight = item.height > maxHeight ? item.height : maxHeight;
          maxWidth = item.width > maxWidth ? item.width : maxWidth;
          itemsArray.push(item);
        });

        if (totalWidth / 2 >= maxWidth) {
          if (totalHeight > totalWidth) {
            if (totalHeight / 2 < layer.items.length) width = Math.ceil(totalWidth / 2);else width = totalWidth;
          } else width = Math.ceil(totalWidth / 2);
        } else width = maxWidth;

        width = helpers.maxUnityWidth < width ? helpers.maxUnityWidth : width;

        grid = new helpers.Grid(width);

        itemsShouldBeSorted = helpers.itemsOfLayerShouldBeSorted(itemsArray);
        if (itemsShouldBeSorted) {
          itemsOfLayer = itemsArray.sort(function (itemA, itemB) {
            if (itemA.width === itemB.width) {
              return itemA.height < itemB.height;
            } else return itemA.width < itemB.width;
          });
        } else itemsOfLayer = itemsArray;
        addedItemToGrid(0);
        itemsOfLayerIndex = 0;
        while (itemsOfLayer.length > 0 && whileCounter < 1000) {
          if (addedItemToGrid(itemsOfLayerIndex)) {
            itemsOfLayerIndex = 0;
          } else {
            if (itemsShouldBeSorted) {
              itemsOfLayerIndex++;
              if (itemsOfLayerIndex === itemsOfLayer.length) {
                itemsOfLayerIndex = 0;
                grid.movePositionToNextRow();
              }
            } else {
              grid.movePositionToNextRow();
            }
          }
          whileCounter++;
        }

        gridSize = grid.getSize();
        // This two values only persist if the layer is a top one
        layer.x = 0;
        layer.y = 0;
        layer.width = gridSize.width;
        layer.height = layer.items.length > 0 ? gridSize.height + 1 : gridSize.height;
      },

      generateLayersData: function generateLayersData(layers, currentDepth) {
        var config = helpers.config,
            maxDepth,
            itemsDepth;

        currentDepth = currentDepth || 1;
        maxDepth = currentDepth;
        _.each(layers, function (layer, layerIndex) {
          if (layer.showNumbersAll === true) config.showNumbersAll = true;
          layer.depth = currentDepth;
          helpers.handleConnectedToNextCaseIfNecessary(layers, layerIndex);
          if (layer.items.length > 0) {
            itemsDepth = helpers.generateLayersData(layer.items, currentDepth + 1);
            layer.maxLayerDepthBelow = itemsDepth - currentDepth;
            helpers.calculateLayerWithChildrenDimensions(layer);
            maxDepth = maxDepth < itemsDepth ? itemsDepth : maxDepth;
          } else {
            layer.maxLayerDepthBelow = 0;
            layer.width = 1;
            layer.height = 1;
            maxDepth = maxDepth < itemsDepth ? itemsDepth : maxDepth;
          }
          layer.alreadyConnections = [];
        });

        return maxDepth;
      },

      getFinalLayerDimensions: function getFinalLayerDimensions(layer) {
        var config = helpers.config,
            height = layer.height * config.heightSize - config.depthHeightFactor * layer.depth * 2,
            width = layer.width * config.widthSize - config.depthWidthFactor * layer.depth * 2,
            transform = 'translate(' + config.depthWidthFactor * layer.depth + ',' + config.depthHeightFactor * layer.depth + ')',
            fill = 'url(#color-' + String(layer.depth - 1) + ')',
            dimensions = {
          height: height,
          width: width,
          transform: transform,
          fill: fill
        };
        if (config.showNumbersAll === true || layer.containerData && layer.containerData.showNumbers === true) {
          dimensions.numberTransform = 'translate(' + String(width - 15 + config.depthWidthFactor * layer.depth) + ',' + String(config.depthHeightFactor * layer.depth + height + 0) + ')';
        }

        return dimensions;
      },

      addConvertToBoxButton: function addConvertToBoxButton(origConf) {
        var body = d3.select('body');

        body.insert('div', 'svg').append('input').attr({
          type: 'button',
          'class': 'conversion-button',
          value: 'Convert to box diagram',
          onclick: 'diagrams.layer.convertToBoxWrapper()'
        });

        // Refactor this
        diagrams.layer.convertToBoxWrapper = function () {
          helpers.convertToBox(origConf);
        };
      },

      convertToBox: function convertToBox(origConf) {
        var convertDataToBox = function convertDataToBox(items) {
          var texts;
          _.each(items, function (item, index) {
            texts = item.text.split(': ');
            item.text = texts[0];
            if (texts.length > 1) item.description = texts[1];

            if (item.items && item.items.length > 0) {
              item.type = 'container';
              convertDataToBox(item.items);
            } else {
              if (_.isString(item.description) === false) items[index] = item.text;else {
                item.type = 'definition';
                item.items = null;
              }
            }
          });
        },
            createBox = function createBox() {
          var svg = d3.select('svg'),
              input = d3.select('input');

          svg.remove();
          input.remove();
          d.box(boxData);
        },
            boxData;

        if (_.isArray(origConf)) origConf = origConf[0];
        boxData = {
          name: origConf.text,
          body: origConf.items
        };

        convertDataToBox(boxData.body);
        createBox();
      },

      newLayer: function newLayer(text, opts, items) {
        var layer = {
          text: text
        };

        if (_.isArray(opts)) items = opts;else {
          if (_.isString(opts)) opts = helpers.extendOpts(opts);
          if (_.isObject(opts)) layer = _.extend(layer, opts);
        }

        if (items) layer.items = items;
        if (_.isUndefined(layer.id)) layer.id = 'layer-' + ++helpers.ids + '-auto'; // Have to limit the id by the two sides to enable .indexOf to work

        return layer;
      },

      newLayerConnectedToNext: function newLayerConnectedToNext() {
        var args = arguments.length;

        if (args === 1) return helpers.newLayer(arguments[0], 'cn');else if (args === 2) {
          if (typeof arguments[1] === 'object') return helpers.newLayer(arguments[0], 'cn', arguments[1]);else if (typeof (arguments[1] === 'string')) return helpers.newLayer(arguments[0], arguments[1] + ' cn');
        } else if (args === 3) return helpers.newLayer(arguments[0], arguments[1] + ' cn', arguments[2]);
      },

      newLayerConnectedToNextWithCode: function newLayerConnectedToNextWithCode(codeLanguage) {
        var codeFn = diagrams.utils.codeBlockOfLanguageFn(codeLanguage);
        return function () {
          var args = arguments;
          args[0] = codeFn(args[0]);
          return helpers.newLayerConnectedToNext.apply(this, args);
        };
      },

      newLayerConnectedToNextWithParagraphAndCode: function newLayerConnectedToNextWithParagraphAndCode(codeLanguage) {
        var codeFn = diagrams.utils.codeBlockOfLanguageFn(codeLanguage);
        return function () {
          var args = [].splice.call(arguments, 0),
              paragraphText = args[0],
              code = args[1],
              text = d.utils.wrapInParagraph(paragraphText) + codeFn(code);

          args = args.splice(2);
          args.unshift(text);
          return helpers.newLayerConnectedToNext.apply(this, args);
        };
      },

      staticOptsLetters: {
        co: {
          conditional: true
        },
        cn: {
          connectedWithNext: true
        },
        sna: {
          showNumbersAll: true
        },
        sn: {
          showNumbers: true
        },
        cnd: {
          connectedWithNext: {
            type: 'dashed'
          }
        },
        nr: {
          inNewRow: true
        }
      },

      idOpt: function idOpt(id) {
        return {
          id: 'layer-' + id + '-custom'
        };
      },

      extendOpts: function extendOpts() {
        var result = {};

        _.each(arguments, function (arg) {
          if (typeof arg === 'string') {
            _.each(arg.split(' '), function (opt) {
              if (opt.substr(0, 3) === 'id-') result = _.extend(result, helpers.idOpt(opt.substr(3, opt.length)));else if (opt.substr(0, 3) === 'ct-') helpers.connectWithOpt(Number(opt.substr(3, opt.length)), result);else if (opt.substr(0, 4) === 'ctd-') helpers.connectWithOpt(Number(opt.substr(4, opt.length)), result, 'dashed');else result = _.extend(result, helpers.staticOptsLetters[opt]);
            });
          } else if (_.isObject(arg)) {
            result = _.extend(result, arg);
          }
        });

        return result;
      },

      connectWithOpt: function connectWithOpt(ids, result, type) {
        var objs = [];
        if (_.isNumber(ids)) ids = [ids];
        type = type || 'standard';

        _.each(ids, function (id) {
          objs.push({
            id: 'layer-' + id + '-custom',
            type: type
          });
        });

        if (_.isUndefined(result.connectedTo) === true) result.connectedTo = objs;else result.connectedTo = result.connectedTo.concat(objs);
      },

      connectWithOptAndIdOpt: function connectWithOptAndIdOpt(ids, id) {
        var connectWithOpt = diagrams.layer.connectWithOpt(ids),
            idOpt = diagrams.layer.idOpt(id);

        return _.extend(connectWithOpt, idOpt);
      }
    },
        Layer;

    Layer = (function (_d$Diagram3) {
      function Layer() {
        _classCallCheck(this, Layer);

        _get(Object.getPrototypeOf(Layer.prototype), 'constructor', this).apply(this, arguments);
      }

      _inherits(Layer, _d$Diagram3);

      _createClass(Layer, [{
        key: 'create',
        value: function create(conf) {
          var origConf = _.cloneDeep(conf),
              config = helpers.config,
              colors = ['#ECD078', '#D95B43', '#C02942', '#78E4B7', '#53777A', '#00A8C6', '#AEE239', '#FAAE8A'],
              addItemsPropToBottomItems = function addItemsPropToBottomItems(layers) {
            _.each(layers, function (layer) {
              if (layer.hasOwnProperty('items') === false) {
                layer.items = [];
              } else addItemsPropToBottomItems(layer.items);
            });
          },
              calculateTheMostOptimalConnection = function calculateTheMostOptimalConnection(layerA, layerBObj) {
            // There are 12 possible: 4 sides to 3 each
            var getTopSidePos = function getTopSidePos(layer) {
              return {
                x: (layer.x + layer.width / 2) * config.widthSize + config.depthWidthFactor * layer.depth,
                y: layer.y * config.heightSize + config.depthHeightFactor * layer.depth
              };
            },
                getBottomSidePos = function getBottomSidePos(layer) {
              return {
                x: (layer.x + layer.width / 2) * config.widthSize + config.depthWidthFactor * layer.depth,
                y: (layer.y + layer.height) * config.heightSize - config.depthHeightFactor * layer.depth
              };
            },
                getLeftSidePos = function getLeftSidePos(layer) {
              return {
                x: layer.x * config.widthSize + config.depthWidthFactor * layer.depth,
                y: (layer.y + layer.height / 2) * config.heightSize + config.depthHeightFactor * layer.depth
              };
            },
                getRightSidePos = function getRightSidePos(layer) {
              return {
                x: (layer.x + layer.width) * config.widthSize - config.depthWidthFactor * layer.depth,
                y: (layer.y + layer.height / 2) * config.heightSize + config.depthHeightFactor * layer.depth
              };
            },
                getSidesPos = function getSidesPos(layer) {
              return {
                top: getTopSidePos(layer),
                bottom: getBottomSidePos(layer),
                left: getLeftSidePos(layer),
                right: getRightSidePos(layer)
              };
            },
                distance = {
              val: Infinity
            },
                doesNotCrossAnyOfTwoLayers = function doesNotCrossAnyOfTwoLayers(posA, posB, sideA, sideB) {
              if ((sideA === 'bottom' || sideA === 'left' || sideA === 'top') && sideB === 'right') {
                if (posA.x < posB.x) return false;
              } else if ((sideA === 'bottom' || sideA === 'right' || sideA === 'top') && sideB === 'left') {
                if (posA.x > posB.x) return false;
              } else if ((sideA === 'bottom' || sideA === 'right' || sideA === 'left') && sideB === 'top') {
                if (posA.y > posB.y) return false;
              } else if ((sideA === 'left' || sideA === 'right' || sideA === 'top') && sideB === 'bottom') {
                if (posA.y < posB.y) return false;
              }
              return true;
            },
                calcDistanceAndUpdate = function calcDistanceAndUpdate(posA, posB) {
              var e2 = function e2(num) {
                return Math.pow(num, 2);
              },
                  newDistance = Math.sqrt(e2(posA.x - posB.x) + e2(posA.y - posB.y));
              if (newDistance < distance.val) {
                distance.val = newDistance;
                distance.from = posA;
                distance.to = posB;
                return true;
              } else return false;
            },
                eachSide = function eachSide(cb) {
              _.each(['top', 'bottom', 'left', 'right'], function (side) {
                cb(side);
              });
            },
                sameTypeOfSides = function sameTypeOfSides(sideA, sideB) {
              var result = false;
              _.each([[sideA, sideB], [sideB, sideA]], function (sides) {
                if (sides[0] === 'top' && sides[1] === 'bottom') result = true;else if (sides[0] === 'left' && sides[1] === 'right') result = true;
              });
              return result;
            },
                layerB = layerBObj.layer,
                layerAPos = getSidesPos(layerA),
                layerBPos = getSidesPos(layerB),
                changed;

            eachSide(function (sideA) {
              eachSide(function (sideB) {
                if (_.isUndefined(layerB.alreadyConnections)) layerB.alreadyConnections = [];
                if (sideA !== sideB && layerA.alreadyConnections.indexOf(sideA) < 0 && layerB.alreadyConnections.indexOf(sideB) < 0) {
                  if (sameTypeOfSides(sideA, sideB)) {
                    if (doesNotCrossAnyOfTwoLayers(layerAPos[sideA], layerBPos[sideB], sideA, sideB)) {
                      changed = calcDistanceAndUpdate(layerAPos[sideA], layerBPos[sideB]);
                      if (changed === true) {
                        distance.sideA = sideA;
                        distance.sideB = sideB;
                      }
                    }
                  }
                }
              });
            });

            layerA.alreadyConnections.push(distance.sideA);
            layerB.alreadyConnections.push(distance.sideB);
            return distance;
          },
              drawConnection = function drawConnection(connection) {
            var container = connection.layer.container,
                containerData = connection.layer.containerData,
                connectionG,
                connectionId,
                connectionCoords,
                linkLine,
                connectionPath;

            _.each(connection.connectedTo, function (connectedToLayer) {
              connectionCoords = calculateTheMostOptimalConnection(connection.layer, connectedToLayer);

              linkLine = d3.svg.line().x(dTextFn('x')).y(dTextFn('y'));
              connectionId = connection.layer.id + '-' + connectedToLayer.layer.id;
              connectionG = container.append('g').attr('id', connectionId);
              connectionPath = connectionG.append('path').attr('d', linkLine([connectionCoords.from, connectionCoords.to])).style({
                stroke: '#000',
                fill: 'none'
              });

              if (connectedToLayer.type === 'dashed') connectionPath.style('stroke-dasharray', '5, 5');

              connectionG.append('circle').attr({
                cx: connectionCoords.to.x,
                cy: connectionCoords.to.y,
                r: 5,
                fill: colors[connection.layer.depth - 1]
              }).style({
                stroke: '#000'
              });

              containerData.connections = containerData.connections || [];
              containerData.connections.push({
                el: connectionG,
                id: connectionId
              });
            });
          },
              drawConnectionsIfAny = function drawConnectionsIfAny(layers) {
            layers = layers || conf;

            _.chain(layers).filter(function (layer) {
              return layer.hasOwnProperty('connectedTo');
            }).map(function (layer) {
              var layersConnectedTo = [],
                  layerConnectedObj,
                  layerConnectedId,
                  layerConnectedType;
              _.each(layer.connectedTo, function (layerConnected) {
                layerConnectedId = _.isObject(layerConnected) ? layerConnected.id : layerConnected;
                layerConnectedType = _.isObject(layerConnected) && layerConnected.type ? layerConnected.type : 'standard';

                layerConnectedObj = _.where(layers, {
                  id: layerConnectedId
                })[0];

                layersConnectedTo.push({
                  layer: layerConnectedObj,
                  type: layerConnectedType
                });
              });
              return {
                layer: layer,
                connectedTo: layersConnectedTo
              };
            }).each(function (connection) {
              drawConnection(connection);
            }).value();

            _.chain(layers).filter(function (layer) {
              return layer.items.length > 0;
            }).each(function (layer) {
              drawConnectionsIfAny(layer.items);
            }).value();
          },
              updateSvgHeight = function updateSvgHeight() {
            var getBottomPointOfLayer = function getBottomPointOfLayer(layer) {
              return layer.y + layer.height;
            },
                bottomLayer = _.max(conf, getBottomPointOfLayer),
                bottomPoint = getBottomPointOfLayer(bottomLayer),
                bottomPointPxs = bottomPoint * config.heightSize + 20;

            svg.attr('height', bottomPointPxs);
          },
              calcMaxUnityWidth = function calcMaxUnityWidth() {
            var bodyWidth = document.body.getBoundingClientRect().width;

            helpers.maxUnityWidth = Math.floor(bodyWidth / config.widthSize);
          },
              showAllLayerContainerConnections = function showAllLayerContainerConnections(childLayer) {
            if (childLayer.containerData) {
              var connections = childLayer.containerData.connections;
              if (connections) {
                _.each(connections, function (connection) {
                  connection.el.style('opacity', 1);
                });
              }
            }
          },
              hideAllLayerContainerConnectionsExceptOfLayer = function hideAllLayerContainerConnectionsExceptOfLayer(childLayer) {
            if (childLayer.containerData) {
              var connections = childLayer.containerData.connections;
              if (connections) {
                _.each(connections, function (connection) {
                  if (connection.id.indexOf(childLayer.id) === -1) connection.el.style('opacity', 0.2);
                });
              }
            }
          },
              formatLayerTextIfNecessary = function formatLayerTextIfNecessary(text) {
            text = text.replace(/<p>/g, '');
            text = text.replace(/<\/p>/g, '. ');
            text = d.utils.replaceCodeFragmentOfText(text, function () {
              return '<CODE...>';
            });
            return text;
          },
              drawLayersInContainer = function drawLayersInContainer(layers, container, containerData) {
            var widthSize = config.widthSize,
                heightSize = config.heightSize,
                layerG,
                layerNode,
                layerDims,
                layerText,
                setLayerMouseListeners;

            layers = layers || conf;
            container = container || svg;

            _.each(layers, function (layer, layerIndex) {
              setLayerMouseListeners = function (el) {
                el.on('mouseenter', function () {
                  d.tooltip.onMouseEnterListenerFn(currentLayerId, layer.text);
                  hideAllLayerContainerConnectionsExceptOfLayer(layer);
                });
                el.on('mouseleave', function () {
                  d.tooltip.onMouseLeaveListenerFn();
                  showAllLayerContainerConnections(layer);
                });
              };

              var currentLayerId = 'diagrams-layer-g-' + layerGId++,
                  numberG;

              layerG = container.append('g').attr({
                transform: 'translate(' + String(layer.x * widthSize) + ', ' + layer.y * heightSize + ')',
                'class': 'layer-node',
                id: currentLayerId
              });

              layer.layerG = layerG;
              layer.container = container;
              layer.containerData = containerData;

              layerDims = helpers.getFinalLayerDimensions(layer);
              layerNode = layerG.append('g');
              if (layer.conditional === true) {
                layerNode.append('path').attr({
                  d: d.shapes.hexagon({
                    height: layerDims.height,
                    width: layerDims.width,
                    widthPercent: 97 + Math.abs(3 - layer.depth)
                  }),
                  transform: layerDims.transform,
                  fill: layerDims.fill,
                  stroke: '#f00'
                });
              } else {
                layerNode.append('rect').attr({
                  width: layerDims.width,
                  transform: layerDims.transform,
                  height: layerDims.height,
                  fill: layerDims.fill
                }).style({
                  filter: 'url(#diagrams-drop-shadow-layer)'
                });
              }

              layerText = layerNode.append('text').attr({
                transform: layerDims.transform,
                x: layer.depth,
                y: layer.height * heightSize - 3 * layer.depth - 10
              }).text(function () {
                return formatLayerTextIfNecessary(layer.text);
              });

              setLayerMouseListeners(layerText);
              setLayerMouseListeners(layerNode);

              layerText.each(d.svg.textEllipsis(layer.width * widthSize - config.depthWidthFactor * layer.depth * 2));

              layerG.on('click', function () {
                d.tooltip('hide');
                d3.event.stopPropagation();
                d.utils.fillBannerWithText(layer.text);
              });

              if (layerDims.numberTransform) {
                numberG = layerNode.append('g').attr({
                  'class': 'number',
                  transform: layerDims.numberTransform
                });
                numberG.append('circle').attr({
                  r: 10,
                  cx: 4,
                  cy: -4,
                  fill: colors[layer.depth - 1],
                  'stroke-width': 2,
                  stroke: '#000',
                  filert: 'none'
                });
                numberG.append('text').text(layerIndex + 1).attr('fill', '#000');
              }

              if (layer.items.length > 0) {
                drawLayersInContainer(layer.items, layerG, layer);
              }
            });
          },
              svg = d.svg.generateSvg({
            margin: '20px 0 0 20px'
          });

          _.each(colors, function (color, index) {
            d.svg.addVerticalGradientFilter(svg, 'color-' + index, ['#fff', color]);
          });
          svg.attr('class', 'layers-diagram');

          if (_.isArray(conf) === false) conf = [conf];
          d.svg.addFilterColor('layer', svg, 3, 2);
          addItemsPropToBottomItems(conf);
          calcMaxUnityWidth();
          helpers.generateLayersData(conf);
          drawLayersInContainer();
          drawConnectionsIfAny();
          updateSvgHeight();
          helpers.addConvertToBoxButton(origConf);
        }
      }]);

      return Layer;
    })(d.Diagram);

    new Layer({
      name: 'layer',
      helpers: helpers
    });
  })();(function () {})();

  scope.diagrams = diagrams;
})(window);
//# sourceMappingURL=diagrams.js.map
