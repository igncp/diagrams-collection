import d from 'diagrams'

const addEllipsis = ({ self, text, textLength, width }) => {
  while (textLength > width && text.length > 0) {
    text = text.slice(0, -4)
    self.text(`${text}...`)
    textLength = self.node().getComputedTextLength()
  }
}

const appendElsToFilterColor = ({ deviation, filter, slope }) => {
  filter.append('feOffset').attr({
    dx: 0.5,
    dy: 0.5,
    in: 'SourceGraphic',
    result: 'offOut',
  })
  filter.append('feGaussianBlur').attr({
    in: 'offOut',
    result: 'blurOut',
    stdDeviation: deviation,
  })
  filter.append('feBlend').attr({
    in: 'SourceGraphic',
    in2: 'blurOut',
    mode: 'normal',
  })
  filter.append('feComponentTransfer').append('feFuncA').attr({
    slope,
    type: 'linear',
  })
}

const svg = {
  addFilterColor({ container, deviation, extra, id, slope }) {
    const defs = container.append('defs')
    const filter = defs.append('filter').attr({
      id: `diagrams-drop-shadow-${id}`,
    })

    if (extra) filter.attr({
      height: '500%',
      width: '500%',
      x: '-200%',
      y: '-200%',
    })

    appendElsToFilterColor({ deviation, filter, slope })
  },

  addVerticalGradientFilter(container, id, colors) {
    const defs = container.append('defs')
    const linearGradient = defs.append('linearGradient').attr({
      id,
      x1: '0%',
      x2: '0%',
      y1: '0%',
      y2: '100%',
    })

    linearGradient.append('stop').attr('offset', '0%').style({
      'stop-color': colors[0],
      'stop-opacity': 1,
    })
    linearGradient.append('stop').attr('offset', '100%').style({
      'stop-color': colors[1],
      'stop-opacity': 1,
    })
  },

  generateSvg(style) {
    const selector = svg.getDiagramWrapperStr()
    const bodyDims = document.body.getBoundingClientRect()

    return d3.select(selector).append('svg').attr({
      height: 4000,
      width: bodyDims.width - 40,
    }).style(style)
  },

  insertInBodyBeforeSvg(tag) {
    const diagramWrapper = svg.getDiagramWrapperStr()
    const body = d3.select('body')
    const elementAfterName = (diagramWrapper === 'body') ? 'svg' : diagramWrapper
    const el = body.insert(tag, elementAfterName)

    return el
  },

  textEllipsis(width) {
    return function() {
      const self = d3.select(this)
      const textLength = self.node().getComputedTextLength()
      const text = self.text()

      addEllipsis({ self, text, textLength, width })
    }
  },

  updateHeigthOfElWithOtherEl(el, otherEl, offset) {
    el.attr({
      height: otherEl[0][0].getBoundingClientRect().height + (offset || 0),
    })
  },
}

svg.getDiagramWrapperStr = () => d.diagramsWrapperSelector || 'body'

svg.fullscreenElement = () => document.fullscreenElement
  || document.webkitFullscreenElement
  || document.mozFullScreenElement
  || document.msFullscreenElement
  || null

svg.selectScreenHeightOrHeight = height =>
  (d.svg.fullscreenElement()) ? screen.height - 30 : height

export default svg
