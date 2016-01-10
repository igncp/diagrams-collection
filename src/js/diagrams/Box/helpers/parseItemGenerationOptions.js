const { each, isString } = _

export default (options) => {
  let parsedOptions

  if (isString(options)) {
    options = options.split(' ')
    parsedOptions = {}
    each(options, (optionsKey) => {
      // option-one -> optionOne
      const newKey = optionsKey
        .replace(/-([a-z])/g, g => g[1].toUpperCase())

      parsedOptions[newKey] = true
    })
  } else parsedOptions = options

  return parsedOptions
}
