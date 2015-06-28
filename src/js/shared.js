d.shared = {
  get: function(key) {
    if (key === 'set' || key === 'get') throw new Error('Reserved keyword: ' + key);
    return d.shared[key];
  },
  set: function(data) {
    var keys = Object.keys(data);
    if (_.contains(keys, 'get') || _.contains(keys, 'set'))  throw new Error('Reserved keyword in data: ' + data);
    d.shared = _.defaults(d.shared, data);
  }
};
