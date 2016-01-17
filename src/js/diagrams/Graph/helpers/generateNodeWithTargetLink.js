import { isUndefined } from "lodash"

import generateNode from './generateNode'

export default (file, target) => {
  return (...args) => {
    if (isUndefined(args[3])) args[3] = ''
    else args[3] += ' '
    args[3] += `l~${file}?target=${encodeURIComponent(target)}`

    return generateNode.apply({}, args)
  }
}
