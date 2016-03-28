import { concat, curry, is, reduce } from "ramda"

import { defaultConnectionType } from "../constants"

const isNumber = is(Number)
const reduceIdsArray = curry((type, acc, id) => concat(acc, [{
  id: `layer-${id}-custom`,
  type,
}]))

export default (ids, item, type = defaultConnectionType) => {
  const idsArray = isNumber(ids) ? [ids] : ids
  const connections = reduce(reduceIdsArray(type), [], idsArray)

  item.connectedTo = !item.connectedTo
    ? connections
    : item.connectedTo.concat(connections)
}
