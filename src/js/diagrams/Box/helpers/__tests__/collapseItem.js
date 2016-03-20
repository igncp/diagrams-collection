import collapseItem from "../collapseItem"

describeStd(__filename, () => {
  it("Is a function.", () => {
    expect(collapseItem).to.be.a("function")
  })

  it("Requires an item with an items with length.", () => {
    expect(() => collapseItem({})).to.throw
    expect(() => collapseItem({ items: 1 })).to.throw
  })

  it("Empties the items property.", () => {
    const item = { items: [{}, {}] }

    collapseItem(item)
    expect(item.items).to.eql([])
  })

  it("Adds the items to collapsedItems.", () => {
    const items = [{ foo: "foo" }, { bar: "bar" }]
    const item = { items }

    collapseItem(item)
    expect(item.collapsedItems).to.eql(items)
  })
})
