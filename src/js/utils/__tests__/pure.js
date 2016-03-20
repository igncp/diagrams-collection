/* eslint max-nested-callbacks:0 */

import { each, refToProp } from "../pure"

describeStd(__filename, () => {
  describe("each", () => {
    it("Provides an index to the used function.", () => {
      each((value, index) => {
        expect(index).to.eql(value - 1)
      })([1, 2, 3, 4])
    })
  })

  describe("refToProp", () => {
    it("Is a function.", () => {
      expect(refToProp).to.be.a("function")
    })

    it("Renames property of object.", () => {
      const fn = refToProp("foo", "bar")

      const init = { foo: "baz" }
      const expected = { bar: "baz", foo: "baz" }
      const actual = fn(init)

      expect(actual).to.eql(expected)
    })

    it("Is curried.", () => {
      const fn = refToProp("foo")("bar")

      const init = { foo: "baz" }
      const expected = { bar: "baz", foo: "baz" }
      const actual = fn(init)

      expect(actual).to.eql(expected)
    })
  })
})
