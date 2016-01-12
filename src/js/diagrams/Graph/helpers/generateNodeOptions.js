import generateNodeOptions from './generateNodeOptions'

const { each, isArray, isString } = _

export default (options) => {
  const obj = {}
  let shape

  if (isString(options)) return generateNodeOptions(options.split(' '))
  else if (isArray(options)) {
    each(options, (opt) => {
      if (opt.substr(0, 2) === 's-') {
        shape = opt.substr(2, opt.length - 2)
        if (shape === 't') obj.shape = 'triangle'
        else if (shape === 's') obj.shape = 'square'
        else obj.shape = 'circle'

      } else if (opt === 'b') obj.bold = true
      else if (opt.substr(0, 2) === 'l~') obj.linkToUrl = opt.substr(2, opt.length - 2)
    })

    return obj
  }
}
