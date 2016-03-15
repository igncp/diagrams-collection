import { select } from "d3"

import d from 'diagrams'
import helpers from '../helpers'

import getAddBodyItemsFn from './getAddBodyItemsFn'
import scrollToTarget from './scrollToTarget'

import { getFeatures } from '../features'
const f = getFeatures()

export const getCreationFn = (diagram) => {
  return (creationId, conf, opts) => {
    const svg = d.svg.generateSvg()
    const width = svg.attr('width') - 40
    const boxG = svg.append('g').attr({
      class: 'box-diagram',
      transform: 'translate(20, 20)',
    })
    const nameG = boxG.append('g')
    const urlParams = d.utils.getUrlParams()

    opts = opts || {}

    helpers.addBodyItemsAndUpdateHeights.set(getAddBodyItemsFn({ boxG, conf, diagram, svg, width }))

    d.svg.addFilterColor({ container: svg, deviation: 3, id: 'box', slope: 4 })

    nameG.append('rect').attr({
      fill: '#fff',
      height: f.nameHeight,
      stroke: '#000',
      width,
    }).style({
      filter: 'url(#diagrams-drop-shadow-box)',
    })
    nameG.append('text').attr({
      x: width / 2,
      y: 30,
    }).text(conf.name).style({
      'font-weight': 'bold',
      'text-anchor': 'middle',
    })

    select(document.body).style('opacity', 0)
    helpers.addBodyItemsAndUpdateHeights.run()

    if (opts.allCollapsed === true) helpers.collapseAll(creationId)
    helpers.addButtons(creationId)
    select(document.body).style('opacity', 1)

    if (urlParams.target) scrollToTarget(urlParams.target, conf)
  }
}
