var helpers = {
    generateDefinitionWithSharedGet: function() {
      var text = arguments[0],
        sharedKey, preffix;

      preffix = (arguments.length > 1) ? arguments[1] : '';
      sharedKey = preffix + text.split('(')[0];

      return Box.generateDefinition(text, d.shared.get(sharedKey));
    },

    addButtons: function(creationId) {
      var div = d.Diagram.addDivBeforeSvg();

      div.appendButtonToDiv('diagrams-box-collapse-all-button', 'Collapse all', 'diagrams.box.collapseAll(' + creationId + ')');
      div.appendButtonToDiv('diagrams-box-expand-all-button', 'Expand all', 'diagrams.box.expandAll(' + creationId + ')');
    },

    expandOrCollapseAll: function(creationId, collapseOrExpand) {
      var recursiveFn = function(items) {
        _.each(items, function(item) {
          if (item.hasOwnProperty('collapsed')) helpers[collapseOrExpand + 'Item'](item);
          if (item.items) recursiveFn(item.items);
          if (item.collapsedItems) recursiveFn(item.collapsedItems);
        });
      };

      var conf = d.Diagram.getDataWithCreationId(creationId)[1];
      recursiveFn(conf.body);
      helpers.addBodyItemsAndUpdateHeights();
    },

    collapseAll: function(creationId) {
      helpers.expandOrCollapseAll(creationId, 'collapse');
    },

    expandAll: function(creationId) {
      helpers.expandOrCollapseAll(creationId, 'expand');
    },

    convertToGraph: function(origConf) {
      console.log("origConf", origConf);
    },

    convertToLayer: function(origConf) {
      var convertDataToLayers = function(items) {
          _.each(items, function(item, index) {
            if (_.isString(item)) {
              item = items[index] = {
                text: item
              };
            }
            if (item.description) item.text += ': ' + item.description;
            if (item.items) convertDataToLayers(item.items);
            else item.items = [];
          });
        },
        createLayers = function() {
          var svg = d3.select('svg');

          d3.selectAll('input.diagrams-diagram-button').remove();

          svg.remove();
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

    collapseItem: function(item) {
      if (item.items.length > 0) {
        item.collapsedItems = item.items;
        item.collapsed = true;
        item.items = [];
      }
    },

    expandItem: function(item) {
      if (item.collapsedItems) {
        item.items = item.collapsedItems;
        delete item.collapsedItems;
        item.collapsed = false;
      }
    },

    generateItem: function(text, description, options, items) {
      var defaultOptions = {
        isLink: false
      };
      options = options || {};
      return {
        text: text,
        description: description || null,
        options: _.defaults(options, defaultOptions),
        items: items || []
      };
    },

    generateContainer: function(text, description, items) {
      if (_.isArray(description)) {
        items = description;
        description = null;
      }

      return helpers.generateItem(text, description, null, items);
    },

    generateLink: function(text, url) {
      return helpers.generateItem(text, url, {
        isLink: true
      });
    },

    generateDefinition: function(text, description) {
      return helpers.generateItem(text, description);
    },

    dataFromSpecificToGeneral: function(conf) {
      var maxId = -1,
        finalItems = [],
        connections = [],
        recursiveFn = function(items, parentCreatedItem) {
          _.each(items, function(item) {
            var createdItem = {
              name: item.text,
              description: item.description,
              graphsData: {
                box: {
                  options: item.options
                }
              },
              id: ++maxId
            };
            finalItems.push(createdItem);
            if (parentCreatedItem) {
              connections.push({
                from: createdItem.id,
                to: parentCreatedItem.id
              });
            } else {
              connections.push({
                from: createdItem.id,
                to: 0
              });
            }
            if (item.items && item.items.length > 0) recursiveFn(item.items, createdItem);
          });
        };
      finalItems.push({
        name: conf.name,
        id: ++maxId
      });
      recursiveFn(conf.body);

      return {
        items: finalItems,
        connections: connections
      };
    },
    dataFromGeneralToSpecific: function(generalData) {
      var finalData = d.utils.dataFromGeneralToSpecificForATreeStructureType(generalData);

      finalData.name = finalData.text;
      finalData.body = finalData.items;

      delete finalData.items;
      delete finalData.text;

      return finalData;
    }
  },
  textGId = 0,
  Box;

Box = class Box extends d.Diagram {
  create(creationId, conf, opts) {
    var diagram = this,
      svg = d.svg.generateSvg(),
      width = svg.attr('width') - 40,
      nameHeight = 50,
      boxG = svg.append('g').attr({
        transform: 'translate(20, 20)',
        'class': 'box-diagram'
      }),
      nameG = boxG.append('g'),
      rowHeight = 30,
      depthWidth = 35,
      urlParams = d.utils.getUrlParams(),
      collapseIfNecessary = function(el, item) {
        if (item.items.length > 0 || item.collapsedItems) {
          var textEl = el.select('text'),
            yDim = textEl.attr('y'),
            xDim = textEl.attr('x'),
            triggerEl = el.append('g').attr({
              'class': 'collapsible-trigger'
            }),
            collapseListener = function() {
              helpers.collapseItem(item);
              helpers.addBodyItemsAndUpdateHeights();
            },
            expandListener = function() {
              helpers.expandItem(item);
              helpers.addBodyItemsAndUpdateHeights();
            },
            triggerTextEl = triggerEl.append('text').attr({
              y: Number(yDim) + 5,
              x: Number(xDim) - 20
            }),
            setCollapseTextAndListener = function() {
              triggerTextEl.text('-').attr('class', 'minus');
              triggerEl.on('click', collapseListener);
            },
            setExpandTextAndListener = function() {
              triggerTextEl.text('+').attr({
                'class': 'plus',
                y: yDim
              });
              triggerEl.on('click', expandListener);
            };

          if (_.isUndefined(item.collapsed)) {
            item.collapsed = false;
            setCollapseTextAndListener();
          } else {
            if (item.collapsed === true) setExpandTextAndListener();
            else if (item.collapsed === false) setCollapseTextAndListener();
          }
        }
      },
      addBodyItems = function(items, container, depth) {
        var newContainer, textG, textWidth, descriptionWidth, containerText;

        items = items || conf.body;
        container = container || bodyG;
        depth = depth || 1;

        if (items === conf.body) bodyPosition = 1;

        _.each(items, function(item, itemIndex) {
          var currentTextGId;

          currentTextGId = 'diagrams-box-text-' + textGId++;
          if (_.isString(item)) {
            item = helpers.generateItem(item);
            items[itemIndex] = item;
          }
          item.items = item.items || [];
          if (item.items.length > 0) {
            newContainer = container.append('g');
            containerText = d.utils.formatShortDescription(item.text);
            if (item.items && item.items.length > 0) containerText += ':';
            if (item.description) {
              item.fullText = d.utils.generateATextDescriptionStr(containerText, item.description);
              containerText += ' (...)';
            } else item.fullText = item.text;

            textG = newContainer.append('text').text(containerText).attr({
              x: depthWidth * depth,
              y: rowHeight * ++bodyPosition,
              id: currentTextGId
            });
            // item.items = _.sortBy(item.items, 'text');
            addBodyItems(item.items, newContainer, depth + 1);
          } else {
            if (item.options && item.options.isLink === true) {
              newContainer = container.append('svg:a').attr("xlink:href", item.description)
              textG = newContainer.append('text').text(d.utils.formatShortDescription(item.text)).attr({
                id: currentTextGId,
                x: depthWidth * depth,
                y: rowHeight * ++bodyPosition,
                fill: '#3962B8'
              });

              item.fullText = item.text + ' (' + item.description + ')';
            } else {
              newContainer = container.append('g').attr({
                id: currentTextGId
              });
              textG = newContainer.append('text').text(d.utils.formatShortDescription(item.text)).attr({
                x: depthWidth * depth,
                y: rowHeight * ++bodyPosition
              }).style({
                'font-weight': 'bold'
              });
              if (item.description) {
                textWidth = textG[0][0].getBoundingClientRect().width;
                descriptionWidth = svg[0][0].getBoundingClientRect().width - textWidth - depthWidth * depth - 30;

                newContainer.append('text').text('- ' + d.utils.formatShortDescription(item.description)).attr({
                  x: depthWidth * depth + textWidth + 5,
                  y: rowHeight * bodyPosition - 1
                }).each(d.svg.textEllipsis(descriptionWidth));
              }

              item.fullText = d.utils.generateATextDescriptionStr(item.text, item.description);
            }
          }
          collapseIfNecessary(newContainer, item);
          item.textG = newContainer;

          diagram.addMouseListenersToEl(textG, item);
        });
      },
      scrollToTarget = function(target) {
        var targetFound = null,
          recursiveFindTarget = function(items) {
            _.each(items, function(item) {
              if (_.isNull(targetFound)) {
                if (_.isString(item.text) && item.text.indexOf(target) > -1) targetFound = item;
                else if (item.items) recursiveFindTarget(item.items);
              }
            });
          },
          currentScroll, scrollElTop;

        recursiveFindTarget(conf.body);
        if (targetFound) {
          currentScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
          scrollElTop = targetFound.textG[0][0].getBoundingClientRect().top;
          _.defer(function() {
            window.scrollTo(0, scrollElTop + currentScroll);
          });
        }
        console.log("targetFound", targetFound);
      },
      bodyG, bodyPosition, bodyRect;

    opts = opts || {};

    helpers.addBodyItemsAndUpdateHeights = _.bind(function() {
      var diagram = this,
        currentScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
      svg.attr('height', 10);
      if (bodyG) bodyG.remove();
      bodyG = boxG.append('g').attr({
        transform: 'translate(0, ' + nameHeight + ')'
      });
      bodyRect = bodyG.append('rect').attr({
        width: width,
        stroke: '#000',
        fill: '#fff'
      }).style({
        filter: 'url(#diagrams-drop-shadow-box)'
      });
      addBodyItems();
      diagram.setRelationships(conf.body);
      d.svg.updateHeigthOfElWithOtherEl(svg, boxG, 50);
      d.svg.updateHeigthOfElWithOtherEl(bodyRect, boxG, 25 - nameHeight);

      window.scrollTo(0, currentScroll);
      diagram.emit('items-rendered');
    }, this);

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

    d3.select(document.body).style('opacity', 0);
    helpers.addBodyItemsAndUpdateHeights();
    if (opts.allCollapsed === true) helpers.collapseAll(creationId);
    helpers.addButtons(creationId);
    d3.select(document.body).style('opacity', 1);

    if (urlParams.target) scrollToTarget(urlParams.target);
  }

  setRelationships(items, container) {
    var diagram = this;
    _.each(items, function(item) {
      diagram.generateEmptyRelationships(item);
      if (container) {
        diagram.addDependantRelationship(container, item.textG, item);
        diagram.addDependencyRelationship(item, container.textG, container);
      }
      if (item.items && item.items.length > 0) diagram.setRelationships(item.items, item);
    });
  }
};

new Box({
  name: 'box',
  helpers: helpers
});
