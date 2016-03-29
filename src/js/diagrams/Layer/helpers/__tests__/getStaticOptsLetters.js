import { __, all, compose, converge, equals, identity, prop, keys, lt, toLower } from "ramda"

import getStaticOptsLetters from "../getStaticOptsLetters"

describeStd(__filename, () => {
  it("Returns an object.", () => {
    const staticOptsLetters = getStaticOptsLetters()

    expect(staticOptsLetters).to.be.an("object")
  })

  it("The keys are lowercase.", () => {
    const staticOptsLetters = getStaticOptsLetters()
    const isLowercase = converge(equals, [identity, toLower])

    expect(all(isLowercase, keys(staticOptsLetters))).to.eql(true)
  })

  it("The keys have three characters max.", () => {
    const staticOptsLetters = getStaticOptsLetters()
    const has3CharsMax = compose(lt(__, 4), prop("length"))

    expect(all(has3CharsMax, keys(staticOptsLetters))).to.eql(true)
  })
})
