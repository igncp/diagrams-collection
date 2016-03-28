import dataFromSpecificToGeneral from "../dataFromSpecificToGeneral"

describeStd(__filename, () => {
  it("Returns the expected data. (e018c6)", () => {
    const init = {}
    const expected = {
      connections: [],
      items: [],
    }
    const actual = dataFromSpecificToGeneral(init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected data. (a9eeec)", () => {
    const init = { fullText: "foo", id: 1, items: [] }
    const expected = {
      connections: [],
      items: [{
        graphsData: {
          layer: {
            id: 1,
          },
        },
        id: 0,
        name: "foo",
      }],
    }
    const actual = dataFromSpecificToGeneral(init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected data. (80c43e)", () => {
    const init = { fullText: "foo", id: 1, items: [{ fullText: "bar", id: 3 }] }
    const expected = {
      connections: [{
        from: 1,
        to: 0,
      }],
      items: [{
        graphsData: {
          layer: {
            id: 1,
          },
        },
        id: 0,
        name: "foo",
      }, {
        graphsData: {
          layer: {
            id: 3,
          },
        },
        id: 1,
        name: "bar",
      }],
    }
    const actual = dataFromSpecificToGeneral(init)

    expect(actual).to.eql(expected)
  })
})
