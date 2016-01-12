import generateNodeOptions from './generateNodeOptions'
import mergeWithDefaultConnection from './mergeWithDefaultConnection'

const { each, isArray, isNumber, isObject, isString } = _

export default (...args) => {
  const node = {
    name: args[0],
  }
  const addDefaultConnectionFromNumber = (nodeId) => {
    node.connections.push(mergeWithDefaultConnection({
      nodesIds: [nodeId],
    }))
  }
  const addConnection = (connection) => {
    if (isArray(connection)) each(connection, addConnection)
    else if (isNumber(connection)) addConnection({
      nodesIds: [connection],
    })
    else if (isObject(connection)) {
      mergeWithDefaultConnection(connection)
      node.connections.push(connection)
    }
  }
  let connections

  if (args.length > 1) {
    connections = args[1]
    node.connections = []

    if (isString(connections)) {
      connections = connections.split(' ').map(Number)

      if (connections.length > 0) node.id = connections[0]

      if (connections.length > 1) {
        each(connections, (nodeId, index) => {
          if (index > 0) addConnection(nodeId)
        })
      }
    } else if (isArray(connections)) {
      node.id = connections[0]
      connections = connections.slice(1)
      each(connections, (connection) => {
        if (isNumber(connection)) addDefaultConnectionFromNumber(connection)
        else addConnection(connection)
      })
    } else if (isNumber(connections)) node.id = connections

    if (args.length > 2) node.description = args[2]

    if (args.length > 3) node.options = generateNodeOptions(args[3])
  }

  return node
}
