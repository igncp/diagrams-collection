d.shared = {
  get: function(key) {
    d.shared.throwIfSharedMethodAlreadyExists(key);
    return d.shared[key];
  },
  set: function(data) {
    d.shared.throwIfSharedMethodAlreadyExists(data);
    d.shared = _.defaults(d.shared, data);
  },
  getWithStartingBreakLine: function() {
    return "<br>" + d.shared.get.apply(d.shared, arguments);
  },
  throwIfSharedMethodAlreadyExists: function(data) {
    var keys;
    if (_.isObject(data)) {
      keys = Object.keys(data);
      _.each(keys, d.shared.throwIfSharedMethodAlreadyExists);
    } else if (_.isString(data)) {
      if (d.shared[methodsVarName].indexOf(data) > 0) throw new Error('Reserved keyword: ' + data);
    }
  }
};

var methodsVarName = 'builtInMethods';
d.shared[methodsVarName] = Object.keys(d.shared);
d.shared[methodsVarName].push(methodsVarName);
