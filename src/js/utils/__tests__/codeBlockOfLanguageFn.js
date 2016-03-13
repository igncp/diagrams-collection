import codeBlockOfLanguageFn from "../codeBlockOfLanguageFn"

describeStd(__filename, () => {
  it("Returns a function.", () => {
    const resultFn = codeBlockOfLanguageFn()

    expect(resultFn).to.be.a("function")
  })

  it("The function provided transforms a code block as expected.", () => {
    const resultFn = codeBlockOfLanguageFn("js", "//")
    const result = resultFn("var foo = 'bar'")

    expect(result).to.be.eql("``js``var foo = 'bar'``")
  })

  it("The function provided transforms a code block as expected with position.", () => {
    const resultFn = codeBlockOfLanguageFn("js", "//")
    const result = resultFn("var foo = 'bar'", "a")

    expect(result).to.be.eql("``js``// @a\nvar foo = 'bar'``")
  })

  it("The function provided transforms a code block as expected with withInlineStrs.", () => {
    const resultFn = codeBlockOfLanguageFn("js", "//")
    const result = resultFn("var foo = 'bar'", null, true)

    expect(result).to.be.eql("``js``// ...\nvar foo = 'bar'\n// ...``")
  })
})
