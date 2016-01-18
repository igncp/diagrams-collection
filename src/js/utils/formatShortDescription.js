import replaceCodeFragmentOfText from "./replaceCodeFragmentOfText"

export default (text) => {
  text = text.replace(/<p>/g, '')
  text = text.replace(/<br>/g, ' ')
  text = text.replace(/<\/p>/g, '. ')
  text = replaceCodeFragmentOfText(text, ({ codeBlock, matchStr }) => {
    if (matchStr === text && /\n/.test(matchStr) === false) return codeBlock
    else {
      return ' <CODE...>'
    }
  })

  return text
}
