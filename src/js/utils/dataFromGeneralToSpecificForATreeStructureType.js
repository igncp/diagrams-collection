import { isUndefined, last, where } from "lodash"

import each from "./each"

export default (generalData) => {
  // FPN: Find Parent Node
  let FPNRecursiveFailed = false
  const itemsIdToItemsMap = {}
  const nodesData = {}
  const findParentNodeFn = () => {
    let itemsChecked
    const itemsIdToFromConnectionMap = {}
    const FPNRecursiveFn = (item) => {
      let connection, parentItemId, parentItem

      if (itemsChecked.indexOf(item) > -1) {
        FPNRecursiveFailed = true

        return
      } else itemsChecked.push(item)

      if (isUndefined(itemsIdToFromConnectionMap[item.id]) === false) {
        connection = itemsIdToFromConnectionMap[item.id]
      } else {
        connection = where(generalData.connections, {
          from: item.id,
        })
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
          parentItem = where(generalData.items, {
            id: parentItemId,
          })[0]
          itemsIdToItemsMap[parentItemId] = parentItem
        }
        FPNRecursiveFn(parentItem)
      } else FPNRecursiveFailed = true
    }

    each((item) => {
      if (FPNRecursiveFailed === false) {
        itemsChecked = []
        itemsIdToItemsMap[item.id] = item
        FPNRecursiveFn(item)
      }
    })(generalData.items)
  }
  const buildNodesDataRecursiveFn = (transformedData, item) => {
    let text, children

    transformedData.id = item.id
    text = item.name

    if (item.description) text += `: ${item.description}`
    transformedData.text = text

    children = where(generalData.connections, {
      to: item.id,
    })

    if (children.length > 0) {
      transformedData.items = []
      each((child) => {
        transformedData.items.push({})
        buildNodesDataRecursiveFn(last(transformedData.items), itemsIdToItemsMap[child.from])
      })(children)
    }
  }
  let parentNode

  findParentNodeFn()

  if (FPNRecursiveFailed) {
    alert('The data structure is not suitable for this diagram')

    return []
  } else {
    buildNodesDataRecursiveFn(nodesData, parentNode)

    return nodesData
  }
}
