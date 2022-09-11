const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'table.js',
    library: 'Table',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.pcss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader?removeSVGTagAttrs=false'
      }
    ]
  }
};
