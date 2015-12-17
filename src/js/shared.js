const shared = {
  get(key) {
    shared.throwIfSharedMethodAlreadyExists(key);

    return shared[key];
  },
  set(data) {
    shared.throwIfSharedMethodAlreadyExists(data);

    for (const prop in data) {
      if (data.hasOwnProperty(prop)) shared[prop] = data[prop];
    }
  },
  getWithStartingBreakLine: () => `<br>${shared.get(...arguments)}`,
  throwIfSharedMethodAlreadyExists(data) {
    let keys;

    if (_.isObject(data)) {
      keys = Object.keys(data);
      _.each(keys, shared.throwIfSharedMethodAlreadyExists);
    } else if (_.isString(data)) {
      if (shared[methodsVarName].indexOf(data) > 0) throw new Error(`Reserved keyword: ${data}`);
    }
  },
};

const methodsVarName = 'builtInMethods';

shared[methodsVarName] = _.keys(shared).concat(methodsVarName);

export default shared;
