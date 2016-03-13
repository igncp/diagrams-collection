import { is } from "ramda"

const isString = is(String)

export default (language, commentsSymbol = '') => {
  return function(codeBlock, position, withInlineStrs) {
    if (withInlineStrs === true) {
      codeBlock = `${commentsSymbol} ...\n${codeBlock}\n${commentsSymbol} ...`
    }

    if (isString(position)) codeBlock = `${commentsSymbol} @${position}\n${codeBlock}`

    return `\`\`${language}\`\`${codeBlock}\`\``
  }
}
