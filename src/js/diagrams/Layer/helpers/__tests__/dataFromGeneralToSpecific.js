import dataFromGeneralToSpecific from "../dataFromGeneralToSpecific"

describeStd(__filename, () => {
  it("Is a function.", () => {
    expect(dataFromGeneralToSpecific).to.be.a("function")
  })

  it("Transforms to the expected data. (c4409a)", () => {
    const init = {
      connections: [{ from: 1, to: 2 }],
      items: [{ id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }
    const expected = {
      id: 2,
      items: [{
        id: 1,
        text: "foo",
      }],
      text: "bar",
    }
    const actual = dataFromGeneralToSpecific(init)

    expect(actual).to.eql(expected)
  })

  it("Transforms to the expected data. (41d60c)", () => {
    const init = {
      connections: [{ from: 1, to: 2 }],
      items: [{ graphsData: {
        box: {
          options: { notCompleted: true },
        },
      }, id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }
    const expected = {
      id: 2,
      items: [{
        graphsData: {
          box: {
            options: { notCompleted: true },
          },
        },
        id: 1,
        text: "foo",
      }],
      text: "bar",
    }
    const actual = dataFromGeneralToSpecific(init)

    expect(actual).to.eql(expected)
  })
})
