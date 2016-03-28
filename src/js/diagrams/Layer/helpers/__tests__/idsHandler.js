import idsHandler from "../idsHandler"

describeStd(__filename, () => {
  afterEach(function() {
    idsHandler.reset()
  })
  it("Can increase the value.", () => {
    expect(idsHandler.increase()).to.eql(1)
    expect(idsHandler.increase()).to.eql(2)
  })
  it("Can reset the value.", () => {
    expect(idsHandler.increase()).to.eql(1)
    expect(idsHandler.reset()).to.eql(0)
    expect(idsHandler.increase()).to.eql(1)
  })
})
