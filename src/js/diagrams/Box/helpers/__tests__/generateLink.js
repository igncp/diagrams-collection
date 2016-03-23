import { merge } from "ramda"

import generateLink from "../generateLink"
import { defaultOptions } from "../../constants"

describeStd(__filename, () => {
  it("Returns the expected format of item. (2e791b)", () => {
    const init = ["foo"]
    const expected = {
      items: null,
      options: merge(defaultOptions, {
        isLink: true,
      }),
      text: "foo",
    }
    const actual = generateLink(...init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected format of item. (39d35b)", () => {
    const init = ["foo", "bar"]
    const expected = {
      description: "bar",
      items: null,
      options: merge(defaultOptions, {
        isLink: true,
      }),
      text: "foo",
    }
    const actual = generateLink(...init)

    expect(actual).to.eql(expected)
  })
})
