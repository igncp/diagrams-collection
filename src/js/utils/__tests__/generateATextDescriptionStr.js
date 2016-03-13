import generateATextDescriptionStr from "../generateATextDescriptionStr"

describeStd(__filename, () => {
  it("Adds a description if it is provided.", () => {
    const result = generateATextDescriptionStr("foo", "bar")

    expect(result).to.eql("<strong>foo</strong><br>bar")
  })

  it("Just adds the text if no description is provided.", () => {
    const result = generateATextDescriptionStr("foo")

    expect(result).to.eql("<strong>foo</strong>")
  })
})
