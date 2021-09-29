const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  target: 'web',

  devtool: false,

  mode: 'production',

  entry: {
    snarkyjs_chrome: {
      import: path.resolve(__dirname, 'src/index.ts'),
    },
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      child_process: false,
      fs: false,
    },
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /worker_init.js/,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /\.bc.js$/,
          name: 'snarky_js_chrome.bc',
          chunks: 'all',
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)|(\.bc.js)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './src/chrome_bindings/plonk_init.js',
          to: '',
        },
        {
          from: './src/chrome_bindings/plonk_wasm.js',
          to: '',
        },
        {
          from: './src/chrome_bindings/plonk_wasm_bg.wasm',
          to: '',
        },
        {
          from: './src/chrome_bindings/worker_init.js',
          to: '',
        },
        {
          from: 'src/chrome_bindings/snippets',
          to: 'snippets',
        },
        {
          from: 'src/snarky.d.ts',
          to: '',
        },
      ],
    }),
  ],
};
