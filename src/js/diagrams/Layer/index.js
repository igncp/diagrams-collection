import { each } from "lodash"

import d from 'diagrams'

import helpers from './helpers'
import { getCreationFn } from './creation'

export default () => {
  class Layer extends d.Diagram {
    create(...args) {
      getCreationFn(this)(...args)
    }

    generateRelationships(layers, containerLayer) {
      const diagram = this

      each(layers, (layer) => {
        diagram.generateEmptyRelationships(layer)
        diagram.addSelfRelationship(layer, layer.layerG, layer)

        if (containerLayer) {
          diagram.addDependantRelationship(containerLayer, layer.layerG, layer)
          diagram.addDependencyRelationship(layer, containerLayer.layerG, containerLayer)
        }

        if (layer.items && layer.items.length > 0) {
          diagram.generateRelationships(layer.items, layer)
        }
      })
    }
  }

  return new Layer({
    helpers,
    name: 'layer',
  })
}
