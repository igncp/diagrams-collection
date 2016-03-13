import wrapInParagraph from "../wrapInParagraph"

describeStd(__filename, () => {
  it("Returns the expected result. (ebef34)", () => {
    const init = "foo"
    const expected = "<p>foo</p>"
    const actual = wrapInParagraph(init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected result. (5b37bd)", () => {
    const init = ""
    const expected = "<p></p>"
    const actual = wrapInParagraph(init)

    expect(actual).to.eql(expected)
  })
})
