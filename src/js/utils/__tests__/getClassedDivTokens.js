import { forEach, keys } from "ramda"

import getClassedDivTokens from "../getClassedDivTokens"

describeStd(__filename, () => {
  it("Returns an object.", () => {
    const actual = getClassedDivTokens()

    expect(actual).to.be.an("object")
  })

  it("Has the expected key format", () => {
    const expectedKeyFormatRegExp = /^lvl[0-9]+?Tkns$/
    const classedDivTokens = getClassedDivTokens()
    const classedDivTokensKeys = keys(classedDivTokens)

    forEach((classedDivTokensKey) => {
      expect(classedDivTokensKey).to.match(expectedKeyFormatRegExp)
    })(classedDivTokensKeys)
  })

  it("Have the expected values", () => {
    const classedDivTokens = getClassedDivTokens()
    const classedDivTokensKeys = keys(classedDivTokens)

    forEach((classedDivTokensKey) => {
      const classedDivToken = classedDivTokens[classedDivTokensKey]

      expect(classedDivToken).to.include.keys([
        "firstToken", "secondToken", "thirdToken", "regexp",
      ])
    })(classedDivTokensKeys)
  })
})
