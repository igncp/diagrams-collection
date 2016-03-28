import { each } from "../../../utils/pure"

import calculateLayerWithChildrenDimensions from './calculateLayerWithChildrenDimensions'
import getConfigHandler from "./getConfigHandler"
import handleConnectedToNextCaseIfNecessary from './handleConnectedToNextCaseIfNecessary'

const generateLayersData = (diagram, layers, currentDepth) => {
  const config = getConfigHandler().get()
  let maxDepth, itemsDepth

  currentDepth = currentDepth || 1
  maxDepth = currentDepth
  each((layer, layerIndex) => {
    if (layer.showNumbersAll === true) config.showNumbersAll = true
    layer.depth = currentDepth
    handleConnectedToNextCaseIfNecessary(layers, layerIndex)

    if (layer.items.length > 0) {
      itemsDepth = generateLayersData(diagram, layer.items, (currentDepth + 1))
      calculateLayerWithChildrenDimensions(diagram, layer)
      maxDepth = (maxDepth < itemsDepth) ? itemsDepth : maxDepth
    } else {
      layer.width = 1
      layer.height = 1
      maxDepth = (maxDepth < itemsDepth) ? itemsDepth : maxDepth
    }
    layer.connectionsAlreadyProcessed = []
  }, layers)

  return maxDepth
}

export default generateLayersData
