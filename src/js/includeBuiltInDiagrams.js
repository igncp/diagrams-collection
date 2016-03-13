import { forEach, keys } from "ramda"

import { diagramFactoryMap } from "./diagram"
import d from "./diagrams"

export default () => {
  const requireAndRunDiagram = diagramName =>
    require(`diagrams/${diagramName}/index`)()

  forEach(requireAndRunDiagram)([
    'Box', 'Graph', 'Layer',
  ])

  const diagramFactoriesKeys = keys(diagramFactoryMap)

  forEach((diagramFactoriesKey) => {
    d[diagramFactoriesKey] = diagramFactoryMap[diagramFactoriesKey]
  })(diagramFactoriesKeys)
}
