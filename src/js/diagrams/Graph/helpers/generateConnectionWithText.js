import { isArray, isNumber, isString, map } from "lodash"

import mergeWithDefaultConnection from './mergeWithDefaultConnection'
import generateConnectionWithText from './generateConnectionWithText'

export default (nodesIds, text) => {
  if (isArray(nodesIds) && isArray(nodesIds[0])) {
    return map(nodesIds, (args) => {
      return generateConnectionWithText.apply({}, args)
    })
  }

  if (isString(nodesIds)) nodesIds = nodesIds.split(' ').map(Number)
  else if (isNumber(nodesIds)) nodesIds = [nodesIds]

  return mergeWithDefaultConnection({ nodesIds, text })
}
