import createAnEventEmitter from "../createAnEventEmitter"

describeStd(__filename, () => {
  let instance

  beforeEach(() => {
    instance =createAnEventEmitter()
  })

  it("The instances have the expected method.", () => {
    expect(instance.emit).to.be.ok
    expect(instance.listen).to.be.ok
    expect(instance.unlisten).to.be.ok
    expect(instance.dispose).to.be.ok
  })

  it("listen -> emit works as expected.", () => {
    const listenSpy = spy()

    instance.listen("foo", listenSpy)
    expect(listenSpy).to.not.have.been.called
    instance.emit("foo")
    expect(listenSpy).to.have.been.calledOnce
  })

  it("listen -> dispose works as expected.", () => {
    const listenSpy = spy()

    instance.listen("foo", listenSpy)
    expect(listenSpy).to.not.have.been.called
    instance.emit("foo")

    expect(listenSpy).to.have.been.calledOnce
  })

  it("listen -> dispose works as expected.", () => {
    const listenSpy = spy()

    instance.listen("foo", listenSpy)
    instance.dispose()

    expect(listenSpy).to.not.have.been.called
  })
})
