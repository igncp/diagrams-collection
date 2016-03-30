import idsHandler from "../idsHandler"
import handleConnectedToNextCaseIfNecessary from "../handleConnectedToNextCaseIfNecessary"

describeStd(__filename, () => {
  afterEach(function() {
    idsHandler.reset()
  })

  it("The layers are not mutated if unnecessary. (c74c87)", () => {
    const layers = [{ foo: "bar" }, { bar: "baz" }]
    const currentIndex = 0

    handleConnectedToNextCaseIfNecessary(layers, currentIndex)
    expect(layers).to.eql([{ foo: "bar" }, { bar: "baz" }])
  })

  it("The layers are not mutated if unnecessary. (68900e)", () => {
    const layers = [{ foo: "bar" }, { bar: "baz", connectedWithNext: true }]
    const currentIndex = 1

    handleConnectedToNextCaseIfNecessary(layers, currentIndex)
    expect(layers).to.eql([{ foo: "bar" }, { bar: "baz", connectedWithNext: true }])
  })

  it("Mutates the layers correctly when necessary. (a42c9d)", () => {
    const layers = [
      { connectedWithNext: true },
      { id: "baz" },
    ]
    const currentIndex = 0

    handleConnectedToNextCaseIfNecessary(layers, currentIndex)
    expect(layers).to.eql([
      { connectedTo: ["baz"], connectedWithNext: true },
      { id: "baz" },
    ])
  })

  it("Mutates the layers correctly when necessary. (fa1021)", () => {
    const layers = [
      { connectedWithNext: { type: "foo" } },
      { id: "baz" },
    ]
    const currentIndex = 0

    handleConnectedToNextCaseIfNecessary(layers, currentIndex)
    expect(layers).to.eql([
      { connectedTo: [{ id: "baz", type: "foo" }], connectedWithNext: { type: "foo" } },
      { id: "baz" },
    ])
  })

  it("Mutates the layers correctly when necessary. (fb9ddc)", () => {
    const layers = [
      { connectedTo: ["foo"], connectedWithNext: true },
      { id: "bar" },
    ]
    const currentIndex = 0

    handleConnectedToNextCaseIfNecessary(layers, currentIndex)
    expect(layers).to.eql([
      { connectedTo: ["foo", "bar"], connectedWithNext: true },
      { id: "bar" },
    ])
  })

  it("Mutates the layers correctly when necessary. (d33a52)", () => {
    const layers = [
      { connectedWithNext: true },
      { foo: "bar" },
    ]
    const currentIndex = 0

    handleConnectedToNextCaseIfNecessary(layers, currentIndex)
    expect(layers).to.eql([
      { connectedTo: ["to-next-1"], connectedWithNext: true },
      { foo: "bar", id: "to-next-1" },
    ])
  })
})
