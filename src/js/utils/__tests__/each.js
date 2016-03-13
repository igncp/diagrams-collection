import each from "../each"

describeStd(__filename, () => {
  it("Provides an index to the used function.", () => {
    each((value, index) => {
      expect(index).to.eql(value - 1)
    })([1, 2, 3, 4])
  })
})
