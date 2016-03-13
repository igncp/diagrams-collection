import { curry } from "ramda"

import { UNPROCESSED_CODE_FRAGMENT_REGEXP } from "../constants"

export default curry((text, predicate) => {
  if (!text) return ""

  const allMatches = text.match(UNPROCESSED_CODE_FRAGMENT_REGEXP)

  return text.replace(UNPROCESSED_CODE_FRAGMENT_REGEXP, (matchStr, language, codeBlock) => {
    return predicate({ allMatches, codeBlock, language, matchStr, text })
  })
})
