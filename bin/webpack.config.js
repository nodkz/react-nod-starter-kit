/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';
import cp from 'child_process';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  output: {
    publicPath: '/',
    sourcePrefix: '  ',
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      app: path.resolve(__dirname, '../app/'),
    },
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../node_modules/react-routing/src'),
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../lib'),
          path.resolve(__dirname, '../config'),
          path.resolve(__dirname, '../mailers'),
          path.resolve(__dirname, '../tasks'),
          path.resolve(__dirname, '../i18n'),
        ],
        loader: 'babel-loader',
      }, {
        test: /\.scss$/,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${DEBUG ? 'sourceMap' : 'minimize'}&modules&importLoaders=1&localIdentName=`
          + `${DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]'}`,
          'postcss-loader',
        ],
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },

  postcss: function plugins(bundler) {
    return [
      require('postcss').plugin('postcss-inline-comment', () =>
        // remove `//` from props
        (root) => root.walkDecls(decl => { if (decl.prop.match(/^\/\/[\s]?.+/)) decl.remove(); })
      )(),
      require('postcss-conditionals')(),
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('postcss-calc')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = extend(true, {}, config, {
  entry: './app/client.js',
  output: {
    path: path.join(__dirname, '../build/public'),
    filename: DEBUG ? '[name].js?[hash]' : '[name].[hash].js',
  },

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new AssetsPlugin({
      path: path.join(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
          screw_ie8: true,

          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          warnings: VERBOSE,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ] : []),
  ],
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = extend(true, {}, config, {
  entry: './app/server.js',
  output: {
    path: './build',
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [
    /^\.\/assets$/,
    function filter(context, request, cb) {
      const isAppAlias = request.match(/^components|app\/*/);

      const isExternal =
        request.match(/^[_@a-z][a-z\/\.\-0-9]*$/i) &&
        !request.match(/^react-routing/) &&
        !context.match(/[\\/]react-routing/);

      cb(null, Boolean(isExternal && !isAppAlias));
    },
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }
    ),
    new webpack.SourceMapDevToolPlugin(
      '[file].map', null,
      '[absolute-resource-path]', '[absolute-resource-path]'
    ),
  ],
});

export default [clientConfig, serverConfig];
