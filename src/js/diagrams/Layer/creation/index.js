import { svg as d3Svg } from "d3"
import { chain, each, isArray, isObject, isUndefined, max, where } from "lodash"

import d from 'diagrams'
import shapes from "../../../shapes"

import helpers from '../helpers'
import { defaultConnectionType } from "../constants"

let layerGId = 0
const dTextFn = d.utils.textFn

const addItemsPropToBottomItems = (layers) => {
  each(layers, (layer) => {
    if (layer.hasOwnProperty('items') === false) {
      layer.items = []
    } else addItemsPropToBottomItems(layer.items)
  })
}

export const getCreationFn = (diagram) => {
  return (creationId, conf) => {
    const configHandler = helpers.getConfigHandler()

    configHandler.setDefault()
    const config = configHandler.get()
    const colors = ['#ECD078', '#D95B43', '#C02942', '#78E4B7',
      '#53777A', '#00A8C6', '#AEE239', '#FAAE8A']
    const calculateTheMostOptimalConnection = (layerA, layerBObj) => {
      // There are 12 possible: 4 sides to 3 each
      const getTopSidePos = (layer) => {
        return {
          x: (layer.x + layer.width / 2) * config.widthSize
            + config.depthWidthFactor * layer.depth,
          y: layer.y * config.heightSize + config.depthHeightFactor * layer.depth,
        }
      }
      const getBottomSidePos = (layer) => {
        return {
          x: (layer.x + layer.width / 2) * config.widthSize
            + config.depthWidthFactor * layer.depth,
          y: (layer.y + layer.height) * config.heightSize
            - config.depthHeightFactor * layer.depth,
        }
      }
      const getLeftSidePos = (layer) => {
        return {
          x: layer.x * config.widthSize + config.depthWidthFactor * layer.depth,
          y: (layer.y + layer.height / 2) * config.heightSize
            + config.depthHeightFactor * layer.depth,
        }
      }
      const getRightSidePos = (layer) => {
        return {
          x: (layer.x + layer.width) * config.widthSize - config.depthWidthFactor * layer.depth,
          y: (layer.y + layer.height / 2) * config.heightSize
            + config.depthHeightFactor * layer.depth,
        }
      }
      const getSidesPos = (layer) => {
        return {
          bottom: getBottomSidePos(layer),
          left: getLeftSidePos(layer),
          right: getRightSidePos(layer),
          top: getTopSidePos(layer),
        }
      }
      const distance = {
        val: Infinity,
      }
      const doesNotCrossAnyOfTwoLayers = ({ posA, posB, sideA, sideB }) => {
        if ((sideA === 'bottom' || sideA === 'left'
          || sideA === 'top') && sideB === 'right') {
          if (posA.x < posB.x) return false
        } else if ((sideA === 'bottom' || sideA === 'right'
          || sideA === 'top') && sideB === 'left') {
          if (posA.x > posB.x) return false
        } else if ((sideA === 'bottom' || sideA === 'right'
          || sideA === 'left') && sideB === 'top') {
          if (posA.y > posB.y) return false
        } else if ((sideA === 'left' || sideA === 'right'
          || sideA === 'top') && sideB === 'bottom') {
          if (posA.y < posB.y) return false
        }

        return true
      }
      const calcDistanceAndUpdate = (posA, posB) => {
        const e2 = (num) => {
          return Math.pow(num, 2)
        }
        const newDistance = Math.sqrt(e2(posA.x - posB.x) + e2(posA.y - posB.y))

        if (newDistance < distance.val) {
          distance.val = newDistance
          distance.from = posA
          distance.to = posB

          return true
        } else {
          return false
        }
      }
      const eachSide = (cb) => {
        each(['top', 'bottom', 'left', 'right'], (side) => {
          cb(side)
        })
      }
      const sameTypeOfSides = (sideA, sideB) => {
        let result = false

        each([
          [sideA, sideB],
          [sideB, sideA],
        ], (sides) => {
          if (sides[0] === 'top' && sides[1] === 'bottom') result = true
          else if (sides[0] === 'left' && sides[1] === 'right') result = true
        })

        return result
      }
      const loopSidesToGetConnection = (sameTypeOfSidesCondition) => {
        eachSide((sideA) => {
          eachSide((sideB) => {
            if (isUndefined(layerB.connectionsAlreadyProcessed)) {
              layerB.connectionsAlreadyProcessed = []
            }

            if (sideA !== sideB && layerA.connectionsAlreadyProcessed.indexOf(sideA) < 0
              && layerB.connectionsAlreadyProcessed.indexOf(sideB) < 0) {
              if ((sameTypeOfSidesCondition === false && sameTypeOfSides(sideA, sideB) === false)
                || sameTypeOfSides(sideA, sideB)) {
                if (doesNotCrossAnyOfTwoLayers({ posA: layerAPos[sideA],
                    posB: layerBPos[sideB], sideA, sideB })) {
                  changed = calcDistanceAndUpdate(layerAPos[sideA], layerBPos[sideB])

                  if (changed === true) {
                    distance.sideA = sideA
                    distance.sideB = sideB
                  }
                }
              }
            }
          })
        })
      }
      const layerB = layerBObj.layer
      const layerAPos = getSidesPos(layerA)
      const layerBPos = getSidesPos(layerB)
      let changed

      loopSidesToGetConnection(true)

      if (changed !== true) loopSidesToGetConnection(false)

      layerA.connectionsAlreadyProcessed.push(distance.sideA)
      layerB.connectionsAlreadyProcessed.push(distance.sideB)

      return distance
    }
    const drawConnection = (connection) => {
      const container = connection.layer.container
      const containerData = connection.layer.containerData
      let connectionG, connectionId, connectionCoords, linkLine, connectionPath

      each(connection.connectedTo, (connectedToLayer) => {
        connectionCoords = calculateTheMostOptimalConnection(connection.layer, connectedToLayer)
        linkLine = d3Svg.line().x(dTextFn('x')).y(dTextFn('y'))
        connectionId = `${connection.layer.id}-${connectedToLayer.layer.id}`
        connectionG = container.append('g').attr('id', connectionId)

        if (connectionCoords.from && connectionCoords.to) {
          connectionPath = connectionG.append('path')
            .attr('d', linkLine([connectionCoords.from, connectionCoords.to]))
            .style({
              fill: 'none',
              stroke: '#000',
            })

          if (connectedToLayer.type === 'dashed')
            connectionPath.style('stroke-dasharray', '5, 5')

          connectionG.append("circle").attr({
            cx: connectionCoords.to.x,
            cy: connectionCoords.to.y,
            fill: colors[connection.layer.depth - 1],
            r: 5,
          }).style({
            stroke: '#000',
          })

          containerData.connections = containerData.connections || []
          containerData.connections.push({
            el: connectionG,
            id: connectionId,
          })
        }
      })
    }
    const drawConnectionsIfAny = (layers) => {
      layers = layers || conf

      chain(layers).filter((layer) => {
        return layer.hasOwnProperty('connectedTo')
      }).map((layer) => {
        const layersConnectedTo = []
        let layerConnectedObj, layerConnectedId, layerConnectedType

        each(layer.connectedTo, (layerConnected) => {
          layerConnectedId = isObject(layerConnected) ? layerConnected.id : layerConnected
          layerConnectedType = isObject(layerConnected) && layerConnected.type
            ? layerConnected.type : defaultConnectionType

          layerConnectedObj = where(layers, {
            id: layerConnectedId,
          })[0]

          layersConnectedTo.push({
            layer: layerConnectedObj,
            type: layerConnectedType,
          })
        })

        return {
          connectedTo: layersConnectedTo,
          layer,
        }
      }).each((connection) => {
        drawConnection(connection)
      }).value()

      chain(layers).filter((layer) => {
        return layer.items.length > 0
      }).each((layer) => {
        drawConnectionsIfAny(layer.items)
      }).value()
    }
    const updateSvgHeight = () => {
      const getBottomPointOfLayer = (layer) => {
        return layer.y + layer.height
      }
      const bottomLayer = max(conf, getBottomPointOfLayer)
      const bottomPoint = getBottomPointOfLayer(bottomLayer)
      const bottomPointPxs = bottomPoint * config.heightSize + 20

      svg.attr('height', bottomPointPxs)
    }
    const calcMaxUnityWidth = () => {
      const bodyWidth = document.body.getBoundingClientRect().width

      diagram.maxUnityWidth = Math.floor(bodyWidth / config.widthSize)
    }
    const drawLayersInContainer = function(layers, container, containerData) {
      const widthSize = config.widthSize
      const heightSize = config.heightSize
      let layerG, layerNode, layerDims, layerText

      layers = layers || conf
      container = container || svg

      each(layers, (layer, layerIndex) => {
        const currentLayerId = `diagrams-layer-g-${layerGId++}`
        let numberG

        layerG = container.append('g').attr({
          class: 'layer-node',
          id: currentLayerId,
          transform: `translate(${layer.x * widthSize}, ${layer.y * heightSize})`,
        })

        layer.layerG = layerG
        layer.container = container
        layer.containerData = containerData

        layerDims = helpers.getFinalLayerDimensions(layer)
        layerNode = layerG.append('g')

        if (layer.conditional === true) {
          layerNode.append('path').attr({
            d: shapes.hexagon({
              height: layerDims.height,
              width: layerDims.width,
              widthPercent: 97 + Math.abs(3 - layer.depth),
            }),
            fill: layerDims.fill,
            stroke: '#f00',
            transform: layerDims.transform,
          })
        } else {
          layerNode.append('rect').attr({
            fill: layerDims.fill,
            height: layerDims.height,
            transform: layerDims.transform,
            width: layerDims.width,
          }).style({
            filter: 'url(#diagrams-drop-shadow-layer)',
          })
        }

        layerText = layerNode.append('text').attr({
          transform: layerDims.transform,
          x: layer.depth,
          y: layer.height * heightSize - 3 * layer.depth - 10,
        }).text(() => {
          return d.utils.formatShortDescription(layer.text)
        })

        layer.fullText = layer.text
        // Missing to add show all layers connections and hide
        diagram.addMouseListenersToEl(layerNode, layer)
        layerText.each(d.svg.textEllipsis(layer.width * widthSize
          - config.depthWidthFactor * layer.depth * 2))

        if (layerDims.numberTransform) {
          numberG = layerNode.append('g').attr({
            class: 'number',
            transform: layerDims.numberTransform,
          })
          numberG.append('circle').attr({
            cx: 4,
            cy: -4,
            fill: colors[layer.depth - 1],
            filter: 'none',
            r: 10,
            stroke: '#000',
            'stroke-width': 2,
          })
          numberG.append('text').text(layerIndex + 1)
            .attr('fill', '#000')
        }

        if (layer.items.length > 0) {
          drawLayersInContainer(layer.items, layerG, layer)
        }
      })
    }
    const svg = d.svg.generateSvg({
      margin: '20px 0 0 20px',
    })

    diagram.markRelatedFn = function(item) {
      item.data.origFill = item.data.origFill || item.el.select('rect').style('fill')
      item.el.select('rect').style({
        fill: 'rgb(254, 255, 209)',
      })
    }
    diagram.unmarkAllItems = function() {
      const recursiveFn = (items) => {
        each(items, (item) => {
          item.layerG.style({
            'stroke-width': '1px',
          })

          if (item.origFill) {
            item.layerG.select('rect').style('fill', item.origFill)
          }

          if (item.items) recursiveFn(item.items)
        })
      }

      recursiveFn(conf)
    }

    each(colors, (color, index) => {
      d.svg.addVerticalGradientFilter(svg, `color-${index}`, ['#fff', color])
    })

    svg.attr('class', 'layers-diagram')

    if (isArray(conf) === false) conf = [conf]
    d.svg.addFilterColor({ container: svg, deviation: 3, id: 'layer', slope: 2 })

    addItemsPropToBottomItems(conf)
    calcMaxUnityWidth()
    helpers.generateLayersData(diagram, conf)
    drawLayersInContainer()
    drawConnectionsIfAny()
    updateSvgHeight()
    diagram.generateRelationships(conf)
  }
}
