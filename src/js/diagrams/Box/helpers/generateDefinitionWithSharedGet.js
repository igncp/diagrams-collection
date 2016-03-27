import { shared } from 'diagrams'
import generateDefinition from './generateDefinition'

export default (text, preffix = '') => {
  const sharedKey = preffix + text.split('(')[0]
  const sharedValue = shared.get(sharedKey)

  return generateDefinition(text, sharedValue)
}
