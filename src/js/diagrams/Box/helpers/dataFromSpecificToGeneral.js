import { forEach, merge } from "ramda"

import { diagramName } from "../constants"

const recursiveFn = (items, parentCreatedItem, context) => {
  forEach((item) => {
    const { description, options } = item
    const createdItem = merge({
      graphsData: {
        [diagramName]: options ? { options } : {},
      },
      id: ++context.maxId,
      name: item.text,
    }, (description ? { description } : {}))

    context.finalItems.push(createdItem)

    if (parentCreatedItem) {
      context.connections.push({
        from: createdItem.id,
        to: parentCreatedItem.id,
      })
    } else {
      context.connections.push({
        from: createdItem.id,
        to: 0,
      })
    }

    if (item.items && item.items.length > 0) recursiveFn(item.items, createdItem, context)
  }, items)
}

export default (conf) => {
  const context = {
    connections: [],
    finalItems: [],
    maxId: -1,
  }

  context.finalItems.push({
    id: ++context.maxId,
    name: conf.name,
  })

  recursiveFn(conf.body, null, context)

  return {
    connections: context.connections,
    items: context.finalItems,
  }
}
