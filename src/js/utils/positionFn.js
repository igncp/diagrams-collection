import d3DefaultReturnFn from "./d3DefaultReturnFn"

export default (props, offset) => {
  offset = offset || 0

  return d3DefaultReturnFn(props, 0, offset)
}
