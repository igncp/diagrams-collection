import "../traverseBodyDataAndRefresh"

const { mockWithMockery } = testsHelpers

const creationIdMock = "creation-id"
const returnedConf = {
  body: [{ items: [ { collapsedItems: [{ text: "bar" }], text: "foo" }] }],
}
const diagramsMock = {
  Diagram: {
    getDataWithCreationId: stub(),
  },
}
const addBodyItemsAndUpdateHeightsMock = {
  run: spy(),
}

describeStd(__filename, () => {
  let traverseBodyDataAndRefresh

  beforeEach(function() {
    this.resetMockery = mockWithMockery(require.resolve("../traverseBodyDataAndRefresh"), [
      ["diagrams", diagramsMock],
      ["./addBodyItemsAndUpdateHeights", addBodyItemsAndUpdateHeightsMock],
    ])
    diagramsMock.Diagram.getDataWithCreationId
      .withArgs(creationIdMock)
      .returns([null, returnedConf])
    traverseBodyDataAndRefresh = require("../traverseBodyDataAndRefresh")
  })
  afterEach(function() {
    this.resetMockery()
    addBodyItemsAndUpdateHeightsMock.run.reset()
    diagramsMock.Diagram.getDataWithCreationId.reset()
  })

  it("Calls addBodyItemsAndUpdateHeights.", () => {
    const cbSpy = spy()

    traverseBodyDataAndRefresh(creationIdMock, null, cbSpy)
    expect(addBodyItemsAndUpdateHeightsMock.run).to.have.been.calledOnce
  })

  it("Calls cb with the expected arguments.", () => {
    const cbSpy = spy()

    traverseBodyDataAndRefresh(creationIdMock, null, cbSpy)

    const topConfItem = returnedConf.body[0]

    expect(cbSpy.args).to.eql([
      [ topConfItem, [] ],
      [ topConfItem.items[0], [topConfItem] ],
    ])
  })

  it("Includes the collapsed items if specified by the props.", () => {
    const cbSpy = spy()

    traverseBodyDataAndRefresh(creationIdMock, { withCollapsedItems: true }, cbSpy)

    expect(cbSpy).to.have.been.calledThice

    const topConfItem = returnedConf.body[0]

    expect(cbSpy.args).to.eql([
      [ topConfItem, [] ],
      [ topConfItem.items[0], [topConfItem] ],
      [ topConfItem.items[0].collapsedItems[0], [topConfItem, topConfItem.items[0]] ],
    ])
  })
})
