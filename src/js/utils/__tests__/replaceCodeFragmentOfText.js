import replaceCodeFragmentOfText from "../replaceCodeFragmentOfText"

describeStd(__filename, () => {
  it("Provides the expected args to the predicate.", () => {
    const code = "a``js``var foo  = bar``b``js``var baz  = bam``"
    const predicateFn = (argsObj) => {
      expect(argsObj).to.have.all.keys([
        "allMatches",
        "codeBlock",
        "language",
        "matchStr",
        "text",
      ])
    }
    const init = [code, predicateFn]

    replaceCodeFragmentOfText(...init)
  })

  it("The args in the predicate contain the expected values.", () => {
    const code = "a``js``var foo  = bar``b``js``var baz  = bam``"
    const predicateFn = ({ allMatches, codeBlock, language, matchStr, text }) => {
      expect(allMatches).to.have.lengthOf(2)
      expect(language).to.eql("js")
      expect(matchStr).to.include(codeBlock)
      expect(text).to.eql(code)
    }
    const init = [code, predicateFn]

    replaceCodeFragmentOfText(...init)
  })

  it("Returns the expected result.", () => {
    const init = ["foo", () => ""]
    const expected = "foo"
    const actual = replaceCodeFragmentOfText(...init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected result.", () => {
    const init = ["``js``foo``", () => ""]
    const expected = ""
    const actual = replaceCodeFragmentOfText(...init)

    expect(actual).to.eql(expected)
  })
})
