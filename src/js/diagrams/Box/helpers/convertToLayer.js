import { each, isString } from "lodash"
import { select, selectAll } from "d3"

import d from "diagrams"

const convertDataToLayers = (items) => {
  each(items, (item, index) => {
    if (isString(item)) {
      item = items[index] = {
        text: item,
      }
    }

    if (item.description) item.text += `: ${item.description}`

    if (item.items) convertDataToLayers(item.items)
    else item.items = []
  })
}

const createLayers = (layersData) => {
  const svg = select('svg')

  selectAll('input.diagrams-diagram-button').remove()

  svg.remove()
  d.layer(layersData)
}

export default (origConf) => {
  const layersData = []

  layersData.push({
    items: origConf.body,
    text: origConf.name,
  })
  convertDataToLayers(layersData[0].items)
  createLayers(layersData)
}
