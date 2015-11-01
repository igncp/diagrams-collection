const shared = {
  get: function(key) {
    shared.throwIfSharedMethodAlreadyExists(key);
    return shared[key];
  },
  set: function(data) {
    shared.throwIfSharedMethodAlreadyExists(data);

    for (let prop in data) {
      if (data.hasOwnProperty(prop)) shared[prop] = data[prop];
    }
  },
  getWithStartingBreakLine: function() {
    return "<br>" + shared.get.apply(shared, arguments);
  },
  throwIfSharedMethodAlreadyExists: function(data) {
    var keys;
    if (_.isObject(data)) {
      keys = Object.keys(data);
      _.each(keys, shared.throwIfSharedMethodAlreadyExists);
    } else if (_.isString(data)) {
      if (shared[methodsVarName].indexOf(data) > 0) throw new Error('Reserved keyword: ' + data);
    }
  }
};

var methodsVarName = 'builtInMethods';
shared[methodsVarName] = Object.keys(shared);
shared[methodsVarName].push(methodsVarName);

export default shared;
