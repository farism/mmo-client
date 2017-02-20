import webpack from 'webpack'
import path from 'path'

const {
  NODE_ENV = 'development',
  ELECTRON_TYPE = 'renderer',
} = process.env

const base = {
  module: {
    rules: [
      { test: /\.ts?/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.md$/, loader: 'ignore-loader' },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    mainFields: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ],
  node: {
    ws: 'empty',
    __dirname: true,
  },
}

const targets = {

  main: {
    development: {
      ...base,
      target: 'electron',
      devtool: 'cheap-module-eval-source-map',
      entry: './src/main.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.development.js',
      },
      plugins: [
        ...base.plugins,
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') }}),
      ],
    },

    production: {
      ...base,
      target: 'electron',
      entry: './src/main.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.production.js',
      },
      plugins: [
        ...base.plugins,
        // new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') }}),
        new webpack.optimize.UglifyJsPlugin({ compressor: { screw_ie8: true, warnings: false }}),
      ],
    },
  },

  renderer: {
    development: {
      ...base,
      target: 'electron-renderer',
      devtool: 'cheap-module-eval-source-map',
      entry: './src/renderer.ts',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'renderer.development.js',
      },
      plugins: [
        ...base.plugins,
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') }}),
      ],
    },

    production: {
      ...base,
      target: 'electron-renderer',
      entry: './src/renderer.ts',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'renderer.production.js',
      },
      plugins: [
        ...base.plugins,
        // new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') }}),
        new webpack.optimize.UglifyJsPlugin({ compressor: { screw_ie8: true, warnings: false }}),
      ],
    },
  }

}

export default targets[ELECTRON_TYPE][NODE_ENV]
