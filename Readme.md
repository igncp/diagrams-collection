# Diagrams Collection

| Tests and Linting |
|:---:|
| [![Build Status](https://travis-ci.org/igncp/diagrams-collections.svg?branch=master)](https://travis-ci.org/igncp/diagrams-collections) |

## Usage

Add the link to diagrams to your html. You can see some examples [here](http://igncp-sketchbook.herokuapp.com)
 
## Build

The project uses [webpack](https://webpack.github.io/) to create the final `diagrams.js`. Run `grunt` to generate the bundle file and the source map, and `make prod` to minify it.

## Dependencies

The library has the following dependencies:
- Internal
  - d3.js
  - lodash.js
  - rx.js

- External (have to be manually required, and they are included in the `bower.json`)
  - highlight.js (For the Layer diagram)

## Author and License

Ignacio Carbajo · MIT
