d.tooltip = function(display, elementAbove, text) {
  var tooltipId = 'diagrams-tooltip',
    tooltip = d3.select('#' + tooltipId),
    tooltipStyle = '',
    bodyHeight = (function() {
      var body = document.body,
        html = document.documentElement;
      return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    })(),
    tooltipP, tooltipHeight, tooltipTop, body, otherElementDims;

  if (text !== false) {
    if (tooltip[0][0] === null) {
      body = d3.select('body');
      tooltip = body.insert('div', 'svg').attr({
        id: tooltipId
      });
      tooltip.append('p');
    }

    tooltipP = tooltip.select('p');

    if (display === 'show') {
      tooltipStyle += 'display: inline-block; ';
      tooltipP.html(text);

      if (typeof(elementAbove) === 'string') elementAbove = document.getElementById(elementAbove);
      else elementAbove = document.getElementById(elementAbove[0][0].id);
      otherElementDims = elementAbove.getBoundingClientRect();

      tooltip.attr('style', tooltipStyle + '; opacity: 0');
      tooltipHeight = tooltip.node().getBoundingClientRect().height;

      tooltipTop = otherElementDims.top + otherElementDims.height + document.body.scrollTop + 20;
      if (tooltipTop + tooltipHeight > bodyHeight) {
        tooltipTop = otherElementDims.top + document.body.scrollTop - 20 - tooltipHeight;
        if (tooltipTop < 0) {
          tooltipTop = otherElementDims.top + otherElementDims.height + document.body.scrollTop - tooltipHeight;
        }
      }
      tooltipStyle += 'top: ' + tooltipTop + 'px; ';

    } else if (display === 'hide') tooltipStyle += 'display: none; ';

    tooltip.attr('style', tooltipStyle);
  }
};

d.tooltip.onMouseEnterListenerFn = _.partial(d.tooltip, 'show');
d.tooltip.onMouseLeaveListenerFn = _.partial(d.tooltip, 'hide');

d.tooltip.setMouseListeners = function(el, elId, text) {
  el.on('mouseenter', function() {
    d.tooltip.onMouseEnterListenerFn(elId, text);
  });
  el.on('mouseleave', function() {
    d.tooltip.onMouseLeaveListenerFn();
  });
};
d.tooltip.generateATextDescriptionStr = function(text, description) {
  return '<strong>' + text + '</strong>' + (description ? '<br>' + description : '');
};
