export default (text, predicate) => {
  const codeRegex = /``([\s\S]*?)``([\s\S]*?)``/g

  if (text) {
    const allMatches = text.match(codeRegex)

    return text.replace(codeRegex, (matchStr, language, codeBlock) => {
      return predicate({ allMatches, codeBlock, language, matchStr })
    })
  } else {
    return text
  }
}
