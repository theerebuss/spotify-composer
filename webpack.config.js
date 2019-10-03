const HtmlWebPackPlugin = require('html-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const path = require('path')

const PUBLIC_PATH = 'https://localhost:8080'

const htmlWebPackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
})

const serviceWorker = new SWPrecacheWebpackPlugin(
  {
    cacheId: 'spotify-composer-cache',
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'service-worker.js',
    minify: true,
    navigateFallback: PUBLIC_PATH + '/index.html',
    staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
  }
)

const manifest = new WebpackPwaManifest({
  name: 'Spotify Compose',
  short_name: 'S.Compose',
  description: 'Composer for Spotify playlists',
  background_color: '#1DB954',
  theme_color: '#1DB954',
  'theme-color': '#1DB954',
  start_url: '/',
  icons: [
    {
      src: path.resolve("src/images/logo.png"),
      sizes: [96, 128, 192, 256, 384, 512],
      destination: path.join('assets', 'icons')
    }
  ]
})

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx|\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  output: {
    publicPath: PUBLIC_PATH
  },
  devServer: {
    historyApiFallback: true,
    https: true
  },
  plugins: [
    htmlWebPackPlugin,
    serviceWorker,
    manifest
  ]
}