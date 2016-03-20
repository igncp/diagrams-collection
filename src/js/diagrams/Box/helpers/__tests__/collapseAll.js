import "../collapseAll"

const { mockWithMockery } = testsHelpers

const expandOrCollapseAllSpy = spy()

describeStd(__filename, () => {
  const deps = {}

  beforeEach(function() {
    this.resetMockery = mockWithMockery(require.resolve("../collapseAll"), [
      ["./expandOrCollapseAll", expandOrCollapseAllSpy],
    ])
    deps.collapseAll = require("../collapseAll")
  })
  afterEach(function() {
    this.resetMockery()
    expandOrCollapseAllSpy.reset()
  })

  it("Should call expandOrCollapseAll once.", () => {
    deps.collapseAll()

    expect(expandOrCollapseAllSpy).to.have.been.calledOnce
  })

  it("Should call expandOrCollapseAll with the expected arguments.", () => {
    const creationId = 1

    deps.collapseAll(creationId)

    expect(expandOrCollapseAllSpy).to.have.been.calledWith(creationId, "collapse")
  })
})
