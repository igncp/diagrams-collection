import triggerElIdHandler from "../triggerElIdHandler"

describeStd(__filename, () => {
  beforeEach(triggerElIdHandler.reset)
  afterEach(triggerElIdHandler.reset)

  it("Is an object.", () => {
    expect(triggerElIdHandler).to.be.an("object")
  })

  it("Has the expected properties.", () => {
    expect(triggerElIdHandler).to.have.all.keys(["get", "increase", "reset"])
  })

  it("Should start at 0 (after it has reseted).", () => {
    expect(triggerElIdHandler.get()).to.eql(0)
  })

  it("Should increase when calling increase.", () => {
    expect(triggerElIdHandler.get()).to.eql(0)
    triggerElIdHandler.increase()
    expect(triggerElIdHandler.get()).to.eql(1)
    triggerElIdHandler.increase()
    expect(triggerElIdHandler.get()).to.eql(2)
    triggerElIdHandler.increase()
    expect(triggerElIdHandler.get()).to.eql(3)
  })

  it("Should have a reset property that works.", () => {
    expect(triggerElIdHandler.get()).to.eql(0)
    triggerElIdHandler.increase()
    expect(triggerElIdHandler.get()).to.eql(1)
    triggerElIdHandler.reset()
    expect(triggerElIdHandler.get()).to.eql(0)
  })
})
