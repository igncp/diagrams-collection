import d from "diagrams"
import addButtons from "../addButtons"

const addDivBeforeSvgReturn = {
  appendButtonToDiv: spy(),
}
const addDivBeforeSvgStub = stub().returns(addDivBeforeSvgReturn)

describeStd(__filename, () => {
  it("d.Diagram. has addDivBeforeSvg.", () => {
    expect(d.Diagram.addDivBeforeSvg).to.be.a("function")
  })

  describe("mocking", () => {
    beforeEach(function() {
      this.previousDiagram = d.Diagram
      d.Diagram = { addDivBeforeSvg: addDivBeforeSvgStub }
    })
    afterEach(function() {
      d.Diagram = this.previousDiagram
      addDivBeforeSvgStub.reset()
      addDivBeforeSvgReturn.appendButtonToDiv.reset()
    })

    it("Calls addDivBeforeSvgStub.", () => {
      const init = 1

      addButtons(init)
      expect(addDivBeforeSvgStub).to.have.been.calledOnce
    })

    it("Calls appendButtonToDiv with the expected args.", () => {
      const init = 1

      addButtons(init)
      expect(addDivBeforeSvgReturn.appendButtonToDiv).to.have.been.calledTwice
      expect(addDivBeforeSvgReturn.appendButtonToDiv.args).to.eql([
        ['diagrams-box-collapse-all-button', 'Collapse all', `diagrams.box.collapseAll(1)`],
        ['diagrams-box-expand-all-button', 'Expand all', `diagrams.box.expandAll(1)`],
      ])
    })
  })
})
