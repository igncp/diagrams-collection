import { isObject } from "lodash"

import idsHandler from "./idsHandler"

export default (layers, currentIndex) => {
  const layer = layers[currentIndex]
  const nextLayer = layers[currentIndex + 1]
  let connectedTo, newId

  if (layer.hasOwnProperty('connectedWithNext') === true && nextLayer) {
    if (nextLayer.id) newId = nextLayer.id
    else {
      newId = `to-next-${String(idsHandler.increase())}`
      nextLayer.id = newId
    }

    if (isObject(layer.connectedWithNext) && layer.connectedWithNext.type) {
      connectedTo = {
        id: newId,
        type: layer.connectedWithNext.type,
      }
    } else connectedTo = newId

    if (layer.connectedTo) layer.connectedTo.push(connectedTo)
    else layer.connectedTo = [connectedTo]
  }
}
