import { each, map } from "lodash"

const getNewConnection = ({ connection, currentNode, otherNodeId }) => {
  if (connection.direction === 'out') return {
    from: currentNode.id,
    to: otherNodeId,
  }
  else if (connection.direction === 'in') return {
    from: otherNodeId,
    to: currentNode.id,
  }
}

const extractConnections = (currentNode, connection) => {
  return map(connection.nodesIds, (otherNodeId) => {
    const newConnection = getNewConnection({ connection, currentNode, otherNodeId })

    return newConnection
  })
}

export default (data) => {
  const finalItems = []
  let connections = []

  each(data, (node) => {
    finalItems.push({
      description: node.description,
      id: node.id,
      name: node.name,
    })

    each(node.connections, (connection) => {
      connections = connections.concat(extractConnections(node, connection))
    })
  })

  return {
    connections,
    items: finalItems,
  }
}
