import d from 'diagrams';

export default () => {
  const helpers = {
    addButtons(creationId) {
      const div = d.Diagram.addDivBeforeSvg();

      div.appendButtonToDiv('diagrams-box-collapse-all-button', 'Collapse all',
        `diagrams.box.collapseAll(${creationId})`);
      div.appendButtonToDiv('diagrams-box-expand-all-button', 'Expand all',
        `diagrams.box.expandAll(${creationId})`);
    },

    collapseAll(creationId) {
      helpers.expandOrCollapseAll(creationId, 'collapse');
    },

    collapseItem(item) {
      if (item.items.length > 0) {
        item.collapsedItems = item.items;
        item.collapsed = true;
        item.items = [];
      }
    },

    convertToGraph(origConf) {
      console.log("origConf", origConf);
    },

    convertToLayer(origConf) {
      const convertDataToLayers = (items) => {
        _.each(items, (item, index) => {
          if (_.isString(item)) {
            item = items[index] = {
              text: item,
            };
          }

          if (item.description) item.text += `: ${item.description}`;

          if (item.items) convertDataToLayers(item.items);
          else item.items = [];
        });
      };
      const createLayers = () => {
        const svg = d3.select('svg');

        d3.selectAll('input.diagrams-diagram-button').remove();

        svg.remove();
        d.layer(layersData);
      };
      const layersData = [];

      layersData.push({
        items: origConf.body,
        text: origConf.name,
      });
      convertDataToLayers(layersData[0].items);
      createLayers();
    },

    dataFromGeneralToSpecific(generalData) {
      const finalData = d.utils.dataFromGeneralToSpecificForATreeStructureType(generalData);

      finalData.name = finalData.text;
      finalData.body = finalData.items;

      delete finalData.items;
      delete finalData.text;

      return finalData;
    },

    dataFromSpecificToGeneral(conf) {
      let maxId = -1;
      const finalItems = [];
      const connections = [];
      const recursiveFn = (items, parentCreatedItem) => {
        _.each(items, (item) => {
          const createdItem = {
            description: item.description,
            graphsData: {
              box: {
                options: item.options,
              },
            },
            id: ++maxId,
            name: item.text,
          };

          finalItems.push(createdItem);

          if (parentCreatedItem) {
            connections.push({
              from: createdItem.id,
              to: parentCreatedItem.id,
            });
          } else {
            connections.push({
              from: createdItem.id,
              to: 0,
            });
          }

          if (item.items && item.items.length > 0) recursiveFn(item.items, createdItem);
        });
      };

      finalItems.push({
        id: ++maxId,
        name: conf.name,
      });
      recursiveFn(conf.body);

      return {
        connections,
        items: finalItems,
      };
    },

    expandAll(creationId) {
      helpers.expandOrCollapseAll(creationId, 'expand');
    },

    expandItem(item) {
      if (item.collapsedItems) {
        item.items = item.collapsedItems;
        delete item.collapsedItems;
        item.collapsed = false;
      }
    },

    expandOrCollapseAll(creationId, collapseOrExpand) {
      helpers.traverseBodyDataAndRefresh(creationId, {
        withCollapsedItems: true,
      }, (item) => {
        if (item.hasOwnProperty('collapsed')) {
          helpers[`${collapseOrExpand}Item`](item);
        }
      });
    },

    filterByString: _.debounce((opts, creationId) => {
      const getHiddenValueSetter = (value) => {
        return (item) => {
          item.hidden = value;
        };
      };
      const setHiddenToFalse = getHiddenValueSetter(false);

      helpers.traverseBodyDataAndRefresh(creationId, null, (item, parents) => {
        const anyParentIsShowed = _.any(parents, parent => parent.hidden !== true);

        if (opts.showChildren === false || anyParentIsShowed === false) {
          if (new RegExp(opts.str, 'i').test(item.text) === false) getHiddenValueSetter(true)(item);
          else {
            _.each(parents, setHiddenToFalse);
            setHiddenToFalse(item);
          }
        } else setHiddenToFalse(item);
      });
    }, 500),

    generateContainer(...args) {
      const text = args[0];
      let description = args[1];
      let items = args[2];
      let options  = args[3] || null;

      if (_.isArray(description)) {
        options = items;
        items = description;
        description = null;
      }

      return helpers.generateItem({ description, items, options, text });
    },

    generateDefinition(text, description) {
      return helpers.generateItem({ description, text });
    },

    generateDefinitionWithSharedGet(...args) {
      const text = args[0];
      let sharedKey, preffix;

      preffix = (arguments.length > 1) ? args[1] : '';
      sharedKey = preffix + text.split('(')[0];

      return Box.generateDefinition(text, d.shared.get(sharedKey));
    },

    generateItem({ description, items, options, text }) {
      const defaultOptions = {
        isLink: false,
        notCompleted: false,
      };

      options = options || {};
      options = helpers.parseItemGenerationOptions(options);

      return {
        description: description || null,
        items: items || [],
        options: _.defaults(options, defaultOptions),
        text,
      };
    },

    generateLink(text, url) {
      return helpers.generateItem({ description: url, items: null, options: {
        isLink: true,
      }, text });
    },

    parseItemGenerationOptions(options) {
      let parsedOptions;

      if (_.isString(options)) {
        options = options.split(' ');
        parsedOptions = {};
        _.each(options, (optionsKey) => {
          const newKey = optionsKey
            .replace(/-([a-z])/g, g => g[1].toUpperCase()); // option-one -> optionOne

          parsedOptions[newKey] = true;
        });
      } else parsedOptions = options;

      return parsedOptions;
    },

    traverseBodyDataAndRefresh(creationId, opts, cb) {
      const conf = d.Diagram.getDataWithCreationId(creationId)[1];
      const bodyData = conf.body;
      const recursiveFn = (items, parents) => {
        _.each(items, (item) => {
          if (cb) cb(item, parents);

          if (item.items) recursiveFn(item.items, parents.concat(item));

          if (opts.withCollapsedItems && item.collapsedItems)
            recursiveFn(item.collapsedItems, parents.concat(item));
        });
      };

      opts = opts || {};
      opts.withCollapsedItems = opts.withCollapsedItems || false;
      recursiveFn(bodyData, []);
      helpers.addBodyItemsAndUpdateHeights();
    },
  };

  let textGId = 0;
  const Box = class Box extends d.Diagram {
    create(creationId, conf, opts) {
      const diagram = this;
      const svg = d.svg.generateSvg();
      const width = svg.attr('width') - 40;
      const nameHeight = 50;
      const boxG = svg.append('g').attr({
        class: 'box-diagram',
        transform: 'translate(20, 20)',
      });
      const nameG = boxG.append('g');
      const rowHeight = 30;
      const depthWidth = 35;
      const urlParams = d.utils.getUrlParams();
      const collapseIfNecessary = (el, item) => {
        if (item.items.length > 0 || item.collapsedItems) {
          const textEl = el.select('text');
          const yDim = textEl.attr('y');
          const xDim = textEl.attr('x');
          const triggerEl = el.append('g').attr({
            class: 'collapsible-trigger',
          });
          const collapseListener = () => {
            helpers.collapseItem(item);
            helpers.addBodyItemsAndUpdateHeights();
          };
          const expandListener = () => {
            helpers.expandItem(item);
            helpers.addBodyItemsAndUpdateHeights();
          };
          const triggerTextEl = triggerEl.append('text').attr({
            x: Number(xDim) - 20,
            y: Number(yDim) + 5,
          });
          const setCollapseTextAndListener = () => {
            triggerTextEl.text('-').attr('class', 'minus');
            triggerEl.on('click', collapseListener);
          };
          const setExpandTextAndListener = () => {
            triggerTextEl.text('+').attr({
              class: 'plus',
              y: yDim,
            });
            triggerEl.on('click', expandListener);
          };
          let clipPathId;

          triggerElId += 1;
          clipPathId = `clippath-${triggerElId}`;
          triggerEl.append('clipPath').attr('id', clipPathId).append('rect').attr({
            height: 15,
            width: 20,
            x: xDim - 20,
            y: yDim - 17,
          });
          triggerTextEl.attr('clip-path', `url(#${clipPathId})`);

          if (_.isUndefined(item.collapsed)) {
            item.collapsed = false;
            setCollapseTextAndListener();
          } else {
            if (item.collapsed === true) setExpandTextAndListener();
            else if (item.collapsed === false) setCollapseTextAndListener();
          }
        }
      };
      const addBodyItems = (items, container, depth) => {
        let newContainer, textEl, textWidth, descriptionWidth, containerText, textElValue;

        items = items || conf.body;
        container = container || bodyG;
        depth = depth || 1;

        if (items === conf.body) bodyPosition = 1;

        _.each(items, (item, itemIndex) => {
          if (item.hidden !== true) {
            const currentTextGId = `diagrams-box-text-${textGId++}`;

            if (_.isString(item)) {
              item = helpers.generateItem({ text: item });
              items[itemIndex] = item;
            }
            item.items = item.items || [];

            if (item.items.length > 0) {
              newContainer = container.append('g');
              containerText = d.utils.formatShortDescription(item.text);

              if (item.items && item.items.length > 0) containerText += ':';

              if (item.description) {
                item.fullText = d.utils
                  .generateATextDescriptionStr(containerText, item.description);
                containerText += ' (...)';
              } else item.fullText = item.text;

              textEl = newContainer.append('text').text(containerText).attr({
                id: currentTextGId,
                x: depthWidth * depth,
                y: rowHeight * ++bodyPosition,
              });

              addBodyItems(item.items, newContainer, depth + 1);
            } else {
              if (item.options && item.options.isLink === true) {
                newContainer = container.append('svg:a').attr("xlink:href", item.description);
                textEl = newContainer.append('text')
                  .text(d.utils.formatShortDescription(item.text)).attr({
                    fill: '#3962B8',
                    id: currentTextGId,
                    x: depthWidth * depth,
                    y: rowHeight * ++bodyPosition,
                  });

                item.fullText = `${item.text} (${item.description})`;
              } else {
                newContainer = container.append('g').attr({
                  id: currentTextGId,
                });
                textEl = newContainer.append('text')
                  .text(d.utils.formatShortDescription(item.text)).attr({
                    class: 'diagrams-box-definition-text',
                    x: depthWidth * depth,
                    y: rowHeight * ++bodyPosition,
                  });

                if (item.description) {
                  textWidth = textEl[0][0].getBoundingClientRect().width;
                  descriptionWidth = svg[0][0].getBoundingClientRect().width
                    - textWidth - depthWidth * depth - 30;

                  newContainer.append('text')
                    .text(`- ${d.utils.formatShortDescription(item.description)}`).attr({
                      x: depthWidth * depth + textWidth + 5,
                      y: rowHeight * bodyPosition - 1,
                    }).each(d.svg.textEllipsis(descriptionWidth));
                }

                item.fullText = d.utils.generateATextDescriptionStr(item.text, item.description);
              }
            }

            collapseIfNecessary(newContainer, item);
            item.textG = newContainer;
            item.textEl = textEl;

            if (item.options.notCompleted === true) {
              item.textG.attr('class', `${(item.textG.attr('class') || '')}`
                + ` diagrams-box-not-completed-block`);
              textElValue = item.textEl.text();
              item.textEl.text('');
              item.textEl.append('tspan').text(`${textElValue} `);
              item.textEl.append('tspan').text('[NOT COMPLETED]')
                .attr('class', 'diagrams-box-not-completed-tag');
            }

            diagram.addMouseListenersToEl(textEl, item);
          }
        });
      };
      const scrollToTarget = (target) => {
        let targetFound = null;
        const recursiveFindTarget = (items) => {
          _.each(items, (item) => {
            if (_.isNull(targetFound)) {
              if (_.isString(item.text) && item.text.indexOf(target) > -1) targetFound = item;
              else if (item.items) recursiveFindTarget(item.items);
            }
          });
        };
        let currentScroll, scrollElTop;

        recursiveFindTarget(conf.body);

        if (targetFound) {
          currentScroll = (window.pageYOffset || document.documentElement.scrollTop)
            - (document.documentElement.clientTop || 0);
          scrollElTop = targetFound.textG[0][0].getBoundingClientRect().top;
          _.defer(() => {
            window.scrollTo(0, scrollElTop + currentScroll);
          });
        }
        console.log("targetFound", targetFound);
      };
      let triggerElId, bodyG, bodyPosition, bodyRect;

      opts = opts || {};

      helpers.addBodyItemsAndUpdateHeights = () => {
        const currentScroll = (window.pageYOffset || document.documentElement.scrollTop)
          - (document.documentElement.clientTop || 0);

        svg.attr('height', 10);

        if (bodyG) bodyG.remove();
        bodyG = boxG.append('g').attr({
          transform: `translate(0, ${nameHeight})`,
        });
        bodyRect = bodyG.append('rect').attr({
          fill: '#fff',
          stroke: '#000',
          width,
        }).style({
          filter: 'url(#diagrams-drop-shadow-box)',
        });
        triggerElId = 0;
        addBodyItems();
        diagram.setRelationships(conf.body);
        d.svg.updateHeigthOfElWithOtherEl(svg, boxG, 50);
        d.svg.updateHeigthOfElWithOtherEl(bodyRect, boxG, 25 - nameHeight);

        window.scrollTo(0, currentScroll);
        diagram.emit('items-rendered');
      };

      d.svg.addFilterColor({ container: svg, deviation: 3, id: 'box', slope: 4 });

      nameG.append('rect').attr({
        fill: '#fff',
        height: nameHeight,
        stroke: '#000',
        width,
      }).style({
        filter: 'url(#diagrams-drop-shadow-box)',
      });
      nameG.append('text').attr({
        x: width / 2,
        y: 30,
      }).text(conf.name).style({
        'font-weight': 'bold',
        'text-anchor': 'middle',
      });

      d3.select(document.body).style('opacity', 0);
      helpers.addBodyItemsAndUpdateHeights();

      if (opts.allCollapsed === true) helpers.collapseAll(creationId);
      helpers.addButtons(creationId);
      d3.select(document.body).style('opacity', 1);

      if (urlParams.target) scrollToTarget(urlParams.target);
    }

    setRelationships(items, container) {
      const diagram = this;

      _.each(items, (item) => {
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
    helpers,
    name: 'box',
  });
};
