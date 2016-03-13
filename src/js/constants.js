import { compose, inc, map, range, reverse } from "ramda"

const TOKENS_REPLACED_LEVELS_NUMBER = 5

const TAGS_TO_ENCODE = ['strong', 'code', 'pre', 'br', 'span', 'p']

// [1, 2, ..., TOKENS_REPLACED_LEVELS_NUMBER ]
const TOKENS_REPLACED_LEVELS = compose(
  reverse, map(inc), range(0)
)(TOKENS_REPLACED_LEVELS_NUMBER)

const CLASSED_DIV_TOKEN_FIRST = "{diagrams-classed-div}"
const CLASSED_DIV_TOKEN_SECOND = "{:diagrams-classed-div}"
const CLASSED_DIV_TOKEN_THIRD = "{::diagrams-classed-div}"
const UNPROCESSED_CODE_FRAGMENT_REGEXP = /``([\s\S]*?)``([\s\S]*?)``/g

export default {
  CLASSED_DIV_TOKEN_FIRST,
  CLASSED_DIV_TOKEN_SECOND,
  CLASSED_DIV_TOKEN_THIRD,
  TAGS_TO_ENCODE,
  TOKENS_REPLACED_LEVELS,
  UNPROCESSED_CODE_FRAGMENT_REGEXP,
}
