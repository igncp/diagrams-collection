import applySimpleTransform from "../applySimpleTransform"

const elStub = {
  attr: stub(),
}

describeStd(__filename, () => {
  beforeEach(() => {
    elStub.attr.reset()
    applySimpleTransform(elStub)
  })

  it("Adds a transform: translate attr.", () => {
    expect(elStub.attr).to.have.been.calledOnce
    expect(elStub.attr.calledWith("transform")).to.be.ok
  })

  it("The provided function adds a proper translate.", () => {
    const fn = elStub.attr.args[0][1]
    const result = fn({ x: 1, y: 2 })

    expect(result).to.eql(`translate(1,2)`)
  })
})
