import idsHandler from "./idsHandler"

const isObject = vr => typeof(vr) === "object" && vr !== null
const hasDifferentType = layer => isObject(layer.connectedWithNext) && layer.connectedWithNext.type

function getConnectedToArr(layer, id) {
  return (hasDifferentType(layer))
    ? [{ id, type: layer.connectedWithNext.type }]
    : [id]
}

function setConnectedToOfLayer(layer, connectedTo) {
  layer.connectedTo = (layer.connectedTo)
    ? layer.connectedTo.concat(connectedTo)
    : connectedTo
}

export default (layers, currentIndex) => {
  const layer = layers[currentIndex]
  const nextLayer = layers[currentIndex + 1]

  if (layer.connectedWithNext && nextLayer) {
    if (!nextLayer.id) {
      nextLayer.id = `to-next-${String(idsHandler.increase())}`
    }
    const connectedTo = getConnectedToArr(layer, nextLayer.id)

    setConnectedToOfLayer(layer, connectedTo)
  }
}
