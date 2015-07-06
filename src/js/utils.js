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
d.utils.fillBannerWithText = function(content) {
  var bannerId = 'diagrams-banner',
    previousBanner = d3.select('#' + bannerId),
    body = d3.select('body'),
    bannerEl, bannerHtml;

  if (previousBanner) previousBanner.remove();
  
  bannerHtml = '<div class="diagrams-banner-cross">&#x2715;</div>';
  bannerHtml += d.utils.formatTextFragment(content);

  bannerEl = body.insert('div', 'svg').attr({
    id: bannerId
  }).html(bannerHtml);
  bannerEl.on('click', function() {
    bannerEl.remove();
  });
};
d.utils.replaceCodeFragmentOfText = function(text, predicate) {
  var codeRegex = /``([\s\S]*?)``([\s\S]*?)``/g,
    allMatches = text.match(codeRegex);

  return text.replace(codeRegex, function(matchStr, language, codeBlock) {
    return predicate(matchStr, language, codeBlock, allMatches);
  });
};
d.utils.formatTextFragment = function(text) {
  text = d.utils.replaceCodeFragmentOfText(text, function(matchStr, language, code, allMatches) {
    var lastMatch = (matchStr === _.last(allMatches));
    return '<pre' + (lastMatch ? ' class="last-code-block" ' : '') + '><code>' + hljs.highlight(language, code).value + '</pre></code>';
  });
  return text;
};
d.utils.codeBlockOfLanguageFn = function(language, commentsSymbol) {
  commentsSymbol = commentsSymbol || '';
  return function(codeBlock, where, withInlineStrs) {
    if (withInlineStrs === true) codeBlock = commentsSymbol + " ...\n" + codeBlock + "\n" + commentsSymbol + " ...";
    if (_.isString(where)) codeBlock = commentsSymbol + ' @' + where + "\n" + codeBlock;
    return '``' + language + '``' + codeBlock + '``';
  };
};
// This function is created to be able to reference it in the diagrams
d.utils.wrapInParagraph = function(text) {
  return '<p>' + text + '</p>';
};
d.utils.fillBannerOnClick = function(el, text, onMouseDown) {
  var event = onMouseDown ? 'mousedown' : 'click';
  el.on(event, function() {
    d.tooltip('hide');
    d3.event.stopPropagation();
    d.utils.fillBannerWithText(text);
  });
};
