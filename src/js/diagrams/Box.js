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
      var convertDataToLayers = function(dependants) {
          _.each(dependants, function(dependant, index) {
            if (_.isString(dependant)) {
              dependant = dependants[index] = {
                text: dependant
              };
            }
            if (dependant.description) dependant.text += ': ' + dependant.description;
            if (dependant.dependants) convertDataToLayers(dependant.dependants);
            else dependant.dependants = [];
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
        dependants: origConf.body
      });
      convertDataToLayers(layersData[0].dependants);
      createLayers();
    },

    generateContainer: function(text, description, dependants) {
      var container;

      if (_.isArray(description)) {
        dependants = description;
        description = null;
      }

      container = {
        type: 'container',
        text: text,
        dependants: dependants,
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
    var diagram = this,
      origConf = _.cloneDeep(conf),
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
      addBodyDependants = function(dependants, container, depth) {
        var newContainer, text, textG, textWidth, descriptionWidth, containerText;

        dependants = dependants || conf.body;
        container = container || bodyG;
        depth = depth || 1;

        _.each(dependants, function(dependant) {
          var currentTextGId, dependantText;

          currentTextGId = 'diagrams-box-text-' + textGId++;
          if (dependant.type === 'container') {
            newContainer = container.append('g');
            containerText = '· ' + dependant.text;
            if (dependant.dependants && dependant.dependants.length > 0) containerText += ':';
            if (dependant.description) {
              dependantText = d.tooltip.generateATextDescriptionStr(containerText, dependant.description);
              containerText += ' (...)';
            } else {
              dependantText = false;
            }
            textG = newContainer.append('text').text(containerText).attr({
              x: depthWidth * depth,
              y: rowHeight * ++bodyPosition,
              id: currentTextGId
            });
            // dependant.dependants = _.sortBy(dependant.dependants, 'text');
            addBodyDependants(dependant.dependants, newContainer, depth + 1);
          } else if (dependant.type === 'link') {
            textG = container.append('svg:a').attr("xlink:href", dependant.url)
              .append('text').text(dependant.text).attr({
                id: currentTextGId,
                x: depthWidth * depth,
                y: rowHeight * ++bodyPosition,
                fill: '#3962B8'
              });

            dependantText = dependant.text + ' (' + dependant.url + ')';
          } else if (dependant.type === 'definition') {
            textG = container.append('g').attr({
              id: currentTextGId
            });
            text = textG.append('text').text(dependant.text).attr({
              x: depthWidth * depth,
              y: rowHeight * ++bodyPosition
            }).style({
              'font-weight': 'bold'
            });
            if (dependant.description) {
              textWidth = text[0][0].getBoundingClientRect().width;
              descriptionWidth = svg[0][0].getBoundingClientRect().width - textWidth - depthWidth * depth - 30;

              textG.append('text').text('- ' + dependant.description).attr({
                x: depthWidth * depth + textWidth + 5,
                y: rowHeight * bodyPosition - 1
              }).each(d.svg.textEllipsis(descriptionWidth));
            }

            dependantText = d.tooltip.generateATextDescriptionStr(dependant.text, dependant.description);
          } else if (_.isString(dependant)) {
            textG = container.append('text').text(dependant).attr({
              id: currentTextGId,
              x: depthWidth * depth,
              y: rowHeight * ++bodyPosition
            });

            dependantText = dependant;
          }

          diagram.handleItemClick(textG, {
            text: dependantText
          });

          d.tooltip.setMouseListeners(textG, currentTextGId, dependantText);
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
    addBodyDependants();
    d.svg.updateHeigthOfElWithOtherEl(svg, boxG, 50);
    d.svg.updateHeigthOfElWithOtherEl(bodyRect, boxG, 25 - nameHeight);
    
    helpers.addConvertToLayersButton(origConf);
  }
};

new Box({
  name: 'box',
  helpers: helpers
});
