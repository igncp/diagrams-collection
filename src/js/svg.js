d.svg = {};
d.svg.addVerticalGradientFilter = function(container, id, colors) {
  var defs = container.append('defs'),
    linearGradient = defs.append('linearGradient').attr({
      id: id,
      x1: '0%',
      y1: '0%',
      x2: '0%',
      y2: '100%'
    });

  linearGradient.append('stop').attr('offset', '0%').style({
    'stop-color': colors[0],
    'stop-opacity': 1
  });
  linearGradient.append('stop').attr('offset', '100%').style({
    'stop-color': colors[1],
    'stop-opacity': 1
  });
};

d.svg.addFilterColor = function(id, container, deviation, slope, extra) {
  var defs = container.append('defs'),
    filter = defs.append('filter').attr({
      id: 'diagrams-drop-shadow-' + id
    });

  if (extra) filter.attr({
    width: '500%',
    height: '500%',
    x: '-200%',
    y: '-200%'
  });
  filter.append('feOffset').attr({
    result: 'offOut',
    'in': 'SourceGraphic',
    dx: 0.5,
    dy: 0.5
  });
  filter.append('feGaussianBlur').attr({
    result: 'blurOut',
    'in': 'offOut',
    stdDeviation: deviation
  });
  filter.append('feBlend').attr({
    'in': 'SourceGraphic',
    in2: 'blurOut',
    mode: 'normal'
  });
  filter.append('feComponentTransfer').append('feFuncA').attr({
    type: 'linear',
    slope: slope
  });
};

d.svg.generateSvg = function(style) {
  var bodyDims = document.body.getBoundingClientRect();

  return d3.select('body').append('svg').attr({
    width: bodyDims.width - 40,
    height: 4000
  }).style(style);
};

d.svg.updateHeigthOfElWithOtherEl = function(el, otherEl, offset) {
  el.attr({
    height: otherEl[0][0].getBoundingClientRect().height + (offset || 0)
  });
};

d.svg.textEllipsis = function(width) {
  return function() {
    var self = d3.select(this),
      textLength = self.node().getComputedTextLength(),
      text = self.text();

    while (textLength > width && text.length > 0) {
      text = text.slice(0, -4);
      self.text(text + '...');
      textLength = self.node().getComputedTextLength();
    }
  };
};