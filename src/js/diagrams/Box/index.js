import { each } from "lodash"

import d from 'diagrams'

import helpers from './helpers'
import { getCreationFn } from './creation'

class Box extends d.Diagram {
  create(...args) {
    getCreationFn(this)(...args)
  }

  setRelationships(items, container) {
    const diagram = this

    each(items, (item) => {
      diagram.generateEmptyRelationships(item)

      if (container) {
        diagram.addDependantRelationship(container, item.textG, item)
        diagram.addDependencyRelationship(item, container.textG, container)
      }

      if (item.items && item.items.length > 0) diagram.setRelationships(item.items, item)
    })
  }
}

export default () => {
  new Box({
    helpers,
    name: 'box',
  })
}
