import d3DefaultReturnFn from "../d3DefaultReturnFn"

describeStd(__filename, () => {
  it("Returns a function.", () => {
    const result = d3DefaultReturnFn("foo")

    expect(result).to.be.a("function")
  })

  it("The returned function accesses the object recursively.", () => {
    const result = d3DefaultReturnFn("foo.bar.baz")

    expect(result({ foo: { bar: { baz: "bam" } } })).to.eql("bam")
  })

  it("Supports preffixes and suffixes.", () => {
    const result = d3DefaultReturnFn("foo.bar.baz", "a", "b")

    expect(result({ foo: { bar: { baz: "bam" } } })).to.eql("abamb")
  })
})
