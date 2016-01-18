import { is, forEach } from "ramda"

const isNumber = is(Number)

const first = "{diagrams-classed-div}"
const second = "{:diagrams-classed-div}"
const third = "{::diagrams-classed-div}"

const generateClassedDivTokens = (number) => {
  // More validations could be made
  if (!isNumber(number) || number < 1 || number > 5) {
    throw new Error('The number provided to this function must be a 1 '
      + '<= x <= 5 integer, as these are the checks done by diagrams-collections')
  }

  const firstToken = `${first}${number}`
  const secondToken = `${second}${number}`
  const thirdToken = `${third}${number}`

  return {
    firstToken,
    regexp: new RegExp(`${firstToken}(.*?)${secondToken}(.*?)${thirdToken}`, "gm"),
    secondToken,
    thirdToken,
  }
}

const tokens = {}
const checkedLvls = [1, 2, 3, 4, 5]
const addLevelToTokens = i => tokens[`lvl${i}Tkns`] = generateClassedDivTokens(i)

forEach(addLevelToTokens)(checkedLvls)

export default () => tokens
