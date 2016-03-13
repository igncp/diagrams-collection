import { forEach } from "ramda"

import d from 'diagrams'

import helpers from './helpers'
import { getCreationFn } from './creation'

class Box extends d.Diagram {
  create(...args) {
    getCreationFn(this)(...args)
  }

  setRelationships(items, container) {
    const diagram = this

    forEach((item) => {
      diagram.generateEmptyRelationships(item)

      if (container) {
        diagram.addDependantRelationship(container, item.textG, item)
        diagram.addDependencyRelationship(item, container.textG, container)
      }

      if (item.items && item.items.length > 0) diagram.setRelationships(item.items, item)
    })(items)
  }
}

export default () => {
  new Box({
    helpers,
    name: 'box',
  })
}
