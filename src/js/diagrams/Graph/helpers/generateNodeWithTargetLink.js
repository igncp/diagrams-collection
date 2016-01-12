import generateNode from './generateNode'

const { isUndefined } = _

export default (file, target) => {
  return (...args) => {
    if (isUndefined(args[3])) args[3] = ''
    else args[3] += ' '
    args[3] += `l~${file}?target=${encodeURIComponent(target)}`

    return generateNode.apply({}, args)
  }
}
