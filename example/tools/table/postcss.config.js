module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    require('cssnano'),
    require('postcss-nested'),
    require('postcss-nesting')
  ]
};
