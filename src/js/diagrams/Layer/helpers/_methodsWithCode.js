import d from "diagrams"
import { isArrayLike } from "ramda"

const getCodeParsed = (codeFn, code) => {
  const rawCode = (isArrayLike(code)) ? code.join("\n") : code

  return codeFn(rawCode)
}

export default (helpers, helpersMethod) => {
  helpers[`${helpersMethod}WithCode`] = (codeLanguage) => {
    const codeFn = d.utils.codeBlockOfLanguageFn(codeLanguage)

    return function(...args) {
      args[0] = getCodeParsed(codeFn, args[0])

      return helpers[helpersMethod](...args)
    }
  }

  helpers[`${helpersMethod}WithParagraphAndCode`] = (codeLanguage) => {
    const codeFn = d.utils.codeBlockOfLanguageFn(codeLanguage)

    return function(...args) {
      const paragraphText = args[0]
      const code = args[1]
      const text = d.utils.wrapInParagraph(paragraphText) + getCodeParsed(codeFn, code)

      args = args.splice(2)
      args.unshift(text)

      return helpers[helpersMethod].apply(this, args)
    }
  }
}
