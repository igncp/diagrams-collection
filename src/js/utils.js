d.utils = {};
d.utils.d3DefaultReturnFn = function(props, preffix, suffix) {
  props = props.split('.');
  return function(d) {
    var position = _.reduce(props, function(memo, property) {
      return memo[property];
    }, d);
    return (preffix || suffix) ? preffix + position + suffix : position;
  };
};
d.utils.applySimpleTransform = function(el) {
  el.attr('transform', function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
};
d.utils.positionFn = function(props, offset) {
  offset = offset || 0;
  return d.utils.d3DefaultReturnFn(props, 0, offset);
};
d.utils.textFn = function(props, preffix, suffix) {
  preffix = preffix || '';
  suffix = suffix || '';
  return d.utils.d3DefaultReturnFn(props, preffix, suffix);
};
d.utils.runIfReady = function(fn) {
  if (document.readyState === 'complete') fn();
  else window.onload = fn;
};
d.utils.fillBannerWithText = function(text) {
  var bannerId = 'diagrams-banner',
    previousBanner = d3.select('#' + bannerId),
    body = d3.select('body');

  if (previousBanner) previousBanner.remove();
  body.insert('div', 'svg').attr({
    id: bannerId
  }).append('p').text(text);
};