import idOpt from "../idOpt"

describeStd(__filename, () => {
  it("Returns the expected object.", () => {
    const init = 1
    const expected = { id: "layer-1-custom" }
    const actual = idOpt(init)

    expect(actual).to.eql(expected)
  })
})
