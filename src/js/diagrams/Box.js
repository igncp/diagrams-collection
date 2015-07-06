var helpers = {
    generateDefinitionWithSharedGet: function() {
      var text = arguments[0],
        sharedKey, preffix;

      preffix = (arguments.length > 1) ? arguments[1] : '';
      sharedKey = preffix + text.split('(')[0];

      return Box.generateDefinition(text, d.shared.get(sharedKey));
    },

    addConvertToLayersButton: function(origConf) {
      var body = d3.select('body');

      body.insert('div', 'svg').append('input').attr({
        type: 'button',
        'class': 'conversion-button',
        value: 'Convert to layers diagram',
        onclick: 'diagrams.box.convertToLayerWrapper()' // refactor this
      });

      diagrams.box.convertToLayerWrapper = function() {
        helpers.convertToLayer(origConf);
      };
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

    generateContainer: function(text, description, items) {
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

    generateLink: function(text, url) {
      return {
        type: 'link',
        text: text,
        url: url
      };
    },

    generateDefinition: function(text, description) {
      return {
        type: 'definition',
        text: text,
        description: description
      };
    }
  },
  textGId = 0,
  Box;

Box = class Box extends d.Diagram {
  create(conf) {
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
      addBodyItems = function(items, container, depth) {
        var newContainer, text, textG, textWidth, descriptionWidth, containerText;

        items = items || conf.body;
        container = container || bodyG;
        depth = depth || 1;

        _.each(items, function(item) {
          var currentTextGId, itemText;

          currentTextGId = 'diagrams-box-text-' + textGId++;
          if (item.type === 'container') {
            newContainer = container.append('g');
            containerText = '· ' + item.text;
            if (item.items && item.items.length > 0) containerText += ':';
            if (item.description) {
              itemText = d.tooltip.generateATextDescriptionStr(containerText, item.description);
              containerText += ' (...)';
            } else {
              itemText = false;
            }
            textG = newContainer.append('text').text(containerText).attr({
              x: depthWidth * depth,
              y: rowHeight * ++bodyPosition,
              id: currentTextGId
            });
            // item.items = _.sortBy(item.items, 'text');
            addBodyItems(item.items, newContainer, depth + 1);
          } else if (item.type === 'link') {
            textG = container.append('svg:a').attr("xlink:href", item.url)
              .append('text').text(item.text).attr({
                id: currentTextGId,
                x: depthWidth * depth,
                y: rowHeight * ++bodyPosition,
                fill: '#3962B8'
              });

            itemText = item.text + ' (' + item.url + ')';
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

            itemText = d.tooltip.generateATextDescriptionStr(item.text, item.description);
          } else if (_.isString(item)) {
            textG = container.append('text').text(item).attr({
              id: currentTextGId,
              x: depthWidth * depth,
              y: rowHeight * ++bodyPosition
            });

            itemText = item;
          }
          if (itemText) d.utils.fillBannerOnClick(textG, itemText);
          d.tooltip.setMouseListeners(textG, currentTextGId, itemText);
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
};

new Box({
  name: 'box',
  helpers: helpers
});
