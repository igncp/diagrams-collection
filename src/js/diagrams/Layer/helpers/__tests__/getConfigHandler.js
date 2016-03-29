import getConfigHandler from "../getConfigHandler"

describeStd(__filename, () => {
  it("Returns the handler.", () => {
    expect(getConfigHandler).to.be.a("function")
    expect(getConfigHandler()).to.be.an("object")
  })
  describe("getConfigHandler()", () => {
    let handler

    beforeEach(function() {
      getConfigHandler().setDefault()
      handler = getConfigHandler()
    })

    it("Has .get() that returns the config reference.", () => {
      const config = handler.get()

      expect(config.foo).to.be.undefined

      config.foo = "bar"

      expect(handler.get().foo).to.eql("bar")
    })

    it("Has .setDefault() that returns to the original configuration.", () => {
      const config = handler.get()

      expect(config.foo).to.be.undefined
      config.foo = "bar"
      expect(handler.get().foo).to.eql("bar")
      handler.setDefault()
      expect(handler.get().foo).to.be.undefined
    })
  })
})
