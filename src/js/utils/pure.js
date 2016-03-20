// Pure functions composing ramda functions
import { addIndex, curry, identity, converge, assoc, forEach, prop } from "ramda"

const refToProp = curry((orig, dest) => converge(assoc(dest), [prop(orig), identity]))

const each = addIndex(forEach)

export default {
  each,
  refToProp,
}
