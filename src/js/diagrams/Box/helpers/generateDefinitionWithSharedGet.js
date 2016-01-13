import d from 'diagrams'
import generateDefinition from './generateDefinition'

export default (text, preffix = '') => {
  const sharedKey = preffix + text.split('(')[0]

  return generateDefinition(text, d.shared.get(sharedKey))
}
