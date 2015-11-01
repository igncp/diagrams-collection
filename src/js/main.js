import d from 'diagrams';

((scope)=> {
  d.utils = require('utils');
  d.events = d.utils.createAnEventEmitter();
  d.shared = require('shared');
  d.shapes = require('shapes');
  d.svg = require('svg');
  d.Diagram = require('getDiagramClass')();

  _.each([
    'Box', 'Graph', 'Layer'
  ], diagramName => require('diagrams/' + diagramName)());

  scope.diagrams = d;
})(window);
