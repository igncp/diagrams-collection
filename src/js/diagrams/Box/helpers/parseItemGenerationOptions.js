import { isString, reduce } from "lodash"

const getParsedOptionsOfStrCase = (optionsStr) => {
  const options = optionsStr.split(' ')

  return reduce(options, (parsedOptions, optionsKey) => {
    // option-one -> optionOne
    const newKey = optionsKey
      .replace(/-([a-z])/g, g => g[1].toUpperCase())

    parsedOptions[newKey] = true
  }, {})
}

export default (options) => {
  let parsedOptions

  options = options || {}

  if (isString(options)) {
    parsedOptions = getParsedOptionsOfStrCase(options)
  } else parsedOptions = options

  return parsedOptions
}
