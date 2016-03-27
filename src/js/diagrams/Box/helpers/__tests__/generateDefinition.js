import generateDefinition from "../generateDefinition"
import { defaultOptions } from "../../constants"

describeStd(__filename, () => {
  it("Returns the expected object. (9c528e)", () => {
    const init = ["foo"]
    const expected = {
      items: [],
      options: defaultOptions,
      text: "foo",
    }
    const actual = generateDefinition(...init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected object. (bc1544)", () => {
    const init = ["foo", "bar"]
    const expected = {
      description: "bar",
      items: [],
      options: defaultOptions,
      text: "foo",
    }
    const actual = generateDefinition(...init)

    expect(actual).to.eql(expected)
  })
})
