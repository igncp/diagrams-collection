import d from 'diagrams'

export default (creationId) => {
  const div = d.Diagram.addDivBeforeSvg()

  div.appendButtonToDiv('diagrams-box-collapse-all-button', 'Collapse all',
    `diagrams.box.collapseAll(${creationId})`)
  div.appendButtonToDiv('diagrams-box-expand-all-button', 'Expand all',
    `diagrams.box.expandAll(${creationId})`)
}
