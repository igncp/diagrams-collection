module.exports = {
  devtool: 'source-map',
  entry: `${__dirname}/entry.js`,
  failOnError: false,
  module: {
    loaders: [{
      exclude: /(node_modules|bower_components)/,
      loader: "babel",
      test: /\.js$/,
    }],
  },
  output: {
    filename: 'testBundle.js',
    path: '/tmp/',
  },
  resolve: {
    root: `${__dirname}/../src/js/`,
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
  },
  target: "node",
}
