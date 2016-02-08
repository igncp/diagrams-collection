import d3, { behavior, layout, select, scale, svg as d3Svg } from "d3"
import _, { each, isUndefined, partial, reduce } from "lodash"

import d from 'diagrams'
import helpers from '../helpers'

const SHY_CONNECTIONS = 'Show connections selectively'
const GRAPH_ZOOM = 'dia graph zoom'
const GRAPH_DRAG = 'Drag nodes on click (may make links difficult)'
const CURVED_ARROWS = 'All arrows are curved'
const graphZoomConfig = {
  private: true,
  type: Number,
  value: 1,
}
const dPositionFn = d.utils.positionFn
const dTextFn = d.utils.textFn

export const getCreationFn = (diagram) => {
  return (creationId, data, conf) => {
    const bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    const svg = d.svg.generateSvg()
    const container = svg.append('g')
    const width = svg.attr('width')
    const dragNodesConfig = diagram.config(GRAPH_DRAG)
    const curvedArrows = diagram.config(CURVED_ARROWS)
    let force, drag, link, linkOuter, node, zoom,
      singleNodeEl, shape, shapeEl, markers, parsedData

    helpers.linksNumberMapHandler().reset()

    const height = d.svg.selectScreenHeightOrHeight(bodyHeight - 250)

    const tick = () => {
      const setPathToLink = (pathClass) => {
        link.select(`path.${pathClass}`).attr("d", (da) => {
          const linksNumber = helpers.getLinksNumberMapItemWithLink(da)
          const linkIndex = da.data.linkIndex
          const dx = da.target.x - da.source.x
          const dy = da.target.y - da.source.y
          const dr = Math.sqrt(dx * dx + dy * dy) * (curvedArrows ? 3.5 : 1)
            * (linkIndex + (curvedArrows ? 1 : 0) / (linksNumber * 3))

          return `M${da.source.x},${da.source.y}A`
            + `${dr},${dr} 0 0,1 `
            + `${da.target.x},${da.target.y}`
        })
      }

      each(['link-path', 'link-path-outer'], setPathToLink)

      node.each((singleNode) => {
        if (singleNode.shape === 'circle') {
          node.select('circle').attr("cx", dPositionFn('x')).attr("cy", dPositionFn('y'))
        } else {
          if (singleNode.shape === 'triangle') shapeEl = node.select('path.triangle')
          else if (singleNode.shape === 'square') shapeEl = node.select('path.square')

          d.utils.applySimpleTransform(shapeEl)
        }
      })
      node.select('text').attr("x", dPositionFn('x')).attr("y", dPositionFn('y', -20))
    }
    const parseData = () => {
      let maxId = reduce(data, (memo, tmpNode) => {
        const id = tmpNode.id || 0

        return (memo > id) ? memo : id
      }, 0)
      const idsMap = {}
      const nodesWithLinkMap = {}
      const colors = scale.category20()
      const handleConnections = (tmpNode, nodeIndex) => {
        if (tmpNode.connections.length > 0) {
          each(tmpNode.connections, (connection) => {
            each(connection.nodesIds, (otherNodeId) => {
              otherNode = idsMap[otherNodeId]

              if (otherNode) {
                if (conf.hideNodesWithoutLinks) {
                  nodesWithLinkMap[otherNode.index] = true
                  nodesWithLinkMap[nodeIndex] = true
                }
                linkObj = {}

                if (connection.direction === 'out') {
                  linkObj.source = nodeIndex
                  linkObj.target = otherNode.index
                } else {
                  linkObj.source = otherNode.index
                  linkObj.target = nodeIndex
                }
                linkObj.data = connection
                linkObj.color = parsedData.nodes[linkObj.source].color
                helpers.updateLinksNumberMapWithLink(linkObj)
                linkObj.data.linkIndex = helpers.getLinksNumberMapItemWithLink(linkObj) - 1

                if (linkObj.data.text) linkObj.data.fullText = linkObj.data.text
                parsedData.links.push(linkObj)
              }
            })
          })
        }
      }
      let nodeId, color, options, otherNode, linkObj

      parsedData = {
        links: [],
        nodes: [],
      }
      markers = []
      each(data, (dataNode, nodeIndex) => {
        nodeId = isUndefined(dataNode.id) ? maxId++ : dataNode.id
        color = colors(nodeIndex)
        options = dataNode.options || {}
        parsedData.nodes.push({
          bold: options.bold || false,
          color,
          connections: dataNode.connections || [],
          description: dataNode.description || null,
          id: nodeId,
          linkToUrl: options.linkToUrl || null,
          name: dataNode.name,
          shape: options.shape || 'circle',
        })
        idsMap[nodeId] = {
          index: nodeIndex,
        }
        idsMap[nodeId].color = color
        markers.push({
          color,
          id: nodeId,
        })

      })

      diagram.config(conf)

      if (conf.info) helpers.addDiagramInfo(diagram, svg, conf.info)

      each(parsedData.nodes, handleConnections)

      if (conf.hideNodesWithoutLinks === true) {
        each(parsedData.nodes, (pdNode, nodeIndex) => {
          if (nodesWithLinkMap[nodeIndex] !== true) pdNode.hidden = true
        })
      }
    }

    const zoomed = (translate, zoomScale) => {
      zoomScale = zoomScale || 1
      container.attr("transform", `translate(${translate})scale(${zoomScale})`)
      graphZoomConfig.value = zoomScale
      diagram.config(GRAPH_ZOOM, graphZoomConfig)
    }

    const dragstarted = function() {
      d3.event.sourceEvent.stopPropagation()
      select(this).classed("dragging", true)
      force.start()
    }

    const dragged = function(da) {
      select(this).attr("cx", da.x = d3.event.x).attr("cy", da.y = d3.event.y)
    }

    const dragended = function() {
      select(this).classed("dragging", false)
    }

    const setRelationships = () => {
      each(parsedData.nodes, diagram.generateEmptyRelationships, diagram)
      each(parsedData.nodes, (pdNode) => {
        diagram.addSelfRelationship(pdNode, pdNode.shapeEl, pdNode)
      })
      each(parsedData.links, (pdLink) => {
        diagram.addDependencyRelationship(pdLink.source, pdLink.target.shapeEl, pdLink.target)
        diagram.addDependantRelationship(pdLink.target, pdLink.source.shapeEl, pdLink.source)
      })
    }

    const getAllLinks = () => container.selectAll(".link")

    const getLinksWithIsHiding = () =>
      getAllLinks().filter((da) => da.data.hasOwnProperty('shyIsHiding'))

    const setLinkIsHidingIfNecessary = (isHiding, tmpLink) => {
      let linksWithIsHiding

      if (diagram.config(SHY_CONNECTIONS)) {
        if (isHiding === false) tmpLink.data.shyIsHiding = isHiding
        else if (isHiding === true) {
          linksWithIsHiding = getLinksWithIsHiding()
          linksWithIsHiding.each((da) => {
            da.data.shyIsHiding = true
          })
        }
        tmpLink.data.shyIsHidingChanged = true
      }
    }

    const setDisplayOfShyConnections = (display, tmpNode) => {
      const isShowing = display === 'show'
      const isHiding = display === 'hide'
      const nodeData = tmpNode.data
      const linksWithIsHiding = getLinksWithIsHiding()
      const nodeLinks = getAllLinks().filter((da) => {
        return da.source.id === nodeData.id || da.target.id === nodeData.id
      })
      const setDisplay = (links, show) => {
        links.classed('shy-link-hidden', !show)
        links.classed('shy-link-showed', show)
      }
      const hideLinks = (links) => {
        setDisplay(links, false)
        links.each((da) => {
          delete da.data.shyIsHiding
        })
      }
      const futureConditionalHide = () => {
        setTimeout(() => {
          allAreHiding = true
          shyIsHidingIsSame = true
          nodeLinks.each((da) => {
            allAreHiding = allAreHiding && da.data.shyIsHiding

            if (da.data.shyIsHidingChanged) {
              shyIsHidingIsSame = false
              delete da.data.shyIsHidingChanged
            }
          })

          if (allAreHiding && shyIsHidingIsSame) hideLinks(nodeLinks)
          else futureConditionalHide()
        }, 500)
      }
      let allAreHiding, shyIsHidingIsSame

      if (linksWithIsHiding[0].length === 0) {
        if (isShowing) setDisplay(nodeLinks, true)
        else if (isHiding) {
          nodeLinks.each((da) => {
            da.data.shyIsHiding = true
          })
          futureConditionalHide()
        }
      } else {
        if (isShowing) {
          linksWithIsHiding.each((da, index) => {
            if (index === 0) da.data.shyIsHiding = false
          })
        } else if (isHiding) setLinkIsHidingIfNecessary(true, linksWithIsHiding.data()[0])
      }
    }

    const setReRender = partial(helpers.setReRender, diagram, creationId, data, _)

    diagram.markRelatedFn = (item) => {
      const prevClass = item.el.attr("class")

      item.el.attr("class", `${prevClass} marked`)
    }
    diagram.unmarkAllItems = () => {
      each(parsedData.nodes, (pdNode) => {
        const prevClass = pdNode.shapeEl.attr("class")

        pdNode.shapeEl.attr('class', prevClass ? prevClass.replace(/ marked/gm, "") : "")
      })
    }

    conf = conf || {}
    parseData()

    svg.attr({
      class: 'graph-diagram',
      height,
    })

    zoom = behavior.zoom().scaleExtent([0.1, 10]).on("zoom", () => {
      zoomed(d3.event.translate, d3.event.scale)
    })

    svg.call(zoom)

    zoom.translate([100, 100])
      .scale(diagram.config(GRAPH_ZOOM).value)

    zoomed(zoom.translate(), zoom.scale())

    force = layout.force()
      .size([width, height])
      .charge(conf.charge || -10000)
      .linkDistance(conf.linkDistance || 140)
      .on("tick", tick)

    drag = behavior.drag().origin(da => da)
      .on("dragstart", dragstarted).on("drag", dragged).on("dragend", dragended)

    force.nodes(parsedData.nodes).links(parsedData.links).start()

    container.append("svg:defs").selectAll("marker")
      .data(markers)
      .enter().append("svg:marker")
      .attr({
        class: 'arrow-head',
        fill: dTextFn('color'),
        id: dTextFn('id', 'arrow-head-'),
        markerHeight: 8,
        markerWidth: 8,
        orient: 'auto',
        refX: 19,
        refY: curvedArrows ? -1.5 : 0,
        viewBox: '0 -5 10 10',
      }).append("svg:path").attr("d", "M0,-5L10,0L0,5")

    link = container.selectAll(".link").data(parsedData.links).enter().append('g')
      .attr("class", () => {
        let finalClass = 'link'

        if (diagram.config(SHY_CONNECTIONS)) finalClass += ' shy-link shy-link-hidden'

        return finalClass
      })
    link.append("svg:path").attr({
      class: 'link-path',
      'marker-end': da => `url(#arrow-head-${da.source.id})`,
    }).style({
      stroke: dTextFn('color'),
      'stroke-dasharray': (da) => {
        if (da.data.line === 'plain') return null
        else if (da.data.line === 'dotted') return '5,5'
        else if (da.data.line === 'morse') return '20,10,5,5,5,10'
      },
    })

    linkOuter = link.append('g')
    linkOuter.append('svg:path').attr('class', 'link-path-outer')
    linkOuter.each(function(da) {
      diagram.addMouseListenersToEl(select(this), da.data, {
        mouseenter(eLink) {
          setLinkIsHidingIfNecessary(false, eLink)
        },
        mouseleave(eLink) {
          setLinkIsHidingIfNecessary(true, eLink)
        },
      })
    })

    node = container.selectAll(".node").data(parsedData.nodes).enter().append('g').attr({
      class(da) {
        let finalClass = 'node'

        if (da.hidden === true) finalClass += ' node-hidden'

        return finalClass
      },
      id: dTextFn('id', 'node-'),
    })

    node.each(function(singleNode) {
      let singleNodeClasses = ''

      singleNodeEl = select(this)
      singleNode.fullText = d.utils
        .generateATextDescriptionStr(singleNode.name, singleNode.description)

      if (singleNode.shape === 'circle') {
        shapeEl = singleNodeEl.append("circle").attr({
          fill: dTextFn('color'),
          r: 12,
        })
      } else {
        shape = d3Svg.symbol().size(750)
        shapeEl = singleNodeEl.append("path")

        if (singleNode.shape === 'triangle') {
          shape = shape.type('triangle-up')
          singleNodeClasses += ' triangle'
        } else if (singleNode.shape === 'square') {
          shape = shape.type('square')
          singleNodeClasses += ' square'
        }
        shapeEl = shapeEl.attr({
          d: shape,
          fill: dTextFn('color'),
        })
        d.utils.applySimpleTransform(shapeEl)
      }

      if (dragNodesConfig === true) shapeEl.call(drag)

      if (singleNode.bold === true) singleNodeClasses += ' bold'
      else singleNodeClasses += ' thin'
      shapeEl.attr('class', singleNodeClasses)

      singleNode.shapeEl = shapeEl
      diagram.addMouseListenersToEl(shapeEl, singleNode, {
        click(eNode) {
          if (eNode.data.linkToUrl) window.open(eNode.data.linkToUrl)
        },
        mouseenter(nodeData) {
          if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('show', nodeData)
        },
        mouseleave(nodeData) {
          if (diagram.config(SHY_CONNECTIONS)) setDisplayOfShyConnections('hide', nodeData)
        },
      })
    })

    node.append("text").text(dTextFn('name'))

    setRelationships()
    setReRender(conf)
    diagram.listen('configuration-changed', (config) => {
      if (config.key === SHY_CONNECTIONS || config.key === GRAPH_DRAG) {
        setReRender(config)
        diagram.removePreviousAndCreate(creationId, data, config)
      }
    })
  }
}
