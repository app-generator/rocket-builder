module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
        options: {
          removeSVGTagAttrs: false,
        },
      },
    ],
  },
  output: {
    filename: 'text-variant-tune.js',
    library: 'TextVariantTune',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
};
