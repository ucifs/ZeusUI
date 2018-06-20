const webpack = require('webpack');
const base = require('./webpack.base.conf');
const vueConfig = require('./vue-loader.config');
const HTMLPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = Object.assign({}, base, {
  resolve: {
    extensions: ['.js', '.vue'],
    alias: Object.assign({}, base.resolve.alias, {
      'create-api': './create-api-client.js'
    })
  },
  plugins: (base.plugins || []).concat([
    // strip comments in Vue code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev'),
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // generate output HTML
    new HTMLPlugin({
      template: 'src/index.html',
      filename: '../index.html' // 生成的html存放路径，相对于 path
    })
  ])
});

if (process.env.NODE_ENV === 'production') {
  // Use ExtractTextPlugin to extract CSS into a single file
  // so it's applied on initial render.
  // vueConfig is already included in the config via LoaderOptionsPlugin
  // here we overwrite the loader config for <style lang="stylus">
  // so they are extracted.
  // vueConfig.loaders = {
  //   stylus: ExtractTextPlugin.extract({
  //     loader: 'css-loader!stylus-loader',
  //     fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
  //   })
  // }

  vueConfig.loaders = {
    sass: ExtractTextPlugin.extract({
      loader: 'css-loader!sass-loader',
      fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
    }),
    js: 'babel-loader'
  };

  config.plugins.push(
    new ExtractTextPlugin('styles.[hash].css'),
    // this is needed in webpack 2 for minifying CSS
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

module.exports = config;
