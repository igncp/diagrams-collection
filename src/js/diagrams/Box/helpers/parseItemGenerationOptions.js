import {
  assoc, compose, nth, is, split, toUpper, reduce,
} from "ramda"

const isString = is(String)
const secondUppercased = compose(toUpper, nth(1))

// option-one -> optionOne
const reduceOptionsArr = (parsedOptions, optionsKey) => {
  const newKey = optionsKey
    .replace(/-([a-z])/g, secondUppercased)

  return assoc(newKey, true, parsedOptions)
}

const getParsedOptionsOfStrType = compose(
  reduce(reduceOptionsArr, {}),
  split(' ')
)

export default (options) => {
  options = options || {}

  return isString(options)
    ? getParsedOptionsOfStrType(options)
    : options
}
