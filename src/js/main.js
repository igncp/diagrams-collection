import { forEach } from "ramda"

import d from 'diagrams'

d.utils = require('./utils/index')
d.events = d.utils.createAnEventEmitter()
d.shared = require('shared')
d.shapes = require('shapes')
d.svg = require('svg')
d.Diagram = require('getDiagramClass')()

const requireAndRunDiagram = diagramName => require(`diagrams/${diagramName}/index`)()

forEach(requireAndRunDiagram)([
  'Box', 'Graph', 'Layer',
])

window.diagrams = d
