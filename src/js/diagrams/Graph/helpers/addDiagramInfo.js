import { isString } from "lodash"

import d from 'diagrams'

const addConditionallyMouseListenersToEl = ({ diagram, el, hasDescription, info }) => {
  if (hasDescription) {
    diagram.addMouseListenersToEl(el, {
      el,
      fullText: d.utils.generateATextDescriptionStr(info[0], info[1]),
    })
  }
}

export default (diagram, svg, info) => {
  if (isString(info)) info = [info]
  const hasDescription = info.length === 2
  const svgWidth = svg[0][0].getBoundingClientRect().width
  const infoText = info[0] + (hasDescription ? ' (...)' : '')
  const el = svg.append('g').attr({
    class: 'graph-info',
    transform: 'translate(10, 50)',
  }).append('text').text(infoText).each(d.svg.textEllipsis(svgWidth))

  addConditionallyMouseListenersToEl({ diagram, el, hasDescription, info })
}
