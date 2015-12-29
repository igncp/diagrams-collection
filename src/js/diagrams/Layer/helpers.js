import d from 'diagrams';

const helpers = {
  ids: 0,
  Grid: class Grid {
    constructor(fixedWidth) {
      this.position = {
        x: 0,
        y: 0,
      };
      this.width = fixedWidth;
      this.cells = [];
    }
    addItemAtNewRow(item) {
      const counter = 0;

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
      let row;

      item.x = pos.x;
      item.y = pos.y;

      for (let i = 0; i < item.height; i++) {
        this.createRowIfNecessary(i + pos.y);
        row = this.cells[i + pos.y];

        for (let j = 0; j < item.width; j++) {
          row[j + pos.x] = true;
        }
      }
      this.updatePosition();
    }
    updatePosition() {
      let counter = 0;

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
      let row;

      for (let i = 0; i < item.height; i++) {
        row = this.cells[i + pos.y];

        if (_.isUndefined(row)) return true;

        for (let j = 0; j < item.width; j++) {
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
      const rows = this.cells.length;

      for (let i = 0; i < this.width; i++) {
        if (this.cells[rows - 1][i] === true) return false;
      }

      return true;
    }
    getSize() {
      const rows = this.cells.length;

      return {
        width: this.width,
        height: (this.lastRowIsEmpty()) ? rows - 1 : rows,
      };
    }
  },

  config: {
    widthSize: 350,
    heightSize: 60,
    depthWidthFactor: 4,
    depthHeightFactor: 2,
    showNumbersAll: false,
  },

  handleConnectedToNextCaseIfNecessary(layers, currentIndex) {
    const layer = layers[currentIndex];
    const nextLayer = layers[currentIndex + 1];
    let connectedTo, newId;

    if (layer.hasOwnProperty('connectedWithNext') === true && nextLayer) {
      if (nextLayer.id) newId = nextLayer.id;
      else {
        newId = `to-next-${String(++helpers.ids)}`;
        nextLayer.id = newId;
      }

      if (_.isObject(layer.connectedWithNext) && layer.connectedWithNext.type) {
        connectedTo = {
          id: newId,
          type: layer.connectedWithNext.type,
        };
      } else connectedTo = newId;

      if (layer.connectedTo) layer.connectedTo.push(connectedTo);
      else layer.connectedTo = [connectedTo];
    }
  },

  itemsOfLayerShouldBeSorted(itemsArray) {
    let ret = true;

    _.each(itemsArray, (item) => {
      if (item.hasOwnProperty('connectedTo')) ret = false;

      if (item.hasOwnProperty('connectToNext')) ret = false;
    });

    return ret;
  },

  calculateLayerWithChildrenDimensions(layer) {
    let itemsOfLayer, grid, itemsOfLayerIndex, width, gridSize, itemsShouldBeSorted;
    let totalWidth = 0;
    let totalHeight = 0;
    let maxWidth = 0;
    let maxHeight = 0;
    let whileCounter = 0;
    const itemsArray = [];
    const addedItemToGrid = (index) => {
      if (itemsOfLayer[index].inNewRow === true) {
        grid.addItemAtNewRow(itemsOfLayer[index]);
        itemsOfLayer.splice(index, 1);

        return true;
      } else if (grid.itemFitsAtCurrentPos(itemsOfLayer[index])) {
        grid.addItemAtCurrentPos(itemsOfLayer[index]);
        itemsOfLayer.splice(index, 1);

        return true;
      } else {
        return false;
      }
    };

    _.each(layer.items, (item) => {
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
      itemsOfLayer = itemsArray.sort((itemA, itemB) => {
        if (itemA.width === itemB.width) {
          return itemA.height < itemB.height;
        } else {
          return itemA.width < itemB.width;
        }
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

  generateLayersData(layers, currentDepth) {
    const config = helpers.config;
    let maxDepth, itemsDepth;

    currentDepth = currentDepth || 1;
    maxDepth = currentDepth;
    _.each(layers, (layer, layerIndex) => {
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

  getFinalLayerDimensions(layer) {
    const config = helpers.config;
    const height = layer.height * config.heightSize - config.depthHeightFactor * layer.depth * 2;
    const width = layer.width * config.widthSize - config.depthWidthFactor * layer.depth * 2;
    const transform = `translate(${config.depthWidthFactor * layer.depth},`
      + `${config.depthHeightFactor * layer.depth})`;
    const fill = `url(#color-${String(layer.depth - 1)})`;
    const dimensions = { height, width, transform, fill };

    if (config.showNumbersAll === true || (layer.containerData
      && layer.containerData.showNumbers === true)) {
      dimensions.numberTransform = `translate(`
        + `${String(width - 15 + config.depthWidthFactor * layer.depth)},`
        + `${String(config.depthHeightFactor * layer.depth + height + 0)})`;
    }

    return dimensions;
  },

  dataFromSpecificToGeneral(conf) {
    let maxId = -1;
    const finalItems = [];
    const connections = [];
    const recursiveFn = (items, parentCreatedItem) => {
      _.each(items, (item) => {
        const firstOccurrence = /(\. |:)/.exec(item.fullText);
        let name, description, splittedText, createdItem;

        if (firstOccurrence) {
          splittedText = item.fullText.split(firstOccurrence[0]);
          name = splittedText[0];
          description = splittedText.slice(1).join(firstOccurrence);
        }
        createdItem = {
          name: name || item.fullText,
          description: description || null,
          graphsData: {
            layer: {
              relationships: item.options,
              id: item.id,
            },
          },
          id: ++maxId,
        };
        finalItems.push(createdItem);

        if (parentCreatedItem) {
          connections.push({
            from: createdItem.id,
            to: parentCreatedItem.id,
          });
        }

        if (item.items && item.items.length > 0) recursiveFn(item.items, createdItem);
      });
    };

    recursiveFn([conf]);

    return {
      items: finalItems,
      connections,
    };
  },

  dataFromGeneralToSpecific(generalData) {
    return d.utils.dataFromGeneralToSpecificForATreeStructureType(generalData);
  },

  newLayer(text, opts, items) {
    let layer = { text };

    if (_.isArray(opts)) items = opts;
    else {
      if (_.isString(opts)) opts = helpers.extendOpts(opts);

      if (_.isObject(opts)) layer = _.extend(layer, opts);
    }

    if (items) layer.items = items;

     // Have to limit the id by the two sides to enable .indexOf to work
    if (_.isUndefined(layer.id)) layer.id = `layer-${++helpers.ids}-auto`;

    return layer;
  },

  newLayerConnectedToNext() {
    const args = arguments.length;

    if (args === 1) return helpers.newLayer(arguments[0], 'cn');
    else if (args === 2) {
      if (typeof(arguments[1]) === 'object')
        return helpers.newLayer(arguments[0], 'cn', arguments[1]);
      else if (typeof(arguments[1] === 'string'))
        return helpers.newLayer(arguments[0], `${arguments[1]} cn`);
    } else if (args === 3)
      return helpers.newLayer(arguments[0], `${arguments[1]} cn`, arguments[2]);
  },

  staticOptsLetters: {
    co: {
      conditional: true,
    },
    cn: {
      connectedWithNext: true,
    },
    sna: {
      showNumbersAll: true,
    },
    sn: {
      showNumbers: true,
    },
    cnd: {
      connectedWithNext: {
        type: 'dashed',
      },
    },
    nr: {
      inNewRow: true,
    },
  },

  idOpt(id) {
    return {
      id: `layer-${id}-custom`,
    };
  },

  extendOpts() {
    let result = {};

    _.each(arguments, (arg) => {
      if (typeof(arg) === 'string') {
        _.each(arg.split(' '), (opt) => {
          if (opt.substr(0, 3) === 'id-')
            result = _.extend(result, helpers.idOpt(opt.substr(3, opt.length)));
          else if (opt.substr(0, 3) === 'ct-')
            helpers.connectWithOpt(Number(opt.substr(3, opt.length)), result);
          else if (opt.substr(0, 4) === 'ctd-')
            helpers.connectWithOpt(Number(opt.substr(4, opt.length)), result, 'dashed');
          else result = _.extend(result, helpers.staticOptsLetters[opt]);
        });
      } else if (_.isObject(arg)) {
        result = _.extend(result, arg);
      }
    });

    return result;
  },

  connectWithOpt(ids, result, type) {
    const objs = [];

    if (_.isNumber(ids)) ids = [ids];
    type = type || 'standard';

    _.each(ids, (id) => {
      objs.push({
        id: `layer-${id}-custom`,
        type,
      });
    });

    if (_.isUndefined(result.connectedTo) === true) result.connectedTo = objs;
    else result.connectedTo = result.connectedTo.concat(objs);
  },

  connectWithOptAndIdOpt(ids, id) {
    const connectWithOpt = d.layer.connectWithOpt(ids);
    const idOpt = d.layer.idOpt(id);

    return _.extend(connectWithOpt, idOpt);
  },
};

_.each([
  'newLayer',
  'newLayerConnectedToNext',
], (helpersMethod) => {
  helpers[`${helpersMethod}WithCode`] = (codeLanguage) => {
    const codeFn = d.utils.codeBlockOfLanguageFn(codeLanguage);

    return function() {
      const args = arguments;

      args[0] = codeFn(args[0]);

      return helpers[helpersMethod].apply(this, args);
    };
  };

  helpers[`${helpersMethod}WithParagraphAndCode`] = (codeLanguage) => {
    const codeFn = d.utils.codeBlockOfLanguageFn(codeLanguage);

    return function() {
      let args = [].splice.call(arguments, 0);
      const paragraphText = args[0];
      const code = args[1];
      const text = d.utils.wrapInParagraph(paragraphText) + codeFn(code);

      args = args.splice(2);
      args.unshift(text);

      return helpers[helpersMethod].apply(this, args);
    };
  };
});

export default helpers;
