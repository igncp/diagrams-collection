import { forEach } from "ramda"
import { isArray, last, partial } from "lodash"

import each from "./each"
import replaceCodeFragmentOfText from "./replaceCodeFragmentOfText"
import getClassedDivTokens from "./getClassedDivTokens"
import { removeEditedDescriptionToken } from "./editedDescriptionTokenHandler"

const tokens = getClassedDivTokens()

const getTextWithTokensReplaced = (text, level) => {
  const token = tokens[`lvl${level}Tkns`]

  return text.replace(token.regexp, `<div class="$1">$2</div>`)
}

export default (text = '') => {
  const tagsToEncode = ['strong', 'code', 'pre', 'br', 'span', 'p']
  const encodeOrDecodeTags = (action, tag) => {
    const encodeOrDecodeTagsWithAction = partial(encodeOrDecodeTags, action)
    const beginningTagArr = [
      `<${tag}(.*?)>`,
      `<${tag}$1>`,
      `${tag}DIAGSA(.*?)DIAGSB${tag}DIAGSC`,
      `${tag}DIAGSA$1DIAGSB${tag}DIAGSC`,
    ]
    const endingTagReal = `</${tag}>`
    const endingTagFake = `${tag}ENDREPLACEDDIAGRAMS`
    const endingTagArr = [endingTagReal, endingTagReal, endingTagFake, endingTagFake]
    const replaceText = function(from, to) {
      text = text.replace(new RegExp(from, 'g'), to)
    }

    if (isArray(tag)) each(encodeOrDecodeTagsWithAction)(tag)
    else {
      each((arr) => {
        if (action === 'encode') replaceText(arr[0], arr[3])
        else if (action === 'decode') replaceText(arr[2], arr[1])
      })([beginningTagArr, endingTagArr])
    }
  }

  text = removeEditedDescriptionToken(text)

  text = replaceCodeFragmentOfText(text,
    ({ allMatches, codeBlock, language, matchStr }) => {
      const lastMatch = (matchStr === last(allMatches))

      return `<pre${(lastMatch ? ' class="last-code-block" ' : '')}><code>`
        + `${hljs.highlight(language, codeBlock).value}</pre></code>`
    })

  encodeOrDecodeTags('encode', tagsToEncode)
  text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  encodeOrDecodeTags('decode', tagsToEncode)

  forEach((i) => {
    text = getTextWithTokensReplaced(text, i)
  })([1, 2, 3, 4, 5].reverse())

  return text
}
