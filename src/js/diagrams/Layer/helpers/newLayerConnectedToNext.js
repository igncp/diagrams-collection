import newLayer from './newLayer'

export default (...args) => {
  const argsLength = args.length

  if (argsLength === 1) return newLayer(args[0], 'cn')
  else if (argsLength === 2) {
    if (typeof(args[1]) === 'object')
      return newLayer(args[0], 'cn', args[1])
    else if (typeof(args[1] === 'string'))
      return newLayer(args[0], `${args[1]} cn`)
  } else if (argsLength === 3)
    return newLayer(args[0], `${args[1]} cn`, args[2])
}
