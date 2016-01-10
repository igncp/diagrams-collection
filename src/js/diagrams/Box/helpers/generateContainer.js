const { isArray } = _

import generateItem from './generateItem'

/**
 * Signatures:
 * (text, description, items, options)
 * (text, items, options)
 */
export default (...args) => {
  const text = args[0]
  let description = args[1]
  let items = args[2]
  let options = args[3] || null

  if (isArray(description)) {
    options = items
    items = description
    description = null
  }

  return generateItem({ description, items, options, text })
}
