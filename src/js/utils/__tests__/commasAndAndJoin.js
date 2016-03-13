import commasAndAndJoin from "../commasAndAndJoin"

describeStd(__filename, () => {
  it("Joins an array with commas and a last `and`.", () => {
    const result = commasAndAndJoin([1, 2, 3])

    expect(result).to.eql("1, 2 and 3")
  })
})
