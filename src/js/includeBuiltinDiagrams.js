import { forEach, keys } from "ramda"

import { diagramFactoryMap } from "./diagram"
import d from "./diagrams"

export default () => {
  forEach((diagramName) => {
    const diagramFactoryCreator = require(`diagrams/${diagramName}/index`)
    const diagramFactory = diagramFactoryCreator()

    diagramFactory.register()
  })([
    'Box', 'Graph', 'Layer',
  ])

  const diagramFactoriesKeys = keys(diagramFactoryMap)

  forEach((diagramFactoriesKey) => {
    d[diagramFactoriesKey] = diagramFactoryMap[diagramFactoriesKey]
  })(diagramFactoriesKeys)
}
