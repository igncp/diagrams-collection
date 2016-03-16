import "../expandAll"

const { mockWithMockery } = testsHelpers

const expandOrCollapseAllSpy = spy()

describeStd(__filename, () => {
  let expandAll

  beforeEach(function() {
    this.resetMockery = mockWithMockery(require.resolve("../expandAll"), [
      ["./expandOrCollapseAll", expandOrCollapseAllSpy],
    ])
    expandAll = require("../expandAll")
  })
  afterEach(function() {
    this.resetMockery()
    expandOrCollapseAllSpy.reset()
  })

  it("Should call expandOrCollapseAll once.", () => {
    expandAll()

    expect(expandOrCollapseAllSpy).to.have.been.calledOnce
  })

  it("Should call expandOrCollapseAll with the expected arguments.", () => {
    const creationId = 1

    expandAll(creationId)

    expect(expandOrCollapseAllSpy).to.have.been.calledWith(creationId, "expand")
  })
})
