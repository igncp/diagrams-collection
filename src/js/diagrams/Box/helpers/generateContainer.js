import { isArray } from "lodash"

import generateItem from './generateItem'

/**
 * Signatures:
 * (text, description, items, options)
 * (text, items, options)
 */
const generateContainer = (...args) => {
  if (isArray(args[1])) return generateContainer(args[0], null, args[1], args[2])

  return generateItem({ description: args[1], items: args[2], options: args[3], text: args[0] })
}

export default generateContainer
