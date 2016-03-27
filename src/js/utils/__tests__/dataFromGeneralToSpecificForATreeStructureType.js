import dataFromGeneralToSpecificForATreeStructureType
  from "../dataFromGeneralToSpecificForATreeStructureType"

const errorHandlerSpy = spy()

describeStd(__filename, () => {
  afterEach(function() {
    errorHandlerSpy.reset()
  })

  it("Transforms the data as expected. (1b6850)", () => {
    const init = [errorHandlerSpy, "fooDiagram", {
      connections: [{ from: 1, to: 2 }],
      items: [{ id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }]
    const expected = { id: 2, items: [ { id: 1, text: "foo" } ], text: "bar" }
    const actual = dataFromGeneralToSpecificForATreeStructureType(...init)

    expect(actual).to.eql(expected)
  })

  it("Transforms the data as expected. (4b9ecd)", () => {
    const graphsData = {
      fooDiagram: {
        foo: "bar",
      },
      otherDiagram: {
        bar: "baz",
      },
    }
    const init = [errorHandlerSpy, "fooDiagram", {
      connections: [{ from: 1, to: 2 }],
      items: [{ graphsData, id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }]
    const expected = { id: 2, items: [ {
      foo: "bar", graphsData: {
        otherDiagram: {
          bar: "baz",
        },
      }, id: 1, text: "foo",
    } ], text: "bar" }
    const actual = dataFromGeneralToSpecificForATreeStructureType(...init)

    expect(actual).to.eql(expected)
  })

  it("Transforms the data as expected. (cab94f)", () => {
    const graphsData = {
      otherDiagram: {
        bar: "baz",
      },
    }
    const init = [errorHandlerSpy, "fooDiagram", {
      connections: [{ from: 1, to: 2 }],
      items: [{ graphsData, id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }]
    const expected = { id: 2, items: [ {
      graphsData: {
        otherDiagram: {
          bar: "baz",
        },
      }, id: 1, text: "foo",
    } ], text: "bar" }
    const actual = dataFromGeneralToSpecificForATreeStructureType(...init)

    expect(actual).to.eql(expected)
  })

  it("Doesn't return anything when data structure is not transformable.", () => {
    const init = [errorHandlerSpy, "fooDiagram", {
      connections: [],
      items: [{ id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }]

    const actual = dataFromGeneralToSpecificForATreeStructureType(...init)
    const expected = []

    expect(actual).to.eql(expected)
  })

  it("Alerts when data structure is not transformable.", () => {
    const init = [errorHandlerSpy, "fooDiagram", {
      connections: [],
      items: [{ id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }]

    dataFromGeneralToSpecificForATreeStructureType(...init)
    expect(errorHandlerSpy).to.have.been.calledOnce
  })

  it("Thorws when data is inconsistent.", () => {
    const init = [errorHandlerSpy, "fooDiagram", {
      connections: [{ from: 1, to: 2 }],
      items: [{ id: 1, name: "foo" }],
    }]

    expect(() => dataFromGeneralToSpecificForATreeStructureType(...init)).to.throw
  })
})
