import { reduce } from "lodash"

export default (props, preffix, suffix) => {
  props = props.split('.')

  return (d) => {
    const position = reduce(props, (memo, property) => memo[property], d)

    return (preffix || suffix) ? preffix + position + suffix : position
  }
}
