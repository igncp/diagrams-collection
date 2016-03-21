import { merge } from "ramda"

import generateItem from "../generateItem"
import { defaultOptions } from "../../constants"

describeStd(__filename, () => {
  it("Returns the expected format of item. (b93a04)", () => {
    const init = {
      text: "foo",
    }
    const expected = {
      items: [],
      options: defaultOptions,
      text: "foo",
    }
    const actual = generateItem(init)

    expect(actual).to.eql(expected)
  })

  it("Returns the expected format of item. (eafc8e)", () => {
    const init = {
      description: "bar",
      options: "not-completed",
      text: "foo",
    }
    const expected = {
      description: "bar",
      items: [],
      options: merge(defaultOptions, {
        notCompleted: true,
      }),
      text: "foo",
    }
    const actual = generateItem(init)

    expect(actual).to.eql(expected)
  })
})
