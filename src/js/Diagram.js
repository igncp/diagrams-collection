d.Diagram = class Diagram {
  constructor(opts) {
    var prototype = Object.getPrototypeOf(this);

    this.name = opts.name;
    _.defaults(prototype, opts.helpers);
    this.register();
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
