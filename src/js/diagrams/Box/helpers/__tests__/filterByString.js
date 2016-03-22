import "../filterByString"

const { mockWithMockery } = testsHelpers

const traverseBodyDataAndRefreshMock = stub()
const lodashMock = {
  debounce: fn => fn,
}

describeStd(__filename, () => {
  let filterByString

  beforeEach(function() {
    this.resetMockery = mockWithMockery(require.resolve('../filterByString.js'), [
      ["./traverseBodyDataAndRefresh", traverseBodyDataAndRefreshMock],
      ["lodash", lodashMock],
    ])
    filterByString = require("../filterByString")
  })

  afterEach(function() {
    this.resetMockery()
    traverseBodyDataAndRefreshMock.reset()
  })

  it("Calls traverseBodyDataAndRefreshMock with the creationId.", () => {
    const creationId = "foo"

    filterByString({}, creationId)

    expect(traverseBodyDataAndRefreshMock.firstCall.args[0]).to.eql(creationId)
  })
})
