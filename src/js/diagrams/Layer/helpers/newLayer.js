import { compose, curry, is, isArrayLike, merge } from "ramda"

import idsHandler from './idsHandler'
import parseOptsString from './parseOptsString'

const isUndefined = vr => typeof(vr) === "undefined"
const isObject = vr => typeof(vr) === "object" && vr !== null
const isString = is(String)

function getItemsAndOpts(extraArgs) {
  if (isArrayLike(extraArgs[0])) return { items: extraArgs[0], opts: null }
  else {
    return {
      items: extraArgs[1] || null,
      opts: isString(extraArgs[0]) ? parseOptsString(extraArgs[0]) : (extraArgs[0] || null),
    }
  }
}

const mergeOptsIfNecessary = curry((opts, layer) => {
  return (isObject(opts))
    ? merge(layer, opts)
    : layer
})

const addIdIfNeccessary = (layer) => {
  return isUndefined(layer.id)
    ? merge(layer, { id: `layer-${idsHandler.increase()}-auto` })
    : layer
}

const addItemsIfNecessary = curry((items, layer) => {
  return items ? merge(layer, { items }) : layer
})

/**
 * signatures
 * (text, items)
 * (text, opts, items)
 * (text, opts)
 */
export default (text, ...extraArgs) => {
  const { items, opts } = getItemsAndOpts(extraArgs)

  return compose(
    addItemsIfNecessary(items),
    addIdIfNeccessary,
    mergeOptsIfNecessary(opts)
  )({ text })
}
