import calculateLayerWithChildrenDimensions from './calculateLayerWithChildrenDimensions'
import getConfig from "./getConfig"
import handleConnectedToNextCaseIfNecessary from './handleConnectedToNextCaseIfNecessary'

const { each } = _

const generateLayersData = (diagram, layers, currentDepth) => {
  const config = getConfig()
  let maxDepth, itemsDepth

  currentDepth = currentDepth || 1
  maxDepth = currentDepth
  each(layers, (layer, layerIndex) => {
    if (layer.showNumbersAll === true) config.showNumbersAll = true
    layer.depth = currentDepth
    handleConnectedToNextCaseIfNecessary(layers, layerIndex)

    if (layer.items.length > 0) {
      itemsDepth = generateLayersData(diagram, layer.items, (currentDepth + 1))
      layer.maxLayerDepthBelow = itemsDepth - currentDepth
      calculateLayerWithChildrenDimensions(diagram, layer)
      maxDepth = (maxDepth < itemsDepth) ? itemsDepth : maxDepth
    } else {
      layer.maxLayerDepthBelow = 0
      layer.width = 1
      layer.height = 1
      maxDepth = (maxDepth < itemsDepth) ? itemsDepth : maxDepth
    }
    layer.alreadyConnections = []
  })

  return maxDepth
}

export default generateLayersData
