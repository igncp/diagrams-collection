import dataFromGeneralToSpecific from "../dataFromGeneralToSpecific"

describeStd(__filename, () => {
  it("Is a function.", () => {
    expect(dataFromGeneralToSpecific).to.be.a("function")
  })

  it("Transforms to the expected data. (bef574)", () => {
    const init = {
      connections: [{ from: 1, to: 2 }],
      items: [{ id: 1, name: "foo" }, { id: 2, name: "bar" }],
    }
    const expected = {
      body: [{
        id: 1,
        text: "foo",
      }],
      id: 2,
      name: "bar",
    }
    const actual = dataFromGeneralToSpecific(init)

    expect(actual).to.eql(expected)
  })

})
