import idsHandler from './idsHandler'
import extendOpts from './extendOpts'

const { extend, isArray, isObject, isString, isUndefined } = _

export default (text, opts, items) => {
  let layer = { text }

  if (isArray(opts)) items = opts
  else {
    if (isString(opts)) opts = extendOpts(opts)

    if (isObject(opts)) layer = extend(layer, opts)
  }

  if (items) layer.items = items

   // Have to limit the id by the two sides to enable .indexOf to work
  if (isUndefined(layer.id)) layer.id = `layer-${idsHandler.increase()}-auto`

  return layer
}
