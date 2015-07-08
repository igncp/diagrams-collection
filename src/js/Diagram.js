var defaultDiagramConfiguration = {};

d.diagramsRegistry = [];

d.Diagram = class Diagram {
  constructor(opts) {
    var prototype = Object.getPrototypeOf(this);

    this.name = opts.name;
    this._configuration = this.configuration || {};

    _.merge(this._configuration, defaultDiagramConfiguration);
    _.defaults(prototype, opts.helpers);

    this.register();
  }

  handleItemClick(el, data) {
    var diagram = this;
    el.on('click', function() {
      d3.event.stopPropagation();
      diagram.emit('itemclick', data);
    });
  }

  addMouseListenersToEl(el, data) {
    var diagram = this,
      emitFn = function(d3Event, emitedEvent) {
        emitedEvent = emitedEvent || d3Event;
        el.on(d3Event, function() {
          diagram.emit(emitedEvent, emitContent);
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

  config(opts, optValue) {
    var argsLength = arguments.length,
      optsType = typeof(opts),
      optsKey;

    if (argsLength === 1) {
      if (_.isFunction(optsType)) optsKey = opts();
      else if (_.isString(opts)) optsKey = opts;
      else if (_.isObject(opts)) {
        for (let key in opts) {
          this.config(key, opts[key]);
        }
        return opts;
      }
      return this._configuration[optsKey];
    } else if (argsLength === 2) {
      this._configuration[opts] = optValue;
      return optValue;
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
    var relatedItems = [],
      recursiveFn = function(relatedItemData, depth) {
        _.each(relatedItemData.relationships[relationshipType], function(relatedItemChild) {
          if (depth < 100) {
            if (relatedItems.indexOf(relatedItemChild) < 0 && relatedItemChild.data !== relatedItemData) { // Handle circular loops
              relatedItems.push(relatedItemChild);
              recursiveFn(relatedItemChild.data, depth + 1);
            }
          }
        });
      };

    recursiveFn(item, 0);
    return relatedItems;
  }

  markRelatedItems(item) {
    var diagram = this,
      dependantItems,
      dependencyItems;
    
    if (diagram.markRelatedFn) {
      dependantItems = diagram.getAllRelatedItemsOfItem(item, 'dependants');
      dependencyItems = diagram.getAllRelatedItemsOfItem(item, 'dependencies');

      _.each([dependantItems, dependencyItems], function(relatedItems) {
        _.each(relatedItems, diagram.markRelatedFn);
      });

      diagram.markRelatedFn(item.relationships.self);
    }
  }

  register() {
    var diagram = this;
    d[diagram.name] = function() {
      var args = arguments;
      d.utils.runIfReady(function() {
        diagram.create.apply(diagram, args);
        d.diagramsRegistry.push(diagram);
        d.events.emit('diagram-created', diagram);
      });
    };

    _.defaults(d[diagram.name], Object.getPrototypeOf(diagram));
  }
};

d.utils.composeWithEventEmitter(d.Diagram);
