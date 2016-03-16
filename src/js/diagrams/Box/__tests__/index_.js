import "../index"
import { Diagram, getState, resetState } from "../../../diagram"

const { mockReplacing, mockWithMockery } = testsHelpers

const helpersMock = "foo"
const getCreationFnReturnStub = stub()
const creationMock = {
  getCreationFn: stub().returns(getCreationFnReturnStub),
}
const NOOP = NOOP

describeStd(__filename, () => {
  let boxDiagramFactoryCreator

  beforeEach(function() {
    this.resetMockery = mockWithMockery(require.resolve('../index.js'), [
      ["./helpers", helpersMock],
      ["./creation", creationMock],
    ])
    this.resetMocks = mockReplacing(this, [
      [global, "document", { readyState: "complete" }],
      [global, "window", {}],
    ])
    stub(Diagram.prototype, "addConversionButtons", NOOP)

    boxDiagramFactoryCreator = require("../index")
  })

  afterEach(function() {
    this.resetMockery()
    this.resetMocks()
    resetState()
    Diagram.prototype.addConversionButtons.restore()
    getCreationFnReturnStub.reset()
    creationMock.getCreationFn.reset()
  })

  it("It is a (factory-creation) function.", () => {
    expect(boxDiagramFactoryCreator).to.be.a("function")
  })

  it("Calls getCreationFn during create.", () => {
    const boxDiagramFactory = boxDiagramFactoryCreator()
    const boxDiagram = boxDiagramFactory.register()

    boxDiagram()

    expect(creationMock.getCreationFn).to.have.been.calledOnce
    expect(getCreationFnReturnStub).to.have.been.calledOnce
  })

  it("Registers the factory correctly.", () => {
    const boxDiagramFactory = boxDiagramFactoryCreator()
    const boxDiagram = boxDiagramFactory.register()
    const { diagramsRegistry } = getState()

    boxDiagram()

    expect(diagramsRegistry).to.have.lengthOf(1)
    expect(diagramsRegistry[0].diagram).to.equal(boxDiagramFactory)
  })

  it("Registers the passed data **to creation** correctly.", () => {
    const boxDiagramFactory = boxDiagramFactoryCreator()
    const boxDiagram = boxDiagramFactory.register()
    const { diagramsRegistry } = getState()
    const data = [{ foo: "bar" }]

    boxDiagram(data)
    expect(diagramsRegistry[0].data).to.eql(getCreationFnReturnStub.args[0])
  })

  it("Is registered with a numeric id.", () => {
    const boxDiagramFactory = boxDiagramFactoryCreator()
    const boxDiagram = boxDiagramFactory.register()
    const { diagramsRegistry } = getState()

    boxDiagram()
    expect(diagramsRegistry[0].id).to.be.a("number")
    expect(diagramsRegistry[0].id).to.eql(boxDiagramFactory.diagramId)
  })

  describe("setRelationships", () => {
    beforeEach(() => {
      stub(Diagram.prototype, "generateEmptyRelationships", NOOP)
      stub(Diagram.prototype, "addDependantRelationship", NOOP)
      stub(Diagram.prototype, "addDependencyRelationship", NOOP)
    })
    afterEach(() => {
      Diagram.prototype.generateEmptyRelationships.restore()
      Diagram.prototype.addDependantRelationship.restore()
      Diagram.prototype.addDependencyRelationship.restore()
    })

    it("Doesn't call generateEmptyRelationships if there are items.", () => {
      const boxDiagramFactory = boxDiagramFactoryCreator()

      boxDiagramFactory.setRelationships([])
      expect(Diagram.prototype.generateEmptyRelationships).not.to.have.been.called
    })

    it("Calls the expected functions if there are items but not container.", () => {
      const boxDiagramFactory = boxDiagramFactoryCreator()

      boxDiagramFactory.setRelationships([{ foo: "bar" }], null)
      expect(Diagram.prototype.generateEmptyRelationships).have.been.calledOnce
      expect(Diagram.prototype.addDependantRelationship).not.to.have.been.called
      expect(Diagram.prototype.addDependencyRelationship).not.to.have.been.called
    })

    it("Calls the expected functions if there are items and container.", () => {
      const boxDiagramFactory = boxDiagramFactoryCreator()

      boxDiagramFactory.setRelationships([{ foo: "bar" }], { baz: "bam" })
      expect(Diagram.prototype.generateEmptyRelationships).have.been.calledOnce
      expect(Diagram.prototype.addDependantRelationship).to.have.been.calledOnce
      expect(Diagram.prototype.addDependencyRelationship).to.have.been.calledOnce
    })

    it("Calls the expected functions if there are nested items items and container.", () => {
      const boxDiagramFactory = boxDiagramFactoryCreator()

      boxDiagramFactory.setRelationships([{ items: [{ foo2: "bar2" }] }], { baz: "bam" })
      expect(Diagram.prototype.generateEmptyRelationships).have.been.calledTwice
      expect(Diagram.prototype.addDependantRelationship).to.have.been.calledTwice
      expect(Diagram.prototype.addDependencyRelationship).to.have.been.calledTwice
    })
  })
})
