var layerGId = 0,
  dTextFn = d.utils.textFn,
  helpers = {
    ids: 0,
    Grid: class Grid {
      constructor(fixedWidth) {
        this.position = {
          x: 0,
          y: 0
        };
        this.width = fixedWidth;
        this.cells = [];
      }
      addItemAtNewRow(item) {
        var counter = 0;

        this.position.x = 0;
        while (counter < 1000) {
          this.position.y += 1;
          if (this.itemFitsAtCurrentPos(item)) break;
        }
        this.addItemAtCurrentPos(item);
      }
      addItemAtCurrentPos(item) {
        this.addItemAtPos(item, this.position);
      }
      createRowIfNecessary(posY) {
        if (_.isUndefined(this.cells[posY])) this.cells[posY] = [];
      }
      addItemAtPos(item, pos) {
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
      updatePosition() {
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
      itemFitsAtPos(item, pos) {
        var row;
        for (var i = 0; i < item.height; i++) {
          row = this.cells[i + pos.y];
          if (_.isUndefined(row)) return true;
          for (var j = 0; j < item.width; j++) {
            if (row[j + pos.x] === true) return false;
            if ((j + pos.x + 1) > this.width) return false;
          }
        }
        return true;
      }
      itemFitsAtCurrentPos(item) {
        return this.itemFitsAtPos(item, this.position);
      }
      movePositionToNextRow() {
        this.position.y++;
        this.position.x = 0;
        this.createRowIfNecessary(this.position.y);
      }
      lastRowIsEmpty() {
        var rows = this.cells.length;
        for (var i = 0; i < this.width; i++) {
          if (this.cells[rows - 1][i] === true) return false;
        }
        return true;
      }
      getSize() {
        var rows = this.cells.length;
        return {
          width: this.width,
          height: (this.lastRowIsEmpty()) ? rows - 1 : rows
        };
      }
    },

    config: {
      widthSize: 350,
      heightSize: 60,
      depthWidthFactor: 4,
      depthHeightFactor: 2,
      showNumbersAll: false
    },

    handleConnectedToNextCaseIfNecessary: function(layers, currentIndex) {
      var layer = layers[currentIndex],
        nextLayer = layers[currentIndex + 1],
        connectedTo, newId;

      if (layer.hasOwnProperty('connectedWithNext') === true && nextLayer) {
        if (nextLayer.id) newId = nextLayer.id;
        else {
          newId = 'to-next-' + String(++helpers.ids);
          nextLayer.id = newId;
        }

        if (_.isObject(layer.connectedWithNext) && layer.connectedWithNext.type) {
          connectedTo = {
            id: newId,
            type: layer.connectedWithNext.type
          };
        } else connectedTo = newId;

        if (layer.connectedTo) layer.connectedTo.push(connectedTo);
        else layer.connectedTo = [connectedTo];
      }
    },

    itemsOfLayerShouldBeSorted: function(itemsArray) {
      var ret = true;
      _.each(itemsArray, function(item) {
        if (item.hasOwnProperty('connectedTo')) ret = false;
        if (item.hasOwnProperty('connectToNext')) ret = false;
      });
      return ret;
    },

    calculateLayerWithChildrenDimensions: function(layer) {
      var totalWidth = 0,
        totalHeight = 0,
        maxWidth = 0,
        maxHeight = 0,
        itemsArray = [],
        whileCounter = 0,
        itemsOfLayer, grid, itemsOfLayerIndex, width, gridSize, itemsShouldBeSorted,
        addedItemToGrid = function(index) {
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

      _.each(layer.items, function(item) {
        totalWidth += item.width;
        totalHeight += item.height;
        maxHeight = (item.height > maxHeight) ? item.height : maxHeight;
        maxWidth = (item.width > maxWidth) ? item.width : maxWidth;
        itemsArray.push(item);
      });

      if ((totalWidth / 2) >= maxWidth) {
        if (totalHeight > totalWidth) {
          if (totalHeight / 2 < layer.items.length) width = Math.ceil(totalWidth / 2);
          else width = totalWidth;
        } else width = Math.ceil(totalWidth / 2);
      } else width = maxWidth;

      width = (helpers.maxUnityWidth < width) ? helpers.maxUnityWidth : width;

      grid = new helpers.Grid(width);

      itemsShouldBeSorted = helpers.itemsOfLayerShouldBeSorted(itemsArray);
      if (itemsShouldBeSorted) {
        itemsOfLayer = itemsArray.sort(function(itemA, itemB) {
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
      layer.height = (layer.items.length > 0) ? gridSize.height + 1 : gridSize.height;
    },

    generateLayersData: function(layers, currentDepth) {
      var config = helpers.config,
        maxDepth, itemsDepth;

      currentDepth = currentDepth || 1;
      maxDepth = currentDepth;
      _.each(layers, function(layer, layerIndex) {
        if (layer.showNumbersAll === true) config.showNumbersAll = true;
        layer.depth = currentDepth;
        helpers.handleConnectedToNextCaseIfNecessary(layers, layerIndex);
        if (layer.items.length > 0) {
          itemsDepth = helpers.generateLayersData(layer.items, (currentDepth + 1));
          layer.maxLayerDepthBelow = itemsDepth - currentDepth;
          helpers.calculateLayerWithChildrenDimensions(layer);
          maxDepth = (maxDepth < itemsDepth) ? itemsDepth : maxDepth;
        } else {
          layer.maxLayerDepthBelow = 0;
          layer.width = 1;
          layer.height = 1;
          maxDepth = (maxDepth < itemsDepth) ? itemsDepth : maxDepth;
        }
        layer.alreadyConnections = [];
      });

      return maxDepth;
    },

    getFinalLayerDimensions: function(layer) {
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
      if (config.showNumbersAll === true || (layer.containerData && layer.containerData.showNumbers === true)) {
        dimensions.numberTransform = 'translate(' + String(width - 15 + config.depthWidthFactor * layer.depth) + ',' + String(config.depthHeightFactor * layer.depth + height + 0) + ')';
      }

      return dimensions;
    },

    addConvertToBoxButton: function(origConf) {
      var body = d3.select('body');

      body.insert('div', 'svg').append('input').attr({
        type: 'button',
        'class': 'conversion-button',
        value: 'Convert to box diagram',
        onclick: 'diagrams.layer.convertToBoxWrapper()'
      });

      // Refactor this
      diagrams.layer.convertToBoxWrapper = function() {
        helpers.convertToBox(origConf);
      };
    },

    convertToBox: function(origConf) {
      var convertDataToBox = function(items) {
          var texts;
          _.each(items, function(item, index) {
            texts = item.text.split(': ');
            item.text = texts[0];
            if (texts.length > 1) item.description = texts[1];

            if (item.items && item.items.length > 0) {
              item.type = 'container';
              convertDataToBox(item.items);
            } else {
              if (_.isString(item.description) === false) items[index] = item.text;
              else {
                item.type = 'definition';
                item.items = [];
              }
            }
          });
        },
        createBox = function() {
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

    newLayer: function(text, opts, items) {
      var layer = {
        text: text
      };

      if (_.isArray(opts)) items = opts;
      else {
        if (_.isString(opts)) opts = helpers.extendOpts(opts);
        if (_.isObject(opts)) layer = _.extend(layer, opts);
      }

      if (items) layer.items = items;
      if (_.isUndefined(layer.id)) layer.id = 'layer-' + (++helpers.ids) + '-auto'; // Have to limit the id by the two sides to enable .indexOf to work

      return layer;
    },

    newLayerConnectedToNext: function() {
      var args = arguments.length;

      if (args === 1) return helpers.newLayer(arguments[0], 'cn');
      else if (args === 2) {
        if (typeof(arguments[1]) === 'object') return helpers.newLayer(arguments[0], 'cn', arguments[1]);
        else if (typeof(arguments[1] === 'string')) return helpers.newLayer(arguments[0], arguments[1] + ' cn');
      } else if (args === 3) return helpers.newLayer(arguments[0], arguments[1] + ' cn', arguments[2]);
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

    idOpt: function(id) {
      return {
        id: 'layer-' + id + '-custom'
      };
    },

    extendOpts: function() {
      var result = {};

      _.each(arguments, function(arg) {
        if (typeof(arg) === 'string') {
          _.each(arg.split(' '), function(opt) {
            if (opt.substr(0, 3) === 'id-') result = _.extend(result, helpers.idOpt(opt.substr(3, opt.length)));
            else if (opt.substr(0, 3) === 'ct-') helpers.connectWithOpt(Number(opt.substr(3, opt.length)), result);
            else if (opt.substr(0, 4) === 'ctd-') helpers.connectWithOpt(Number(opt.substr(4, opt.length)), result, 'dashed');
            else result = _.extend(result, helpers.staticOptsLetters[opt]);
          });
        } else if (_.isObject(arg)) {
          result = _.extend(result, arg);
        }
      });

      return result;
    },

    connectWithOpt: function(ids, result, type) {
      var objs = [];
      if (_.isNumber(ids)) ids = [ids];
      type = type || 'standard';

      _.each(ids, function(id) {
        objs.push({
          id: 'layer-' + id + '-custom',
          type: type
        });
      });

      if (_.isUndefined(result.connectedTo) === true) result.connectedTo = objs;
      else result.connectedTo = result.connectedTo.concat(objs);
    },

    connectWithOptAndIdOpt: function(ids, id) {
      var connectWithOpt = diagrams.layer.connectWithOpt(ids),
        idOpt = diagrams.layer.idOpt(id);

      return _.extend(connectWithOpt, idOpt);
    }
  },
  Layer;

_.each([
  'newLayer',
  'newLayerConnectedToNext'
], function(helpersMethod) {
  helpers[helpersMethod + 'WithCode'] = function(codeLanguage) {
    var codeFn = diagrams.utils.codeBlockOfLanguageFn(codeLanguage);
    return function() {
      var args = arguments;
      args[0] = codeFn(args[0]);
      return helpers[helpersMethod].apply(this, args);
    };
  };

  helpers[helpersMethod + 'WithParagraphAndCode'] = function(codeLanguage) {
    var codeFn = diagrams.utils.codeBlockOfLanguageFn(codeLanguage);
    return function() {
      var args = [].splice.call(arguments, 0),
        paragraphText = args[0],
        code = args[1],
        text = d.utils.wrapInParagraph(paragraphText) + codeFn(code);

      args = args.splice(2);
      args.unshift(text);
      return helpers[helpersMethod].apply(this, args);
    };
  };
});

Layer = class Layer extends d.Diagram {
  create(conf) {
    var diagram = this,
      origConf = _.cloneDeep(conf),
      config = helpers.config,
      colors = ['#ECD078', '#D95B43', '#C02942', '#78E4B7', '#53777A', '#00A8C6', '#AEE239', '#FAAE8A'],
      addItemsPropToBottomItems = function(layers) {
        _.each(layers, function(layer) {
          if (layer.hasOwnProperty('items') === false) {
            layer.items = [];
          } else addItemsPropToBottomItems(layer.items);
        });
      },
      calculateTheMostOptimalConnection = function(layerA, layerBObj) {
        // There are 12 possible: 4 sides to 3 each
        var getTopSidePos = function(layer) {
            return {
              x: (layer.x + layer.width / 2) * config.widthSize + config.depthWidthFactor * layer.depth,
              y: layer.y * config.heightSize + config.depthHeightFactor * layer.depth
            };
          },
          getBottomSidePos = function(layer) {
            return {
              x: (layer.x + layer.width / 2) * config.widthSize + config.depthWidthFactor * layer.depth,
              y: (layer.y + layer.height) * config.heightSize - config.depthHeightFactor * layer.depth
            };
          },
          getLeftSidePos = function(layer) {
            return {
              x: layer.x * config.widthSize + config.depthWidthFactor * layer.depth,
              y: (layer.y + layer.height / 2) * config.heightSize + config.depthHeightFactor * layer.depth
            };
          },
          getRightSidePos = function(layer) {
            return {
              x: (layer.x + layer.width) * config.widthSize - config.depthWidthFactor * layer.depth,
              y: (layer.y + layer.height / 2) * config.heightSize + config.depthHeightFactor * layer.depth
            };
          },
          getSidesPos = function(layer) {
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
          doesNotCrossAnyOfTwoLayers = function(posA, posB, sideA, sideB) {
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
          calcDistanceAndUpdate = function(posA, posB) {
            var e2 = function(num) {
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
          eachSide = function(cb) {
            _.each(['top', 'bottom', 'left', 'right'], function(side) {
              cb(side);
            });
          },
          sameTypeOfSides = function(sideA, sideB) {
            var result = false;
            _.each([
              [sideA, sideB],
              [sideB, sideA]
            ], function(sides) {
              if (sides[0] === 'top' && sides[1] === 'bottom') result = true;
              else if (sides[0] === 'left' && sides[1] === 'right') result = true;
            });
            return result;
          },
          loopSidesToGetConnection = function(sameTypeOfSidesCondition) {
            eachSide(function(sideA) {
              eachSide(function(sideB) {
                if (_.isUndefined(layerB.alreadyConnections)) layerB.alreadyConnections = [];
                if (sideA !== sideB && layerA.alreadyConnections.indexOf(sideA) < 0 && layerB.alreadyConnections.indexOf(sideB) < 0) {
                  if ((sameTypeOfSidesCondition === false && sameTypeOfSides(sideA, sideB) === false) || sameTypeOfSides(sideA, sideB)) {
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
          },
          layerB = layerBObj.layer,
          layerAPos = getSidesPos(layerA),
          layerBPos = getSidesPos(layerB),
          changed;


        loopSidesToGetConnection(true);
        if (changed !== true) loopSidesToGetConnection(false);

        layerA.alreadyConnections.push(distance.sideA);
        layerB.alreadyConnections.push(distance.sideB);
        return distance;

      },
      drawConnection = function(connection) {
        var container = connection.layer.container,
          containerData = connection.layer.containerData,
          connectionG, connectionId, connectionCoords, linkLine, connectionPath;

        _.each(connection.connectedTo, function(connectedToLayer) {
          connectionCoords = calculateTheMostOptimalConnection(connection.layer, connectedToLayer);

          linkLine = d3.svg.line().x(dTextFn('x')).y(dTextFn('y'));
          connectionId = connection.layer.id + '-' + connectedToLayer.layer.id;
          connectionG = container.append('g').attr('id', connectionId);
          if (connectionCoords.from && connectionCoords.to) {
            connectionPath = connectionG.append('path')
              .attr('d', linkLine([connectionCoords.from, connectionCoords.to])).style({
                stroke: '#000',
                fill: 'none'
              });

            if (connectedToLayer.type === 'dashed') connectionPath.style('stroke-dasharray', '5, 5');

            connectionG.append("circle").attr({
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
          }
        });
      },
      drawConnectionsIfAny = function(layers) {
        layers = layers || conf;

        _.chain(layers).filter(function(layer) {
          return layer.hasOwnProperty('connectedTo');
        }).map(function(layer) {
          var layersConnectedTo = [],
            layerConnectedObj, layerConnectedId, layerConnectedType;
          _.each(layer.connectedTo, function(layerConnected) {
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
        }).each(function(connection) {
          drawConnection(connection);
        }).value();

        _.chain(layers).filter(function(layer) {
          return layer.items.length > 0;
        }).each(function(layer) {
          drawConnectionsIfAny(layer.items);
        }).value();
      },
      updateSvgHeight = function() {
        var getBottomPointOfLayer = function(layer) {
            return layer.y + layer.height;
          },
          bottomLayer = _.max(conf, getBottomPointOfLayer),
          bottomPoint = getBottomPointOfLayer(bottomLayer),
          bottomPointPxs = bottomPoint * config.heightSize + 20;

        svg.attr('height', bottomPointPxs);
      },
      calcMaxUnityWidth = function() {
        var bodyWidth = document.body.getBoundingClientRect().width;

        helpers.maxUnityWidth = Math.floor(bodyWidth / config.widthSize);
      },
      showAllLayerContainerConnections = function(childLayer) {
        if (childLayer.containerData) {
          var connections = childLayer.containerData.connections;
          if (connections) {
            _.each(connections, function(connection) {
              connection.el.style('opacity', 1);
            });
          }
        }
      },
      hideAllLayerContainerConnectionsExceptOfLayer = function(childLayer) {
        if (childLayer.containerData) {
          var connections = childLayer.containerData.connections;
          if (connections) {
            _.each(connections, function(connection) {
              if (connection.id.indexOf(childLayer.id) === -1) connection.el.style('opacity', 0.2);
            });
          }
        }
      },
      formatLayerTextIfNecessary = function(text) {
        text = text.replace(/<p>/g, '');
        text = text.replace(/<\/p>/g, '. ');
        text = d.utils.replaceCodeFragmentOfText(text, function(matchStr, language, codeBlock) {
          if (matchStr === text && /\n/.test(matchStr) === false) return codeBlock;
          else return '<CODE...>';
        });
        return text;
      },
      drawLayersInContainer = function(layers, container, containerData) {
        var widthSize = config.widthSize,
          heightSize = config.heightSize,
          layerG, layerNode, layerDims, layerText;

        layers = layers || conf;
        container = container || svg;

        _.each(layers, function(layer, layerIndex) {


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
          }).text(function() {
            return d.utils.formatShortDescription(layer.text);
          });


          layer.fullText = layer.text;
          // Missing to add show all layers connections and hide
          diagram.addMouseListenersToEl(layerNode, layer);

          layerText.each(d.svg.textEllipsis(layer.width * widthSize - config.depthWidthFactor * layer.depth * 2));

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
            numberG.append('text').text(layerIndex + 1)
              .attr('fill', '#000');
          }

          if (layer.items.length > 0) {
            drawLayersInContainer(layer.items, layerG, layer);
          }
        });
      },
      svg = d.svg.generateSvg({
        margin: '20px 0 0 20px'
      });

    diagram.markRelatedFn = function(item) {
      item.data.origFill = item.data.origFill || item.el.select('rect').style('fill');
      item.el.select('rect').style({
        'fill': '#FFF'
      });
    };
    diagram.unmarkAllItems = function() {
      var recursiveFn = function(items) {
        _.each(items, function(item) {
          item.layerG.style({
            'stroke-width': '1px'
          });
          if (item.origFill) {
            item.layerG.select('rect').style('fill', item.origFill);
          }
          if (item.items) recursiveFn(item.items);
        });
      };
      recursiveFn(conf);
    };

    _.each(colors, function(color, index) {
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
    diagram.generateRelationships(conf);
  }

  generateRelationships(layers, containerLayer) {
    var diagram = this;
    _.each(layers, function(layer) {
      diagram.generateEmptyRelationships(layer);
      diagram.addSelfRelationship(layer, layer.layerG, layer);
      if (containerLayer) {
        diagram.addDependantRelationship(containerLayer, layer.layerG, layer);
        diagram.addDependencyRelationship(layer, containerLayer.layerG, containerLayer);
      }
      if (layer.items && layer.items.length > 0) diagram.generateRelationships(layer.items, layer);
    });
  }
};

new Layer({
  name: 'layer',
  helpers: helpers
});
