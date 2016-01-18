import d3DefaultReturnFn from "./d3DefaultReturnFn"

export default (props, preffix, suffix) => {
  preffix = preffix || ''
  suffix = suffix || ''

  return d3DefaultReturnFn(props, preffix, suffix)
}
