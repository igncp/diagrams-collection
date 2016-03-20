import addBodyItemsAndUpdateHeights from "../addBodyItemsAndUpdateHeights"

describe("addBodyItemsAndUpdateHeights", () => {
  beforeEach(function() {
    addBodyItemsAndUpdateHeights.set(null)
  })
  it("Can set and run the fn.", () => {
    const spyFn = spy()

    addBodyItemsAndUpdateHeights.set(spyFn)
    addBodyItemsAndUpdateHeights.run()

    expect(spyFn).to.have.been.calledOnce
  })
})
