path = require 'path'

dirJs = './src/js/'
dirScss = './src/scss/'

gruntConfig = {}

gruntConfig.compass =
  dist:
    options:
      sassDir: dirScss,
      cssDir: 'dist',
      outputStyle: 'compressed'

gruntConfig.watch =
  options:
    atBegin: true
  js:
    files: [dirJs + '**/*.js']
    tasks: ['webpack:default']
  scss:
    files: [dirScss + '**/*.scss']
    tasks: ['compass']

gruntConfig.uglify =
  my_target:
    files:
      'dist/diagrams.min.js': ['dist/diagrams.js']

gruntConfig.webpack =
  default:
    entry: dirJs + 'main.js'
    devtool: 'source-map'
    output:
      path: 'dist/'
      filename: 'diagrams.js'
    stats:
      colors: true
      modules: true
      reasons: true
    failOnError: false
    module:
      loaders: [{
        test: /\.js$/
        loader: "babel-loader"
      }]
    resolve:
      root: path.resolve __dirname, 'src/js/'


module.exports = (grunt)->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig gruntConfig

  grunt.registerTask 'default', ['watch']
