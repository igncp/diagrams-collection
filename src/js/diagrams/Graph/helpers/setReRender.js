export default (diagram, creationId, data) => {
  diagram.reRender = (conf) => {
    diagram.unlisten('configuration-changed')
    diagram.reRender = null
    diagram.removePreviousAndCreate(creationId, data, conf)
  }
}
