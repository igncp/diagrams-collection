import { path } from "ramda"

export default (props, preffix, suffix) => {
  props = props.split('.')

  return (d) => {
    const value = path(props)(d)

    return (preffix || suffix) ? preffix + value + suffix : value
  }
}
