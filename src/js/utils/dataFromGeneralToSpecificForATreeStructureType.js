// FPN: Find Parent Node

import { curry, filter, find, forEach, map, omit, merge, isEmpty, propEq } from "ramda"

const isUndefined = val => typeof val === "undefined"

function mergeGraphsData(item, transformedData, toDiagramName) {
  if (!item.graphsData) return transformedData

  const newGraphsData = omit(toDiagramName, item.graphsData)

  if (!isEmpty(newGraphsData)) transformedData.graphsData = newGraphsData

  return merge(transformedData, item.graphsData[toDiagramName] || {})
}

const buildNodesDataRecursiveFn = ({
  generalDataConnections, item, itemsIdToItemsMap, toDiagramName,
}) => {
  const transformedData = {}

  transformedData.id = item.id

  if (item.description) transformedData.text += `${item.name}: ${item.description}`
  else transformedData.text = item.name

  const children = filter(propEq("to", item.id), generalDataConnections)

  if (children.length > 0) {
    transformedData.items = map((child) => buildNodesDataRecursiveFn({
      generalDataConnections,
      item: itemsIdToItemsMap[child.from],
      itemsIdToItemsMap, toDiagramName,
    }), children)
  }

  return mergeGraphsData(item, transformedData, toDiagramName)
}

const findParentNode = (generalData) => {
  let parentNode, itemsChecked
  let FPNRecursiveFailed = false
  const itemsIdToItemsMap = {}
  const itemsIdToFromConnectionMap = {}

  function FPNRecursiveFn(item) {
    let connection, parentItemId, parentItem

    if (itemsChecked.indexOf(item) > -1) {
      FPNRecursiveFailed = true

      return
    } else itemsChecked.push(item)

    if (isUndefined(itemsIdToFromConnectionMap[item.id]) === false) {
      connection = itemsIdToFromConnectionMap[item.id]
    } else {
      connection = filter(propEq("from", item.id))(generalData.connections)
      itemsIdToFromConnectionMap[item.id] = connection
    }

    if (connection.length === 0) {
      if (parentNode) {
        if (parentNode.id !== item.id) FPNRecursiveFailed = true
      } else parentNode = item
    } else if (connection.length === 1) {
      parentItemId = connection[0].to

      if (isUndefined(itemsIdToItemsMap[parentItemId]) === false) {
        parentItem = itemsIdToItemsMap[parentItemId]
      } else {
        parentItem = find(propEq("id", parentItemId))(generalData.items)
        itemsIdToItemsMap[parentItemId] = parentItem
      }
      FPNRecursiveFn(parentItem)
    } else FPNRecursiveFailed = true
  }

  forEach((item) => {
    if (FPNRecursiveFailed === false) {
      itemsChecked = []
      itemsIdToItemsMap[item.id] = item
      FPNRecursiveFn(item)
    }
  }, generalData.items)

  return { FPNRecursiveFailed, itemsIdToItemsMap, parentNode }
}

export default curry((errorHandler, toDiagramName, generalData) => {
  const { FPNRecursiveFailed, itemsIdToItemsMap, parentNode } = findParentNode(generalData)

  if (FPNRecursiveFailed) {
    errorHandler('The data structure is not suitable for this diagram')

    return []
  } else {
    return buildNodesDataRecursiveFn({
      generalDataConnections: generalData.connections,
      item: parentNode,
      itemsIdToItemsMap, toDiagramName,
    })
  }
})
