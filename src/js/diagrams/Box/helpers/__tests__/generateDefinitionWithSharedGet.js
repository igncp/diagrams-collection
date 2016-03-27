import { shared } from "diagrams"
import generateDefinitionWithSharedGet from "../generateDefinitionWithSharedGet"
import { defaultOptions } from "../../constants"

describeStd(__filename, () => {
  beforeEach(function() {
    shared.reset()
  })

  it("Returns the expected result without prefix.", () => {
    shared.set({ foo: "bar" })

    const init = ["foo(baz)"]
    const expected = {
      description: "bar",
      items: [],
      options: defaultOptions,
      text: "foo(baz)",
    }
    const actual = generateDefinitionWithSharedGet(...init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected result with prefix.", () => {
    shared.set({ fooBAR: "baz" })

    const init = ["BAR(baz)", "foo"]
    const expected = {
      description: "baz",
      items: [],
      options: defaultOptions,
      text: "BAR(baz)",
    }
    const actual = generateDefinitionWithSharedGet(...init)

    expect(actual).to.eql(expected)
  })
})
