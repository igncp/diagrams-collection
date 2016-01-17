import { forEach } from "ramda"
import { isArray, isNumber, isObject, isString } from "lodash"

import { each } from "utils"
import generateNodeOptions from './generateNodeOptions'
import mergeWithDefaultConnection from './mergeWithDefaultConnection'

const addDefaultConnectionFromNumber = (node, nodeId) => {
  node.connections.push(mergeWithDefaultConnection({
    nodesIds: [nodeId],
  }))
}

const addConnection = (node, connection) => {
  if (isArray(connection)) forEach((singleConnection) => {
    addConnection(node, singleConnection)
  }, connection)
  else if (isNumber(connection)) addConnection({
    nodesIds: [connection],
  })
  else if (isObject(connection)) {
    mergeWithDefaultConnection(connection)
    node.connections.push(connection)
  }
}

const handleStrCase = (node, origConnections) => {
  const connections = origConnections.split(' ').map(Number)

  if (connections.length > 0) node.id = connections[0]

  if (connections.length > 1) {
    each((nodeId, index) => {
      if (index > 0) addConnection(node, nodeId)
    }, connections)
  }
}

const handleArrCase = (node, origConnections) => {
  const connections = origConnections.slice(1)

  node.id = origConnections[0]
  forEach((connection) => {
    if (isNumber(connection)) addDefaultConnectionFromNumber(node, connection)
    else addConnection(node, connection)
  }, connections)
}

const handleCases = (node, origConnections) => {
  if (isString(origConnections)) {
    handleStrCase(node, origConnections)
  } else if (isArray(origConnections)) {
    handleArrCase(node, origConnections)
  } else if (isNumber(origConnections)) node.id = origConnections
}

const generateComplexNode = (node, argsArr) => {
  const origConnections = argsArr[1]

  handleCases(node, origConnections)

  if (argsArr.length > 2) node.description = argsArr[2]

  if (argsArr.length > 3) node.options = generateNodeOptions(argsArr[3])
}

export default (...args) => {
  const node = {
    name: args[0],
  }

  if (args.length > 1) {
    node.connections = []
    generateComplexNode(node, args)
  }

  return node
}
