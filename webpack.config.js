const path = require('path')

module.exports = {
  entry: './src/main.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },

  devServer: {
    host: '127.0.0.1',
    port: '8337'
  }
}
