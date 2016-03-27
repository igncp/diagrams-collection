import d from "diagrams"

import { diagramName } from "../constants"

export default (generalData) => {
  return d.utils.dataFromGeneralToSpecificForATreeStructureType(
    global.alert,
    diagramName,
    generalData
  )
}
