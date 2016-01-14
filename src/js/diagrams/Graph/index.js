import d from 'diagrams'
import helpers from './helpers'

import { getCreationFn } from './creation'

const SHY_CONNECTIONS = 'Show connections selectively'
const GRAPH_ZOOM = 'dia graph zoom'
const GRAPH_DRAG = 'Drag nodes on click (may make links difficult)'
const CURVED_ARROWS = 'All arrows are curved'
const graphZoomConfig = {
  private: true,
  type: Number,
  value: 1,
}

export default () => {
  const Graph = class Graph extends d.Diagram {
    create(...args) {
      getCreationFn(this)(...args)
    }
  }

  new Graph({
    configuration: {
      [CURVED_ARROWS]: false,
      [GRAPH_DRAG]: false,
      [GRAPH_ZOOM]: graphZoomConfig,
      [SHY_CONNECTIONS]: true,
      info: null,
    },
    configurationKeys: {
      SHY_CONNECTIONS,
    },
    helpers,
    name: 'graph',
  })
}
