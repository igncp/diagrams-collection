const { each } = _

export default (conf) => {
  let maxId = -1
  const finalItems = []
  const connections = []
  const recursiveFn = (items, parentCreatedItem) => {
    each(items, (item) => {
      const firstOccurrence = /(\. |:)/.exec(item.fullText)
      let name, description, splittedText, createdItem

      if (firstOccurrence) {
        splittedText = item.fullText.split(firstOccurrence[0])
        name = splittedText[0]
        description = splittedText.slice(1).join(firstOccurrence)
      }
      createdItem = {
        description: description || null,
        graphsData: {
          layer: {
            id: item.id,
            relationships: item.options,
          },
        },
        id: ++maxId,
        name: name || item.fullText,
      }
      finalItems.push(createdItem)

      if (parentCreatedItem) {
        connections.push({
          from: createdItem.id,
          to: parentCreatedItem.id,
        })
      }

      if (item.items && item.items.length > 0) recursiveFn(item.items, createdItem)
    })
  }

  recursiveFn([conf])

  return {
    connections,
    items: finalItems,
  }
}
