import dataFromSpecificToGeneral from "../dataFromSpecificToGeneral"

describeStd(__filename, () => {
  it("Transforms the expected data. (23e468)", () => {
    const init = { body: [{ text: "bar" }], name: "foo" }
    const expected = {
      connections: [{ from: 1, to: 0 }],
      items: [{ id: 0, name: "foo" }, {
        graphsData: {
          box: {},
        },
        id: 1,
        name: "bar",
      }],
    }
    const actual = dataFromSpecificToGeneral(init)

    expect(actual).to.eql(expected)
  })

  it("Transforms the expected data. (dfd51d)", () => {
    const init = { body: [{ text: "bar" }, { text: "baz" }], name: "foo" }
    const expected = {
      connections: [{ from: 1, to: 0 }, { from: 2, to: 0 }],
      items: [{ id: 0, name: "foo" }, {
        graphsData: {
          box: {},
        },
        id: 1,
        name: "bar",
      }, {
        graphsData: {
          box: {},
        },
        id: 2,
        name: "baz",
      }],
    }
    const actual = dataFromSpecificToGeneral(init)

    expect(actual).to.eql(expected)
  })

  it("Transforms the expected data. (524580)", () => {
    const init = { body: [
      { options: { notCompleted: true }, text: "bar" },
    ], name: "foo" }
    const expected = {
      connections: [{ from: 1, to: 0 }],
      items: [{ id: 0, name: "foo" }, {
        graphsData: {
          box: {
            options: { notCompleted: true },
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
