const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const RELEASE = /release/.test(process.env.npm_lifecycle_event);

/**
 * JSのビルド
 */
const js = {
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
      'vue$': (RELEASE) ? 'vue/dist/vue.min.js' : 'vue/dist/vue.esm.js',
      'vuex$': 'vuex/dist/vuex.js'
    }
  }
};


/**
 * CSSのコンパイル
 */
const css = {
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
};


/**
 * リリース
 */
if (RELEASE) {
  js.plugins = [
    new webpack.DefinePlugin({
      'process_env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ];
}

module.exports = [ js, css ];
