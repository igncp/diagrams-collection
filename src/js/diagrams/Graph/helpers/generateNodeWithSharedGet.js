import d from 'diagrams'
import generateNode from './generateNode'

export default () => {
  const text = arguments[0]
  let sharedKey, preffix, options

  preffix = (arguments.length > 2) ? arguments[2] : ''
  sharedKey = preffix + text.split('(')[0]
  options = (arguments.length > 3) ? arguments[3] : null

  return generateNode(text, arguments[1], d.shared.get(sharedKey), options)
}
