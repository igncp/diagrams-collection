const { each } = _

const recursiveFn = (items, parentCreatedItem, context) => {
  each(items, (item) => {
    const createdItem = {
      description: item.description,
      graphsData: {
        box: {
          options: item.options,
        },
      },
      id: ++context.maxId,
      name: item.text,
    }

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
  })
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
