import { extend, isArray, isObject, isString, isUndefined } from "lodash"

import idsHandler from './idsHandler'
import parseOptsString from './parseOptsString'

export default (text, opts, items) => {
  let layer = { text }

  if (isArray(opts)) items = opts
  else {
    if (isString(opts)) opts = parseOptsString(opts)

    if (isObject(opts)) layer = extend(layer, opts)
  }

  if (items) layer.items = items

   // Have to limit the id by the two sides to enable .indexOf to work
  if (isUndefined(layer.id)) layer.id = `layer-${idsHandler.increase()}-auto`

  return layer
}
