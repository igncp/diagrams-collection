import joinWithLastDifferent from "../joinWithLastDifferent"

describeStd(__filename, () => {
  it("Produces the expected result.", () => {
    const init = [["a", "b", "c"], "_", "-"]
    const expected = "a_b-c"
    const actual = joinWithLastDifferent(...init)

    expect(actual).to.eql(expected)
  })
})
