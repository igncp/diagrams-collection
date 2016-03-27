import { codeBlockOfLanguageFn, wrapInParagraph } from "../../../utils"
import { isArrayLike } from "ramda"

const getCodeParsed = (codeFn, code) => {
  const rawCode = isArrayLike(code) ? code.join("\n") : code

  return codeFn(rawCode)
}

export default (helpers, helpersMethodName) => {
  return {
    [`${helpersMethodName}WithCode`]: (codeLanguage) => {
      const codeFn = codeBlockOfLanguageFn(codeLanguage)

      return function(...args) {
        const code = args[0]

        args[0] = getCodeParsed(codeFn, code)

        return helpers[helpersMethodName](...args)
      }
    },
    [`${helpersMethodName}WithParagraphAndCode`]: (codeLanguage) => {
      const codeFn = codeBlockOfLanguageFn(codeLanguage)

      return function(...args) {
        const paragraphText = args[0]
        const code = args[1]
        const text = wrapInParagraph(paragraphText) + getCodeParsed(codeFn, code)

        args = args.splice(2)
        args.unshift(text)

        return helpers[helpersMethodName].apply(this, args)
      }
    },
  }
}
