import { forEach } from "ramda"

import d from 'diagrams'

import helpers from './helpers'
import { getCreationFn } from './creation'
import { diagramName } from "./constants"

class Box extends d.Diagram {
  create(...args) {
    getCreationFn(this)(...args)
  }

  setRelationships(items, container) {
    forEach((item) => {
      this.generateEmptyRelationships(item)

      if (container) {
        this.addDependantRelationship(container, item.textG, item)
        this.addDependencyRelationship(item, container.textG, container)
      }

      if (item.items && item.items.length > 0) this.setRelationships(item.items, item)
    })(items)
  }
}

export default () => {
  return new Box({
    helpers,
    name: diagramName,
  })
}
