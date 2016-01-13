import idOpt from "./idOpt"
import getStaticOptsLetters from "./getStaticOptsLetters"
import connectWithOpt from "./connectWithOpt"

const { each, extend, isObject } = _

export default (...args) => {
  let result = {}

  each(args, (arg) => {
    if (typeof(arg) === 'string') {
      each(arg.split(' '), (opt) => {
        if (opt.substr(0, 3) === 'id-')
          result = extend(result, idOpt(opt.substr(3, opt.length)))
        else if (opt.substr(0, 3) === 'ct-')
          connectWithOpt(Number(opt.substr(3, opt.length)), result)
        else if (opt.substr(0, 4) === 'ctd-')
          connectWithOpt(Number(opt.substr(4, opt.length)), result, 'dashed')
        else result = extend(result, getStaticOptsLetters()[opt])
      })
    } else if (isObject(arg)) {
      result = extend(result, arg)
    }
  })

  return result
}
