import { none } from "ramda"

export default (itemsArray) => {
  return none((item) => {
    return item.hasOwnProperty('connectedTo') || (item.connectToNext === true)
  }, itemsArray)
}
