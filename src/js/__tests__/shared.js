import shared from "../shared"

describeStd(__filename, () => {
  beforeEach(function() {
    shared.reset()
  })

  it("Can set and get a key-value pair.", () => {
    expect(shared.get("foo")).to.be.undefined
    shared.set({ foo: "bar" })
    expect(shared.get("foo")).to.eql("bar")
  })

  it("Can reset values.", () => {
    shared.set({ foo: "bar" })
    expect(shared.get("foo")).not.to.be.undefined
    shared.reset()
    expect(shared.get("foo")).to.be.undefined
  })

  it("Throws if the key is a builtin method.", () => {
    const fn = () => shared.set({ set: "foo" })
    const fn2 = () => shared.get("reset")

    expect(fn).to.throw(Error)
    expect(fn2).to.throw(Error)
  })

  it("Overrides a key if it already exists.", () => {
    shared.set({ foo: "bar" })
    expect(shared.get("foo")).to.eql("bar")
    shared.set({ foo: "baz" })
    expect(shared.get("foo")).to.eql("baz")
  })

  it("Gets a value with a break line.", () => {
    shared.set({ foo: "bar" })
    expect(shared.getWithStartingBreakLine("foo")).to.eql("<br>bar")
  })
})
