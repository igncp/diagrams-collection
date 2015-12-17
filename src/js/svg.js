import d from 'diagrams';

const addEllipsis = ({ textLength, width, text }) => {
  while (textLength > width && text.length > 0) {
    text = text.slice(0, -4);
    self.text(`${text}...`);
    textLength = self.node().getComputedTextLength();
  }
};

const appendElsToFilterColor = ({ filter, deviation, slope }) => {
  filter.append('feOffset').attr({
    result: 'offOut',
    in: 'SourceGraphic',
    dx: 0.5,
    dy: 0.5,
  });
  filter.append('feGaussianBlur').attr({
    result: 'blurOut',
    in: 'offOut',
    stdDeviation: deviation,
  });
  filter.append('feBlend').attr({
    in: 'SourceGraphic',
    in2: 'blurOut',
    mode: 'normal',
  });
  filter.append('feComponentTransfer').append('feFuncA').attr({
    type: 'linear',
    slope,
  });
};

const svg = {
  addVerticalGradientFilter(container, id, colors) {
    const defs = container.append('defs');
    const linearGradient = defs.append('linearGradient').attr({
      id,
      x1: '0%',
      y1: '0%',
      x2: '0%',
      y2: '100%',
    });

    linearGradient.append('stop').attr('offset', '0%').style({
      'stop-color': colors[0],
      'stop-opacity': 1,
    });
    linearGradient.append('stop').attr('offset', '100%').style({
      'stop-color': colors[1],
      'stop-opacity': 1,
    });
  },

  addFilterColor({ id, container, deviation, slope, extra }) {
    const defs = container.append('defs');
    const filter = defs.append('filter').attr({
      id: `diagrams-drop-shadow-${id}`,
    });

    if (extra) filter.attr({
      width: '500%',
      height: '500%',
      x: '-200%',
      y: '-200%',
    });

    appendElsToFilterColor({ filter, deviation, slope });
  },

  generateSvg(style) {
    const selector = svg.getDiagramWrapperStr();
    const bodyDims = document.body.getBoundingClientRect();

    return d3.select(selector).append('svg').attr({
      width: bodyDims.width - 40,
      height: 4000,
    }).style(style);
  },

  textEllipsis(width) {
    return function() {
      const self = d3.select(this);
      const textLength = self.node().getComputedTextLength();
      const text = self.text();

      addEllipsis({ width, textLength, text });
    };
  },

  updateHeigthOfElWithOtherEl(el, otherEl, offset) {
    el.attr({
      height: otherEl[0][0].getBoundingClientRect().height + (offset || 0),
    });
  },

  insertInBodyBeforeSvg(tag) {
    const diagramWrapper = svg.getDiagramWrapperStr();
    const body = d3.select('body');
    const elementAfterName = (diagramWrapper === 'body') ? 'svg' : diagramWrapper;
    const el = body.insert(tag, elementAfterName);

    return el;
  },
};

svg.getDiagramWrapperStr = () => d.diagramsWrapperSelector || 'body';

svg.fullscreenElement = () => document.fullscreenElement
  || document.webkitFullscreenElement
  || document.mozFullScreenElement
  || document.msFullscreenElement
  || null;

svg.selectScreenHeightOrHeight = height =>
  (d.svg.fullscreenElement()) ? screen.height - 30 : height;

export default svg;
