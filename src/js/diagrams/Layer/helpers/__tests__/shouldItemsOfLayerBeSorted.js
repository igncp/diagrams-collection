import shouldItemsOfLayerBeSorted from "../shouldItemsOfLayerBeSorted"

describeStd(__filename, () => {
  it("Returns true only if no items contain `connectedTo` or "
    + "`connectToNext` (equal true). (e2114e)", () => {
    const init = [{ foo: "bar" }, { baz: "bam" }]
    const expected = true
    const actual = shouldItemsOfLayerBeSorted(init)

    expect(actual).to.eql(expected)
  })

  it("Returns true only if no items contain `connectedTo` or "
    + "`connectToNext` (equal true). (e2f85f)", () => {
    const init = [{ foo: "bar" }, { connectToNext: true }]
    const expected = false
    const actual = shouldItemsOfLayerBeSorted(init)

    expect(actual).to.eql(expected)
  })

  it("Returns true only if no items contain `connectedTo` or "
    + "`connectToNext` (equal true). (400648)", () => {
    const init = [{ foo: "bar" }, { connectToNext: false }]
    const expected = true
    const actual = shouldItemsOfLayerBeSorted(init)

    expect(actual).to.eql(expected)
  })

  it("Returns true only if no items contain `connectedTo` or "
    + "`connectToNext` (equal true). (cdc5be)", () => {
    const init = [{ foo: "bar" }, { connectedTo: "foo" }]
    const expected = false
    const actual = shouldItemsOfLayerBeSorted(init)

    expect(actual).to.eql(expected)
  })
})
