import newLayer from "../newLayer"
import idsHandler from "../idsHandler"

describeStd(__filename, () => {
  afterEach(function() {
    idsHandler.reset()
  })

  it("Returns the expected object. (2cfd54)", () => {
    const init = ["foo"]
    const expected = { id: "layer-1-auto", text: "foo" }
    const actual = newLayer(...init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected object. (0c7f66)", () => {
    const init = ["foo", "cn"]
    const expected = { connectedWithNext: true, id: "layer-1-auto", text: "foo" }
    const actual = newLayer(...init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected object. (4c8c69)", () => {
    const init = ["foo", [newLayer("bar")]]
    const expected = { id: "layer-2-auto", items: [
      { id: "layer-1-auto", text: "bar" },
    ], text: "foo" }
    const actual = newLayer(...init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected object. (ee7793)", () => {
    const init = ["foo", { id: "bar" }]
    const expected = { id: "bar", text: "foo" }
    const actual = newLayer(...init)

    expect(actual).to.eql(expected)
  })
})
