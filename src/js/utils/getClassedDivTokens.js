import { assoc, reduce } from "ramda"

import {
  CLASSED_DIV_TOKEN_FIRST,
  CLASSED_DIV_TOKEN_SECOND,
  CLASSED_DIV_TOKEN_THIRD,
  TOKENS_REPLACED_LEVELS,
} from "../constants"

const generateClassedDivTokens = (number) => {
  const firstToken = `${CLASSED_DIV_TOKEN_FIRST}${number}`
  const secondToken = `${CLASSED_DIV_TOKEN_SECOND}${number}`
  const thirdToken = `${CLASSED_DIV_TOKEN_THIRD}${number}`

  return {
    firstToken,
    regexp: new RegExp(`${firstToken}(.*?)${secondToken}(.*?)${thirdToken}`, "gm"),
    secondToken,
    thirdToken,
  }
}

const addLevelToTokens = (acc, lvl) => assoc(`lvl${lvl}Tkns`, generateClassedDivTokens(lvl), acc)
const tokens = reduce(addLevelToTokens, {}, TOKENS_REPLACED_LEVELS)

export default () => tokens
