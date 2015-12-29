import d from 'diagrams';

let linksNumberMap;

const helpers = {
  resetLinksNumberMap() {
    linksNumberMap = {};
  },
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

helpers.resetLinksNumberMap();

export default helpers;
