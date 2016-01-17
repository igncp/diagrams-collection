import { isArray, isNumber, isString, map } from "lodash"

import d from 'diagrams'
import generateConnectionWithText from './generateConnectionWithText'

export default (nodesIds, text) => {
  if (isArray(nodesIds) && isArray(nodesIds[0])) {
    return map(nodesIds, (args) => {
      return generateConnectionWithText.apply({}, args)
    })
  }

  if (isString(nodesIds)) nodesIds = nodesIds.split(' ').map(Number)
  else if (isNumber(nodesIds)) nodesIds = [nodesIds]

  return d.graph.mergeWithDefaultConnection({ nodesIds, text })
}
