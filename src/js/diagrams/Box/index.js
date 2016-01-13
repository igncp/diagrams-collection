import d from 'diagrams'
import helpers from './helpers'

const { defer, each, isNull, isString, isUndefined } = _

let textGId = 0
let triggerElId = 0
let bodyG

const fixedValues = {
  depthWidth: 35,
  nameHeight: 50,
  rowHeight: 30,
}

const collapseIfNecessary = (el, item) => {
  if (item.items.length > 0 || item.collapsedItems) {
    const textEl = el.select('text')
    const yDim = textEl.attr('y')
    const xDim = textEl.attr('x')
    const triggerEl = el.append('g').attr({
      class: 'collapsible-trigger',
    })
    const collapseListener = () => {
      helpers.collapseItem(item)
      helpers.addBodyItemsAndUpdateHeights.get()()
    }
    const expandListener = () => {
      helpers.expandItem(item)
      helpers.addBodyItemsAndUpdateHeights.get()()
    }
    const triggerTextEl = triggerEl.append('text').attr({
      x: Number(xDim) - 20,
      y: Number(yDim) + 5,
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

    triggerElId += 1
    clipPathId = `clippath-${triggerElId}`
    triggerEl.append('clipPath').attr('id', clipPathId).append('rect').attr({
      height: 15,
      width: 20,
      x: xDim - 20,
      y: yDim - 17,
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

const scrollToTarget = (target, conf) => {
  let targetFound = null
  const recursiveFindTarget = (items) => {
    each(items, (item) => {
      if (isNull(targetFound)) {
        if (isString(item.text) && item.text.indexOf(target) > -1) targetFound = item
        else if (item.items) recursiveFindTarget(item.items)
      }
    })
  }
  let currentScroll, scrollElTop

  recursiveFindTarget(conf.body)

  if (targetFound) {
    currentScroll = (window.pageYOffset || document.documentElement.scrollTop)
      - (document.documentElement.clientTop || 0)
    scrollElTop = targetFound.textG[0][0].getBoundingClientRect().top
    defer(() => {
      window.scrollTo(0, scrollElTop + currentScroll)
    })
  }
  console.log("targetFound", targetFound)
}

let bodyPosition

const addBodyItems = ({
  conf, container, depth, diagram, items, svg,
}) => {
  let newContainer, textEl, textWidth, descriptionWidth, containerText, textElValue

  items = items || conf.body
  container = container || bodyG
  depth = depth || 1

  if (items === conf.body) bodyPosition = 1

  each(items, (item, itemIndex) => {
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
          x: fixedValues.depthWidth * depth,
          y: fixedValues.rowHeight * ++bodyPosition,
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
              fill: '#3962B8',
              id: currentTextGId,
              x: fixedValues.depthWidth * depth,
              y: fixedValues.rowHeight * ++bodyPosition,
            })

          item.fullText = `${item.text} (${item.description})`
        } else {
          newContainer = container.append('g').attr({
            id: currentTextGId,
          })
          textEl = newContainer.append('text')
            .text(d.utils.formatShortDescription(item.text)).attr({
              class: 'diagrams-box-definition-text',
              x: fixedValues.depthWidth * depth,
              y: fixedValues.rowHeight * ++bodyPosition,
            })

          if (item.description) {
            textWidth = textEl[0][0].getBoundingClientRect().width
            descriptionWidth = svg[0][0].getBoundingClientRect().width
              - textWidth - fixedValues.depthWidth * depth - 30

            newContainer.append('text')
              .text(`- ${d.utils.formatShortDescription(item.description)}`).attr({
                x: fixedValues.depthWidth * depth + textWidth + 5,
                y: fixedValues.rowHeight * bodyPosition - 1,
              }).each(d.svg.textEllipsis(descriptionWidth))
          }

          item.fullText = d.utils.generateATextDescriptionStr(item.text, item.description)
        }
      }

      collapseIfNecessary(newContainer, item)
      item.textG = newContainer
      item.textEl = textEl

      if (item.options.notCompleted === true) {
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
  })
}

const getAddBodyItemsFn = ({ boxG, conf, diagram, svg, width }) => {
  return () => {
    const currentScroll = (window.pageYOffset || document.documentElement.scrollTop)
      - (document.documentElement.clientTop || 0)

    svg.attr('height', 10)

    if (bodyG) bodyG.remove()
    bodyG = boxG.append('g').attr({
      transform: `translate(0, ${fixedValues.nameHeight})`,
    })
    const bodyRect = bodyG.append('rect').attr({
      fill: '#fff',
      stroke: '#000',
      width,
    }).style({
      filter: 'url(#diagrams-drop-shadow-box)',
    })

    triggerElId = 0
    addBodyItems({ bodyG, conf, container: null, depth: null, diagram, items: null, svg })
    diagram.setRelationships(conf.body)
    d.svg.updateHeigthOfElWithOtherEl(svg, boxG, 50)
    d.svg.updateHeigthOfElWithOtherEl(bodyRect, boxG, 25 - fixedValues.nameHeight)

    window.scrollTo(0, currentScroll)
    diagram.emit('items-rendered')
  }
}

class Box extends d.Diagram {
  create(creationId, conf, opts) {
    const diagram = this
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
      height: fixedValues.nameHeight,
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

    d3.select(document.body).style('opacity', 0)
    helpers.addBodyItemsAndUpdateHeights.get()()

    if (opts.allCollapsed === true) helpers.collapseAll(creationId)
    helpers.addButtons(creationId)
    d3.select(document.body).style('opacity', 1)

    if (urlParams.target) scrollToTarget(urlParams.target, conf)
  }

  setRelationships(items, container) {
    const diagram = this

    each(items, (item) => {
      diagram.generateEmptyRelationships(item)

      if (container) {
        diagram.addDependantRelationship(container, item.textG, item)
        diagram.addDependencyRelationship(item, container.textG, container)
      }

      if (item.items && item.items.length > 0) diagram.setRelationships(item.items, item)
    })
  }
}

export default () => {
  new Box({
    helpers,
    name: 'box',
  })
}
