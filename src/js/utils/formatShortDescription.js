import { compose, partialRight, replace } from "ramda"

import replaceCodeFragmentOfText from "./replaceCodeFragmentOfText"
import { startsWithEditedDescriptionToken } from "./editedDescriptionTokenHandler"

const replaceCodeFragemntFn = ({ codeBlock, matchStr, text }) =>
  (matchStr === text && /\n/.test(matchStr) === false)
    ? codeBlock : ' <CODE...>'

export default (text) => {
  if (startsWithEditedDescriptionToken(text)) return "(...)"

  return compose(
    partialRight(replaceCodeFragmentOfText, [replaceCodeFragemntFn]),
    replace(/<\/p>/g, '. '),
    replace(/<br>/g, ' '),
    replace(/<p>/g, '')
  )(text)
}
