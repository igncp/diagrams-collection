import { diagramName } from "../constants"
import dataFromGeneralToSpecificForATreeStructureType
  from "../../../utils/dataFromGeneralToSpecificForATreeStructureType"

export default (generalData) => {
  return dataFromGeneralToSpecificForATreeStructureType(
    global.alert,
    diagramName,
    generalData
  )
}
