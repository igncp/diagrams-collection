import formatShortDescription from "../formatShortDescription"
import { getEditedDescriptionToken } from "../editedDescriptionTokenHandler"

describeStd(__filename, () => {
  it("Formats the text as expected. (60008b)", () => {
    const init = "foo"
    const expected = "foo"
    const actual = formatShortDescription(init)

    expect(actual).to.eql(expected)
  })

  it("Returns (...) if it was edited before.", () => {
    const init = `${getEditedDescriptionToken()}foo`
    const expected = "(...)"
    const actual = formatShortDescription(init)

    expect(actual).to.eql(expected)
  })

  it("Formats the text as expected. (0614ad)", () => {
    const init = "<p>foo</p><p>bar</p>"
    const expected = "foo. bar. "
    const actual = formatShortDescription(init)

    expect(actual).to.eql(expected)
  })

  it("Formats the text as expected. (d1ca41)", () => {
    const init = "foo<br>bar"
    const expected = "foo bar"
    const actual = formatShortDescription(init)

    expect(actual).to.eql(expected)
  })

  it("Formats the text as expected. (aec24c)", () => {
    const init = "foo``js``var foo = 'bar'``"
    const expected = "foo <CODE...>"
    const actual = formatShortDescription(init)

    expect(actual).to.eql(expected)
  })

  it("Formats the text as expected. (f2f561)", () => {
    const init = "``js``var foo = 'bar'``"
    const expected = "var foo = 'bar'"
    const actual = formatShortDescription(init)

    expect(actual).to.eql(expected)
  })
})
