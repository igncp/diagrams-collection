import parseItemGenerationOptions from "../parseItemGenerationOptions"

describeStd(__filename, () => {
  it("Returns the expected object. (7e0246)", () => {
    const init = "foo-bar bam-baz"
    const expected = {
      bamBaz: true,
      fooBar: true,
    }
    const actual = parseItemGenerationOptions(init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected object. (674a0d)", () => {
    const init = { foo: "bar" }
    const expected = init
    const actual = parseItemGenerationOptions(init)

    expect(actual).to.eql(expected)
  })
})
