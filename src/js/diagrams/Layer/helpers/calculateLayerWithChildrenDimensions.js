import { reduce } from "ramda"

import Grid from './Grid'
import shouldItemsOfLayerBeSorted from './shouldItemsOfLayerBeSorted'

const generateState = (layer) => {
  const initialState = {
    itemsArray: [],
    itemsOfLayerIndex: 0,
    maxHeight: 0,
    maxWidth: 0,
    totalHeight: 0,
    totalWidth: 0,
    whileCounter: 0,
  }

  return reduce((state, item) => {
    state.totalWidth += item.width
    state.totalHeight += item.height
    state.maxHeight = (item.height > state.maxHeight) ? item.height : state.maxHeight
    state.maxWidth = (item.width > state.maxWidth) ? item.width : state.maxWidth
    state.itemsArray.push(item)
    return state
  }, initialState, layer.items)
}

const wasItemAddedToGrid = (index, { grid, itemsOfLayer }, state) => {
  if (itemsOfLayer[index].inNewRow === true) {
    grid.addItemAtNewRow(itemsOfLayer[index])
    itemsOfLayer.splice(index, 1)
    state.itemsOfLayerIndex = 0

    return true
  } else if (grid.itemFitsAtCurrentPos(itemsOfLayer[index])) {
    grid.addItemAtCurrentPos(itemsOfLayer[index])
    itemsOfLayer.splice(index, 1)
    state.itemsOfLayerIndex = 0

    return true
  } else {
    return false
  }
}

const mutateLayer = (layer, gridSize) => {
  // This two values only persist if the layer is a top one
  layer.x = 0
  layer.y = 0
  layer.width = gridSize.width
  layer.height = (layer.items.length > 0) ? gridSize.height + 1 : gridSize.height
}

const getRawGridWidth = ({ layer, maxWidth, totalHeight, totalWidth }) => {
  if ((totalWidth / 2) >= maxWidth) {
    if (totalHeight > totalWidth) {
      if (totalHeight / 2 < layer.items.length) return Math.ceil(totalWidth / 2)
      else {
        return totalWidth
      }
    } else {
      return Math.ceil(totalWidth / 2)
    }
  } else {
    return maxWidth
  }
}

const getGridWidth = (diagram, layer, { maxWidth, totalHeight, totalWidth }) => {
  const rawGridWidth = getRawGridWidth({ layer, maxWidth, totalHeight, totalWidth })

  return (diagram.maxUnityWidth < rawGridWidth) ? diagram.maxUnityWidth : rawGridWidth
}

const getItemsOfLayer = (itemsShouldBeSorted, { itemsArray }) => {
  if (itemsShouldBeSorted) {
    return itemsArray.sort((itemA, itemB) => {
      if (itemA.width === itemB.width) {
        return itemA.height < itemB.height
      } else {
        return itemA.width < itemB.width
      }
    })
  } else {
    return itemsArray
  }
}

const populateGridUsingState = (grid, state) => {
  const itemsOfLayer = getItemsOfLayer(itemsShouldBeSorted, state)
  const itemsShouldBeSorted = shouldItemsOfLayerBeSorted(state.itemsArray)

  wasItemAddedToGrid(0, { grid, itemsOfLayer }, state)
  while (itemsOfLayer.length > 0 && state.whileCounter < 1000) {
    if (!wasItemAddedToGrid(state.itemsOfLayerIndex, { grid, itemsOfLayer }, state)) {
      if (itemsShouldBeSorted) {
        state.itemsOfLayerIndex++

        if (state.itemsOfLayerIndex === itemsOfLayer.length) {
          state.itemsOfLayerIndex = 0
          grid.movePositionToNextRow()
        }
      } else {
        grid.movePositionToNextRow()
      }
    }
    state.whileCounter++
  }
}

export default (diagram, layer) => {
  const state = generateState(layer)
  const gridWidth = getGridWidth(diagram, layer, state)
  const grid = new Grid(gridWidth)

  populateGridUsingState(grid, state)
  mutateLayer(layer, grid.getSize())
}
