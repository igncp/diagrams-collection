import positionFn from "../positionFn"

describeStd(__filename, () => {
  it("Returns a function.", () => {
    const result = positionFn("foo")

    expect(result).to.be.a("function")
  })

  it("The returned function returns a number.", () => {
    const result = positionFn("foo.bar.baz")
    const obj = { foo: { bar: { baz: 1 } } }

    expect(result(obj)).to.eql(1)
  })

  it("The returned function returns a number with offset.", () => {
    const result = positionFn("foo.bar.baz", 2)
    const obj = { foo: { bar: { baz: 1 } } }

    expect(result(obj)).to.eql(3)
  })

})
