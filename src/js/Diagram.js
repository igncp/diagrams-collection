var defaultDiagramConfiguration = {},
  createName = function(name) {
    return '$' + name;
  };

class EventEmitter {
  emit(name, data) {
    var fnName = createName(name);
    this._subjects[fnName] || (this._subjects[fnName] = new Rx.Subject());
    this._subjects[fnName].onNext(data);
  }

  listen(name, handler) {
    var fnName = createName(name);
    this._subjects[fnName] || (this._subjects[fnName] = new Rx.Subject());
    return this._subjects[fnName].subscribe(handler);
  }

  dispose() {
    var subjects = this._subjects;
    for (var prop in subjects) {
      if ({}.hasOwnProperty.call(subjects, prop)) {
        subjects[prop].dispose();
      }
    }

    this._subjects = {};
  }
}

d.Diagram = class Diagram extends EventEmitter {
  constructor(opts) {
    super();
    var prototype = Object.getPrototypeOf(this);

    this._subjects = {};
    this.name = opts.name;
    this._configuration = this.configuration || {};

    _.merge(this._configuration, defaultDiagramConfiguration);
    _.defaults(prototype, opts.helpers);

    this.register();
    this.setDiagramListeners();
  }

  handleItemClick(el, data) {
    var diagram = this;
    el.on('click', function() {
      d3.event.stopPropagation();
      diagram.emit('itemclick', data);
    });
  }

  setDiagramListeners() {
    this.listen('itemclick', function(itemData) {
      if (itemData && itemData.text) {
        d.tooltip('hide');
        d.utils.fillBannerWithText(itemData.text);
      }
    });
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

  register() {
    var diagram = this;
    d[diagram.name] = function() {
      var args = arguments;
      d.utils.runIfReady(function() {
        diagram.create.apply(diagram, args);
      });
    };

    _.defaults(d[diagram.name], Object.getPrototypeOf(diagram));
  }
};
