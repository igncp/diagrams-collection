import { compose, omit } from "ramda"

import { dataFromGeneralToSpecificForATreeStructureType, pure } from "../../../utils"
const { refToProp } = pure

export default (generalData) => {
  return compose(
    omit(["text", "items"]),
    refToProp("text", "name"),
    refToProp("items", "body"),
    dataFromGeneralToSpecificForATreeStructureType
  )(generalData)
}
