import helpers from "../helpers"

const { resetAll, mockReplacing } = helpers

function createResetableFn() {
  const fn = () => null
  fn.reset = spy()
  return fn
}

describeStd(__filename, () => {
  describe("resetAll", () => {
    it("Calls the reset method where expected.", () => {
      const init = {
        bar: () => null,
        baz: null,
        foo: createResetableFn(),
      }
      resetAll(init)

      expect(init.foo.reset).to.have.been.calledOnce
    })

    it("Calls the reset method only at the first level.", () => {
      const init = {
        bar: { baz: createResetableFn() },
        foo: createResetableFn(),
      }
      resetAll(init)

      expect(init.foo.reset).to.have.been.calledOnce
      expect(init.bar.baz.reset).not.to.have.been.called
    })

    it("Acceps an array of resetable objects", () => {
      const init = [
        { foo: createResetableFn() },
        { bar: createResetableFn() },
      ]
      resetAll(init)

      expect(init[0].foo.reset).to.have.been.calledOnce
      expect(init[1].bar.reset).to.have.been.calledOnce
    })
  })

  describe("mockReplacing", () => {
    it("Returns a function.", () => {
      const context = {}
      const resetFn = mockReplacing(context, [])
      expect(resetFn).to.be.a("function")
    })

    it("Stores the old variable in the context with the correct value.", () => {
      const context = {}
      const container = { foo: "bar" }
      mockReplacing(context, [
        [container, "foo", "baz"],
      ])
      expect(context.previous_foo).to.eql("bar")
    })

    it("Stores the new variable in the container with the correct value.", () => {
      const context = {}
      const container = { foo: "bar" }
      mockReplacing(context, [
        [container, "foo", "baz"],
      ])
      expect(container.foo).to.eql("baz")
    })

    it("The restore function restores everything to the initial state.", () => {
      const context = {}
      const container = { foo: "bar" }
      const resetFn = mockReplacing(context, [
        [container, "foo", "baz"],
      ])
      resetFn()
      expect(context).to.eql({})
      expect(container).to.eql({ foo: "bar" })
    })
  })
})
