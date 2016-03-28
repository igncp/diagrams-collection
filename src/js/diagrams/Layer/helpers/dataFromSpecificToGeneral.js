import { forEach, isEmpty, merge } from "ramda"

import { diagramName } from "../constants"
import { removeUndefined } from "../../../utils/pure"

const generateRecursiveFnState = () => {
  return {
    connections: [],
    finalItems: [],
    idCounter: -1,
  }
}

const createGeneralItem = ({ description, name }, item, state) => {
  return removeUndefined({
    description,
    graphsData: merge(
      item.graphsData || {},
      { [diagramName]: removeUndefined({
        id: item.id,
        relationships: item.options,
      }) }
    ),
    id: ++state.idCounter,
    name: name || item.fullText,
  })
}

const recursiveFn = (state, items, generalItemParent) => {
  const { connections, finalItems } = state

  forEach((item) => {
    const firstOccurrence = /(\. |:)/.exec(item.fullText)
    let name, description

    if (firstOccurrence) {
      const splittedText = item.fullText.split(firstOccurrence[0])

      name = splittedText[0]
      description = splittedText.slice(1).join(firstOccurrence)
    }

    const generalItem = createGeneralItem({ description, name }, item, state)

    finalItems.push(generalItem)

    if (generalItemParent) {
      connections.push({
        from: generalItem.id,
        to: generalItemParent.id,
      })
    }

    if (item.items && item.items.length > 0) recursiveFn(state, item.items, generalItem)
  }, items)
}

export default (conf) => {
  const state = generateRecursiveFnState()

  if (!isEmpty(conf)) recursiveFn(state, [conf])

  return {
    connections: state.connections,
    items: state.finalItems,
  }
}
