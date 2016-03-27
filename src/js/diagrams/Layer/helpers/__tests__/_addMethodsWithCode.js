import _getMethodsWithCode from "../_getMethodsWithCode"

const helpers = {
  foo: spy(),
}

describeStd(__filename, () => {
  beforeEach(function() {
    helpers.foo.reset()
  })

  it("Doesn't mutate the provided helpers.", () => {
    _getMethodsWithCode(helpers, "foo")

    expect(helpers.fooWithCode).to.be.undefined
    expect(helpers.fooWithParagraphAndCode).to.be.undefined
  })

  it("The new methods return a function.", () => {
    const { fooWithCode, fooWithParagraphAndCode } = _getMethodsWithCode(helpers, "foo")

    expect(fooWithCode()).to.be.a("function")
    expect(fooWithParagraphAndCode()).to.be.a("function")
  })

  it("The returned function of the methods call the original method.", () => {
    const { fooWithCode, fooWithParagraphAndCode } = _getMethodsWithCode(helpers, "foo")

    fooWithCode()()
    expect(helpers.foo).to.have.been.calledOnce
    fooWithParagraphAndCode()()
    expect(helpers.foo).to.have.been.calledTwice
  })

  it("The returned function of the method `WithCode` parses the first argument.", () => {
    const { fooWithCode } = _getMethodsWithCode(helpers, "foo")

    fooWithCode("js")("foo", "bar")
    expect(helpers.foo.args[0]).to.eql(["``js``foo``", "bar"])
  })

  it("It accepts array blocks.", () => {
    const { fooWithCode } = _getMethodsWithCode(helpers, "foo")

    fooWithCode("js")(["foo1", "foo2"], "bar")
    expect(helpers.foo.args[0]).to.eql(["``js``foo1\nfoo2``", "bar"])
  })

  it("The returned function of the method `WithCode`"
    + "parses the first and second arguments.", () => {
    const { fooWithParagraphAndCode } = _getMethodsWithCode(helpers, "foo")

    fooWithParagraphAndCode("js")("foo", "bar")
    expect(helpers.foo.args[0]).to.eql(["<p>foo</p>``js``bar``"])
  })
})
