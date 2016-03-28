import { isString } from "lodash"
import { each } from "../../../utils/pure"

import d from 'diagrams'
import { updateHeigthOfElWithOtherEl } from "../../../svg"
import helpers from '../helpers'

import collapseIfNecessary from './collapseIfNecessary'
import triggerElIdHandler from './triggerElIdHandler'

import { getFeatures } from '../features'
const f = getFeatures()

let bodyPosition, bodyG

let textGId = 0

const addBodyItems = ({
  conf, container, depth, diagram, items, svg,
}) => {
  let newContainer, textEl, textWidth, descriptionWidth, containerText, textElValue

  items = items || conf.body
  container = container || bodyG
  depth = depth || 1

  if (items === conf.body) bodyPosition = 1

  if (items) each((item, itemIndex) => {
    if (item.hidden !== true) {
      const currentTextGId = `diagrams-box-text-${textGId++}`

      if (isString(item)) {
        item = helpers.generateItem({ text: item })
        items[itemIndex] = item
      }
      item.items = item.items || []

      if (item.items.length > 0) {
        newContainer = container.append('g')
        containerText = d.utils.formatShortDescription(item.text)

        if (item.items && item.items.length > 0) containerText += ':'

        if (item.description) {
          item.fullText = d.utils
            .generateATextDescriptionStr(containerText, item.description)
          containerText += ' (...)'
        } else item.fullText = item.text

        textEl = newContainer.append('text').text(containerText).attr({
          id: currentTextGId,
          x: f.depthWidth * depth,
          y: f.rowHeight * ++bodyPosition,
        })

        addBodyItems({
          bodyPosition, conf, container: newContainer, depth: depth + 1,
          diagram, items: item.items, svg,
        })
      } else {
        if (item.options && item.options.isLink === true) {
          newContainer = container.append('svg:a').attr("xlink:href", item.description)
          textEl = newContainer.append('text')
            .text(d.utils.formatShortDescription(item.text)).attr({
              fill: f.shortDescriptionColor,
              id: currentTextGId,
              x: f.depthWidth * depth,
              y: f.rowHeight * ++bodyPosition,
            })

          item.fullText = `${item.text} (${item.description})`
        } else {
          newContainer = container.append('g').attr({
            id: currentTextGId,
          })
          textEl = newContainer.append('text')
            .text(d.utils.formatShortDescription(item.text)).attr({
              class: 'diagrams-box-definition-text',
              x: f.depthWidth * depth,
              y: f.rowHeight * ++bodyPosition,
            })

          if (item.description) {
            textWidth = textEl[0][0].getBoundingClientRect().width
            descriptionWidth = svg[0][0].getBoundingClientRect().width
              - textWidth - f.depthWidth * depth - 30

            newContainer.append('text')
              .text(`- ${d.utils.formatShortDescription(item.description)}`).attr({
                x: f.depthWidth * depth + textWidth + 5,
                y: f.rowHeight * bodyPosition - 1,
              }).each(d.svg.textEllipsis(descriptionWidth))
          }

          item.fullText = d.utils.generateATextDescriptionStr(item.text, item.description)
        }
      }

      collapseIfNecessary(newContainer, item)
      item.textG = newContainer
      item.textEl = textEl

      if (item.options && item.options.notCompleted === true) {
        item.textG.attr('class', `${(item.textG.attr('class') || '')}`
          + ` diagrams-box-not-completed-block`)
        textElValue = item.textEl.text()
        item.textEl.text('')
        item.textEl.append('tspan').text(`${textElValue} `)
        item.textEl.append('tspan').text('[NOT COMPLETED]')
          .attr('class', 'diagrams-box-not-completed-tag')
      }

      diagram.addMouseListenersToEl(textEl, item)
    }
  }, items)
}

export default ({ boxG, conf, diagram, svg, width }) => {
  return () => {
    const currentScroll = (window.pageYOffset || document.documentElement.scrollTop)
      - (document.documentElement.clientTop || 0)

    svg.attr('height', f.svgInitialNeglectableHeight)

    if (bodyG) bodyG.remove()
    bodyG = boxG.append('g').attr({
      transform: `translate(0, ${f.nameHeight})`,
    })
    const bodyRect = bodyG.append('rect').attr({
      fill: f.bodyRect.fill,
      stroke: f.bodyRect.stroke,
      width,
    }).style({
      filter: 'url(#diagrams-drop-shadow-box)',
    })

    triggerElIdHandler.reset()
    addBodyItems({ bodyG, conf, container: null, depth: null, diagram, items: null, svg })
    diagram.setRelationships(conf.body)
    updateHeigthOfElWithOtherEl(svg, boxG, 50)
    updateHeigthOfElWithOtherEl(bodyRect, boxG, 25 - f.nameHeight)

    window.scrollTo(0, currentScroll)
    diagram.emit('items-rendered')
  }
}
