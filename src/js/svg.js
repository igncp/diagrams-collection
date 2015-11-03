import d from 'diagrams';

const svg = {};

svg.addVerticalGradientFilter = function(container, id, colors) {
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

svg.addFilterColor = function(id, container, deviation, slope, extra) {
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

svg.getDiagramWrapperStr = ()=>  d.diagramsWrapperSelector || 'body';

svg.generateSvg = function(style) {
  const selector = svg.getDiagramWrapperStr();
  var bodyDims = document.body.getBoundingClientRect();

  return d3.select(selector).append('svg').attr({
    width: bodyDims.width - 40,
    height: 4000
  }).style(style);
};

svg.updateHeigthOfElWithOtherEl = function(el, otherEl, offset) {
  el.attr({
    height: otherEl[0][0].getBoundingClientRect().height + (offset || 0)
  });
};

svg.textEllipsis = function(width) {
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

svg.insertInBodyBeforeSvg = (tag)=> {
  const diagramWrapper = svg.getDiagramWrapperStr();
  const body = d3.select('body');
  const elementAfterName = (diagramWrapper === 'body') ? 'svg' : diagramWrapper;
  const el = body.insert(tag,  elementAfterName);

  return el;
};

svg.fullscreenElement = ()=> document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement ||
  null;

svg.selectScreenHeightOrHeight = height => (d.svg.fullscreenElement()) ? screen.height - 30 : height;

export default svg;
