import textFn from "../textFn"

describeStd(__filename, () => {
  it("Returns a function.", () => {
    const init = ["foo.bar", "a", "b"]
    const result = textFn(...init)

    expect(result).to.be.a("function")
  })

  it("The returned function returns the expected results. (9c7d77)", () => {
    const init = ["foo.bar"]
    const resultFn = textFn(...init)
    const init2 = {
      foo: {
        bar: "baz",
      },
    }
    const expected = "baz"
    const actual = resultFn(init2)

    expect(actual).to.eql(expected)
  })

  it("The returned function returns the expected results. (9c7d77)", () => {
    const init = ["foo.bar", "a ", " b"]
    const resultFn = textFn(...init)
    const init2 = {
      foo: {
        bar: "baz",
      },
    }
    const expected = "a baz b"
    const actual = resultFn(init2)

    expect(actual).to.eql(expected)
  })
})
