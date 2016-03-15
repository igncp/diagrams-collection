import collapseIfNecessary from "../collapseIfNecessary"
import helpers from "../../helpers"

const { d3ElMock } = testsMocks
const { resetAll } = testsHelpers

const collapseAndRunListener = (item) => {
  collapseIfNecessary(d3ElMock, item)
  const listenerFn = d3ElMock.on.args[0][1]

  listenerFn()
}

describeStd(__filename, () => {
  beforeEach(() => {
    stub(helpers.addBodyItemsAndUpdateHeights, "run")
    helpers.addBodyItemsAndUpdateHeights.run.reset()
  })
  afterEach(() => {
    resetAll(d3ElMock)
    helpers.addBodyItemsAndUpdateHeights.run.restore()
  })
  it("Requires that item has a items property.", () => {
    expect(() => collapseIfNecessary({}, {})).to.throw
  })

  it("Should add the collapsed property to false if it didn't have it.", () => {
    const item = { items: [{}] }

    collapseIfNecessary(d3ElMock, item)
    expect(item.collapsed).to.eql(false)
  })

  it("Should maintain the collapsed property. (A)", () => {
    const item = { collapsed: false, items: [{}] }

    collapseIfNecessary(d3ElMock, item)
    expect(item.collapsed).to.eql(false)
  })

  it("Should maintain the collapsed property. (B)", () => {
    const item = { collapsed: true, items: [{}] }

    collapseIfNecessary(d3ElMock, item)
    expect(item.collapsed).to.eql(true)
  })

  it("Should change the collapsed prop when calling the listerner. (A)", () => {
    const item = { collapsed: true, items: [{}] }

    collapseAndRunListener(item)

    expect(item.collapsed).to.eql(false)
  })

  it("Should change the collapsed prop when calling the listerner. (B)", () => {
    const item = { collapsed: false, items: [{}] }

    collapseAndRunListener(item)

    expect(item.collapsed).to.eql(true)
  })

  it("Should when calling the listener in both cases. (A)", () => {
    const item = { collapsed: false, items: [{}] }

    collapseIfNecessary(d3ElMock, item)
    const listenerFn = d3ElMock.on.args[0][1]

    listenerFn()

    expect(helpers.addBodyItemsAndUpdateHeights.run).to.have.been.calledOnce
  })

  it("Should when calling the listener in both cases. (B)", () => {
    const item = { collapsed: true, items: [{}] }

    collapseAndRunListener(item)

    expect(helpers.addBodyItemsAndUpdateHeights.run).to.have.been.calledOnce
  })
})
