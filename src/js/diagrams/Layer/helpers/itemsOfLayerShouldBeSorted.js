import { each } from "lodash"

export default (itemsArray) => {
  let ret = true

  each(itemsArray, (item) => {
    if (item.hasOwnProperty('connectedTo')) ret = false

    if (item.hasOwnProperty('connectToNext')) ret = false
  })

  return ret
}
