import d from 'diagrams';
import svg from 'svg';

const defaultDiagramConfiguration = {};
let createdDiagramsMaxId = 0;

d.diagramsRegistry = [];

const getDiagramClass = ()=> {
  const Diagram = class Diagram {
    static convertDiagram(creationId, toDiagramType) {
      var item = Diagram.getRegistryItemWithCreationId(creationId),
        newArgs = item.data.slice(1),
        generalData, specificData;

      generalData = item.diagram.dataFromSpecificToGeneral.apply({}, newArgs);
      specificData = d[toDiagramType].dataFromGeneralToSpecific.apply({}, [generalData]);

      d.events.emit('diagram-to-transform', item.diagram);

      Diagram.removePreviousDiagrams();
      d[toDiagramType].apply(item.diagram, [specificData]);
    }

    static removePreviousDiagrams() {
      d3.selectAll('input.diagrams-diagram-button').remove();
      d3.select('svg').remove();
    }

    static addDivBeforeSvg() {
      const div = svg.insertInBodyBeforeSvg('div');

      div.appendButtonToDiv = function(cls, value, onClickFn) {
        div.append('input').attr({
          type: 'button',
          'class': cls + ' diagrams-diagram-button btn btn-default',
          value: value,
          onclick: onClickFn
        });
      };

      return div;
    }

    static getRegistryItemWithCreationId(creationId) {
      var items = _.where(d.diagramsRegistry, {
        id: creationId
      });

      return (items.length === 1) ? items[0] : null;
    }

    static getDataWithCreationId(creationId) {
      var item = Diagram.getRegistryItemWithCreationId(creationId);

      return (item) ? item.data : null;
    }

    constructor(opts) {
      var diagram = this,
        prototype = Object.getPrototypeOf(diagram);

      diagram.name = opts.name;
      diagram._configuration = opts.configuration || {};

      prototype.configurationKeys = opts.configurationKeys || {};

      _.each(Object.keys(opts.helpers), function(helperName) {
        if (_.isFunction(opts.helpers[helperName])) {
          opts.helpers[helperName] = _.bind(opts.helpers[helperName], diagram);
        }
      });
      _.merge(diagram._configuration, defaultDiagramConfiguration);
      _.each(Object.keys(diagram._configuration), function(confKey) {
        diagram.configCheckingLocalStorage(confKey, diagram._configuration[confKey]);
      });
      _.defaults(prototype, opts.helpers);
      diagram.register();
    }

    reRender() {
      return null;
    }

    addMouseListenersToEl(el, data, callbacks) {
      var diagram = this,
        emitFn = function(d3Event, emitedEvent) {
          emitedEvent = emitedEvent || d3Event;
          el.on(d3Event, function() {
            diagram.emit(emitedEvent, emitContent);
            if (callbacks && callbacks[d3Event]) callbacks[d3Event](emitContent);
          });
        },
        emitContent = {
          el: el,
          data: data
        };

      emitFn('mouseleave');
      emitFn('mouseenter');
      emitFn('click', 'itemclick');
    }

    removePreviousAndCreate() {
      var diagram = this;
      
      Diagram.removePreviousDiagrams();
      diagram.addConversionButtons();
      diagram.create.apply(diagram, arguments);
    }

    config(opts, optValue) {
      var argsLength = arguments.length,
        optsType = typeof(opts),
        optsKey;

      if (argsLength === 0) return this._configuration;
      else if (argsLength === 1) {
        if (_.isFunction(optsType)) optsKey = opts();
        else if (_.isString(opts)) optsKey = opts;
        else if (_.isObject(opts)) {
          for (let key in opts) {
            if (opts.hasOwnProperty(key)) this.config(key, opts[key]);
          }
          return opts;
        }
        return this._configuration[optsKey];
      } else if (argsLength === 2) {
        this._configuration[opts] = optValue;
        if (_.isObject(optValue)) this.setToLocalStorage(opts, optValue.value);
        else this.setToLocalStorage(opts, optValue);

        this.emit('configuration-changed', {
          key: opts,
          value: optValue
        });
        return optValue;
      }
    }

    configCheckingLocalStorage(key, defaultValue) {
      var diagram = this,
        finalValue = diagram.getFromLocalStorage(key, defaultValue);

      diagram.config(key, finalValue);
    }

    generateLocalStorageKeyPreffix(originalKey) {
      return 'diagramsjs-' + originalKey;
    }

    getFromLocalStorage(originalKey, defaultItem) {
      var diagram = this,
        getAndConvertStrBoolean = function(defaultValue) {
          var rv = localStorage.getItem(diagram.generateLocalStorageKeyPreffix(originalKey)) || defaultValue;
          if (rv === 'false') rv = false;
          else if (rv === 'true') rv = true;
          return rv;
        },
        finalValue = defaultItem;

      if (localStorage && localStorage.getItem) {
        if (_.isObject(finalValue)) {
          finalValue.value = getAndConvertStrBoolean(finalValue.value);
          if (finalValue.type) finalValue.value = finalValue.type(finalValue.value);
        } else finalValue = getAndConvertStrBoolean(finalValue);
      }

      return finalValue;
    }

    setToLocalStorage(originalKey, value) {
      var diagram = this;
      if (localStorage && localStorage.setItem) {
        return localStorage.setItem(diagram.generateLocalStorageKeyPreffix(originalKey), value);
      }
    }

    generateEmptyRelationships(item) {
      item.relationships = {};
      item.relationships.dependants = [];
      item.relationships.dependencies = [];
    }

    addDependantRelationship(item, el, data) {
      item.relationships.dependants.push(this.generateRelationship(el, data));
    }

    addSelfRelationship(item, el, data) {
      item.relationships.self = this.generateRelationship(el, data);
    }

    addDependencyRelationship(item, el, data) {
      item.relationships.dependencies.push(this.generateRelationship(el, data));
    }

    generateRelationship(el, data) {
      return {
        el: el,
        data: data
      };
    }

    getAllRelatedItemsOfItem(item, relationshipType) {
      var diagram = this,
        relatedItems = [],
        recursiveFn = function(relatedItemData, depth) {
          _.each(relatedItemData.relationships[relationshipType], function(relatedItemChild) {
            if (depth < 100) {
              if (relatedItems.indexOf(relatedItemChild) < 0 && relatedItemChild.data !== relatedItemData) { // Handle circular loops
                relatedItems.push(relatedItemChild);
                recursiveFn(relatedItemChild.data, depth + 1);
              }
            }
          });
        },
        returnObj;

      if (relationshipType) {
        recursiveFn(item, 0);
        return relatedItems;
      } else {
        returnObj = {};
        _.each(['dependants', 'dependencies'], function(relationshipName) {
          returnObj[relationshipName] = diagram.getAllRelatedItemsOfItem(item, relationshipName);
        });
        return returnObj;
      }
    }

    markRelatedItems(item, opts) {
      var diagram = this,
        relatedItemsGroup,
        pushToRelatedItemsGroup = function(args) {
          relatedItemsGroup.push(diagram.getAllRelatedItemsOfItem.apply(diagram, [item].concat(args)));
        };

      opts = opts || {};
      if (diagram.markRelatedFn && item.relationships) {
        relatedItemsGroup = [];

        if (opts.filter) pushToRelatedItemsGroup([opts.filter]);
        else _.each([
          ['dependants'],
          ['dependencies']
        ], pushToRelatedItemsGroup);

        _.each(relatedItemsGroup, function(relatedItems) {
          _.each(relatedItems, diagram.markRelatedFn);
        });

        diagram.markRelatedFn(item.relationships.self);
      }
    }

    register() {
      var diagram = this;
      d.diagramTypes = d.diagramTypes || [];
      d.diagramTypes.push(diagram.name);
      d[diagram.name] = function() {
        var args = Array.prototype.slice.call(arguments);
        d.utils.runIfReady(function() {
          createdDiagramsMaxId++;
          d.diagramsRegistry.push({
            diagram: diagram,
            data: args,
            id: createdDiagramsMaxId
          });
          diagram.diagramId = createdDiagramsMaxId;
          diagram.addConversionButtons();
          args.unshift(createdDiagramsMaxId);
          diagram.create.apply(diagram, args);
          d.events.emit('diagram-created', diagram);
        });
      };

      _.defaults(d[diagram.name], Object.getPrototypeOf(diagram));
    }

    addConversionButtons() {
      var diagram = this,
        div = Diagram.addDivBeforeSvg(),
        onClickFn;

      _.each(d.diagramTypes, function(diagramType) {
        if (diagramType !== diagram.name) {
          onClickFn = 'diagrams.Diagram.convertDiagram(' + diagram.diagramId + ', \'' + diagramType + '\')';
          div.appendButtonToDiv('diagrams-box-conversion-button', 'To ' + diagramType + ' diagram', onClickFn);
        }
      });
    }
  };

  d.utils.composeWithEventEmitter(Diagram);

  return Diagram;
};

export default getDiagramClass;