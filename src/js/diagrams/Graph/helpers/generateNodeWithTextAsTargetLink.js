import d from 'diagrams'

export default (file) => {
  return () => {
    return d.graph.generateNodeWithTargetLink(file, arguments[0]).apply({}, arguments)
  }
}
