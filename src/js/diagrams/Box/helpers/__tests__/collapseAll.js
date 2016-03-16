import "../collapseAll"

const { mockWithMockery } = testsHelpers

const expandOrCollapseAllSpy = spy()

describeStd(__filename, () => {
  let collapseAll

  beforeEach(function() {
    this.resetMockery = mockWithMockery(require.resolve("../collapseAll"), [
      ["./expandOrCollapseAll", expandOrCollapseAllSpy],
    ])
    collapseAll = require("../collapseAll")
  })
  afterEach(function() {
    this.resetMockery()
    expandOrCollapseAllSpy.reset()
  })

  it("Should call expandOrCollapseAll once.", () => {
    collapseAll()

    expect(expandOrCollapseAllSpy).to.have.been.calledOnce
  })

  it("Should call expandOrCollapseAll with the expected arguments.", () => {
    const creationId = 1

    collapseAll(creationId)

    expect(expandOrCollapseAllSpy).to.have.been.calledWith(creationId, "collapse")
  })
})
