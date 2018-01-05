const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = [
  {
    entry: {
      options: './dev/js/options/index.js'
    },
    output: {
      path: path.join(__dirname, './app/js'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'stage-0']
          }
        },
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        }
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'vuex$': 'vuex/dist/vuex.js'
      }
    }
  },
  {
    entry: {
      background: './dev/js/background/index.js'
    },
    output: {
      path: path.join(__dirname, './app/js'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'stage-0']
          }
        }
      ]
    }
  },
  {
    entry: {
      options: './dev/scss/options.scss'
    },
    output: {
      path: path.join(__dirname, './app/css/'),
      filename: '[name].css'
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader?minimize',
              'postcss-loader',
              'sass-loader'
            ]
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css')
    ]
  }
];
