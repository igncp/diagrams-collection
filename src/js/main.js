import d from 'diagrams';

d.utils = require('utils');
d.events = d.utils.createAnEventEmitter();
d.shared = require('shared');
d.shapes = require('shapes');
d.svg = require('svg');
d.Diagram = require('getDiagramClass')();

_.each([
  'Box', 'Graph', 'Layer',
], diagramName => require(`diagrams/${diagramName}/index`)());

window.diagrams = d;
