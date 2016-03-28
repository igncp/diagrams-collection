// Pure functions composing ramda functions
import {
  addIndex, curry, filter, identity, converge, assoc, forEach, prop, not, compose,
} from "ramda"

const refToProp = curry((orig, dest) => converge(assoc(dest), [prop(orig), identity]))

const each = addIndex(forEach)

const isUndefined = item => typeof(item) === "undefined"
const removeUndefined = filter(compose(not, isUndefined))

export default {
  each,
  refToProp,
  removeUndefined,
}
