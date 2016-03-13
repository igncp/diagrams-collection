import {
  __, compose, curry, last, reduce, replace,
} from "ramda"

import { TAGS_TO_ENCODE, TOKENS_REPLACED_LEVELS } from "../constants"

import replaceCodeFragmentOfText from "./replaceCodeFragmentOfText"
import getClassedDivTokens from "./getClassedDivTokens"
import { removeEditedDescriptionToken } from "./editedDescriptionTokenHandler"

export default (text = '') => {
  return compose(
    getTextWithTokensReplaced,
    encodeOrDecodeTags('decode'),
    encodeCarets,
    encodeOrDecodeTags('encode'),
    wrapCodeBlocksWithHTML,
    removeEditedDescriptionToken
  )(text)
}

const encodeCarets = compose(replace(/>/g, '&gt;'), replace(/</g, '&lt;'))

const tokens = getClassedDivTokens()

const getTextWithTokensReplacedForLevel = (text, level) => {
  const token = tokens[`lvl${level}Tkns`]

  return text.replace(token.regexp, `<div class="$1">$2</div>`)
}

const getTextWithTokensReplaced = reduce(
  getTextWithTokensReplacedForLevel, __, TOKENS_REPLACED_LEVELS
)

const replaceWithRegExp = function(replacedText, from, to) {
  return replacedText.replace(new RegExp(from, 'g'), to)
}

const encodeOrDecodeTag = curry((text, action, tag) => {
  const beginningTagArr = [
    `<${tag}(.*?)>`,
    `<${tag}$1>`,
    `${tag}DIAGSA(.*?)DIAGSB${tag}DIAGSC`,
    `${tag}DIAGSA$1DIAGSB${tag}DIAGSC`,
  ]
  const endingTagReal = `</${tag}>`
  const endingTagFake = `${tag}ENDREPLACEDDIAGRAMS`
  const endingTagArr = [endingTagReal, endingTagReal, endingTagFake, endingTagFake]

  return reduce((newText, arr) => {
    if (action === 'encode') return replaceWithRegExp(newText, arr[0], arr[3])
    else if (action === 'decode') return replaceWithRegExp(newText, arr[2], arr[1])
  }, text, [beginningTagArr, endingTagArr])
})

const encodeOrDecodeTags = curry((action, text) => {
  return reduce(encodeOrDecodeTag(__, action, __), text, TAGS_TO_ENCODE)
})

const wrapCodeBlocksWithHTML = replaceCodeFragmentOfText(__, ({
  allMatches, codeBlock, language, matchStr,
}) => {
  const isLastMatch = (matchStr === last(allMatches))

  return `<pre${(isLastMatch ? ' class="last-code-block" ' : '')}><code>`
    + `${hljs.highlight(language, codeBlock).value}</pre></code>`
})
