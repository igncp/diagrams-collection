import Grid from './Grid'
import itemsOfLayerShouldBeSorted from './itemsOfLayerShouldBeSorted'

const { each } = _

export default (diagram, layer) => {
  let itemsOfLayer, grid, itemsOfLayerIndex, width, gridSize, itemsShouldBeSorted
  let totalWidth = 0
  let totalHeight = 0
  let maxWidth = 0
  let maxHeight = 0
  let whileCounter = 0
  const itemsArray = []
  const addedItemToGrid = (index) => {
    if (itemsOfLayer[index].inNewRow === true) {
      grid.addItemAtNewRow(itemsOfLayer[index])
      itemsOfLayer.splice(index, 1)

      return true
    } else if (grid.itemFitsAtCurrentPos(itemsOfLayer[index])) {
      grid.addItemAtCurrentPos(itemsOfLayer[index])
      itemsOfLayer.splice(index, 1)

      return true
    } else {
      return false
    }
  }

  each(layer.items, (item) => {
    totalWidth += item.width
    totalHeight += item.height
    maxHeight = (item.height > maxHeight) ? item.height : maxHeight
    maxWidth = (item.width > maxWidth) ? item.width : maxWidth
    itemsArray.push(item)
  })

  if ((totalWidth / 2) >= maxWidth) {
    if (totalHeight > totalWidth) {
      if (totalHeight / 2 < layer.items.length) width = Math.ceil(totalWidth / 2)
      else width = totalWidth
    } else width = Math.ceil(totalWidth / 2)
  } else width = maxWidth

  width = (diagram.maxUnityWidth < width) ? diagram.maxUnityWidth : width

  grid = new Grid(width)

  itemsShouldBeSorted = itemsOfLayerShouldBeSorted(itemsArray)

  if (itemsShouldBeSorted) {
    itemsOfLayer = itemsArray.sort((itemA, itemB) => {
      if (itemA.width === itemB.width) {
        return itemA.height < itemB.height
      } else {
        return itemA.width < itemB.width
      }
    })
  } else itemsOfLayer = itemsArray
  addedItemToGrid(0)
  itemsOfLayerIndex = 0
  while (itemsOfLayer.length > 0 && whileCounter < 1000) {
    if (addedItemToGrid(itemsOfLayerIndex)) {
      itemsOfLayerIndex = 0
    } else {
      if (itemsShouldBeSorted) {
        itemsOfLayerIndex++

        if (itemsOfLayerIndex === itemsOfLayer.length) {
          itemsOfLayerIndex = 0
          grid.movePositionToNextRow()
        }
      } else {
        grid.movePositionToNextRow()
      }
    }
    whileCounter++
  }

  gridSize = grid.getSize()
  // This two values only persist if the layer is a top one
  layer.x = 0
  layer.y = 0
  layer.width = gridSize.width
  layer.height = (layer.items.length > 0) ? gridSize.height + 1 : gridSize.height
}
