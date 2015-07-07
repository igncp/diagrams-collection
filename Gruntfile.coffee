glob = require 'glob'
path = require 'path'

dirJs = 'src/js/'
dirScss = 'src/scss/'

gruntConfig = {}

setConcatFilesInConfig = ->
  concatFilesPaths = (glob.sync dirJs + '/**/*.js').filter((filePath)->
    fileName = path.basename(filePath)
    fileName.substr(0, 7) isnt 'concat-'
  ).sort((a, b)->
    a.split('/').length > b.split('/').length
  ).reduce((memo, filePath)->
    memo.splice memo.length - 1, 0, filePath
    memo
  , [dirJs + 'concat-banner.js', dirJs + 'concat-footer.js'])

  gruntConfig.concat.dist.src = concatFilesPaths

gruntConfig.babel =
  options:
    sourceMap: true
  dist:
    files: {
      'dist/diagrams.js': 'dist/diagrams.js'
    }

gruntConfig.compass =
  dist:
    options:
      sassDir: dirScss,
      cssDir: 'dist',
      outputStyle: 'compressed'

gruntConfig.uglify =
  my_target:
    files: {
      'dist/diagrams.min.js': ['dist/diagrams.js']
    }

gruntConfig.concat =
  options:
    separator: '})();(function(){'
  dist: {
    src: null,
    dest: 'dist/diagrams.js',
  }

gruntConfig.watch =
  options:
    atBegin: true
  js:
    files: [dirJs + '**/*.js']
    tasks: ['js-devel']
  scss:
    files: [dirScss + '**/*.scss']
    tasks: ['compass']

module.exports = (grunt)->
  require('load-grunt-tasks')(grunt)

  setConcatFilesInConfig()

  grunt.initConfig gruntConfig

  grunt.registerTask 'js-devel', ['concat', 'babel']
  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'compile-prod', ['compass', 'js-devel', 'uglify']