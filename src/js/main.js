import { forEach } from "ramda"

import d from 'diagrams'

d.utils = require('utils').default
d.events = d.utils.createAnEventEmitter()
d.shared = require('shared')
d.shapes = require('shapes')
d.svg = require('svg')
d.Diagram = require('getDiagramClass')()

forEach(diagramName => require(`diagrams/${diagramName}/index`)())([
  'Box', 'Graph', 'Layer',
])

window.diagrams = d
