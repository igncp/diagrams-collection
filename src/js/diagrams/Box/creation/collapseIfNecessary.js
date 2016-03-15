import { isUndefined } from "lodash"

import {
  addBodyItemsAndUpdateHeights, collapseItem, expandItem,
} from '../helpers'

import { getFeatures } from '../features'
const f = getFeatures()

import triggerElIdHandler from './triggerElIdHandler'

const collapseIfNecessary = (el, item) => {
  if (item.items.length > 0 || item.collapsedItems) {
    const textEl = el.select('text')
    const yDim = Number(textEl.attr('y'))
    const xDim = Number(textEl.attr('x'))
    const triggerEl = el.append('g').attr({
      class: 'collapsible-trigger',
    })
    const collapseListener = () => {
      collapseItem(item)
      addBodyItemsAndUpdateHeights.run()
    }
    const expandListener = () => {
      expandItem(item)
      addBodyItemsAndUpdateHeights.run()
    }
    const triggerTextEl = triggerEl.append('text').attr({
      x: xDim + f.trigger.text.xOffset,
      y: yDim + f.trigger.text.yOffset,
    })
    const setCollapseTextAndListener = () => {
      triggerTextEl.text('-').attr('class', 'minus')
      triggerEl.on('click', collapseListener)
    }
    const setExpandTextAndListener = () => {
      triggerTextEl.text('+').attr({
        class: 'plus',
        y: yDim,
      })
      triggerEl.on('click', expandListener)
    }
    let clipPathId

    triggerElIdHandler.increase()
    clipPathId = `clippath-${triggerElIdHandler.get()}`
    triggerEl.append('clipPath').attr('id', clipPathId)
      .append('rect').attr({
        height: f.trigger.CP.height,
        width: f.trigger.CP.width,
        x: xDim + f.trigger.CP.xOffset,
        y: yDim + f.trigger.CP.yOffset,
      })

    triggerTextEl.attr('clip-path', `url(#${clipPathId})`)

    if (isUndefined(item.collapsed)) {
      item.collapsed = false
      setCollapseTextAndListener()
    } else {
      if (item.collapsed === true) setExpandTextAndListener()
      else if (item.collapsed === false) setCollapseTextAndListener()
    }
  }
}

export default collapseIfNecessary
