import dataFromGeneralToSpecificForATreeStructureType
  from "../dataFromGeneralToSpecificForATreeStructureType"

describeStd(__filename, () => {
  beforeEach(function() {
    this.previousAlert = global.alert
    global.alert = stub()
  })

  afterEach(function() {
    global.alert = this.previousAlert
  })

  it("Transforms the data as expected.", () => {
    const init = {
      connections: [{ from: 1, to: 2 }],
      items: [{ id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }
    const expected = { id: 2, items: [ { id: 1, text: "foo" } ], text: "bar" }
    const actual = dataFromGeneralToSpecificForATreeStructureType(init)

    expect(actual).to.eql(expected)
  })

  it("Doesn't return anything when data structure is not transformable.", () => {
    const init = {
      connections: [],
      items: [{ id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }

    const actual = dataFromGeneralToSpecificForATreeStructureType(init)
    const expected = []

    expect(actual).to.eql(expected)
  })

  it("Alerts when data structure is not transformable.", () => {
    const init = {
      connections: [],
      items: [{ id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }

    dataFromGeneralToSpecificForATreeStructureType(init)
    expect(global.alert).to.have.been.calledOnce
  })

  it("Thorws when data is inconsistent.", () => {
    const init = {
      connections: [{ from: 1, to: 2 }],
      items: [{ id: 1, name: "foo" }],
    }

    expect(() => dataFromGeneralToSpecificForATreeStructureType(init)).to.throw
  })
})
