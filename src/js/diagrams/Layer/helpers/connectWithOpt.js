import { each, isNumber, isUndefined } from "lodash"

export default (ids, result, type) => {
  const objs = []

  if (isNumber(ids)) ids = [ids]
  type = type || 'standard'

  each(ids, (id) => {
    objs.push({
      id: `layer-${id}-custom`,
      type,
    })
  })

  if (isUndefined(result.connectedTo) === true) result.connectedTo = objs
  else result.connectedTo = result.connectedTo.concat(objs)
}
