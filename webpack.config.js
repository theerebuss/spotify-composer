const HtmlWebPackPlugin = require('html-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const EnvWebpackPlugin = require('env-webpack-plugin')
const path = require('path')

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
    navigateFallback: '/index.html',
    staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
  }
)

const manifest = new WebpackPwaManifest({
  name: 'Spotify Compose',
  short_name: 'S.Compose',
  description: 'Composer for Spotify playlists',
  background_color: '#1DB954',
  start_url: "/",
  theme_color: '#1DB954',
  'theme-color': '#1DB954',
  filename: "manifest.json",
  icons: [
    {
      src: path.resolve("src/images/logo.png"),
      sizes: [96, 128, 192, 256, 384, 512],
      destination: path.join('assets', 'icons')
    }
  ]
})

const staticFileCopy = new CopyWebpackPlugin([
  {
    from: 'src/static',
    to: ''
  }
])

const envPlugin = new EnvWebpackPlugin(["NODE_ENV"])

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
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    historyApiFallback: true,
    https: true
  },
  plugins: [
    envPlugin,
    htmlWebPackPlugin,
    serviceWorker,
    manifest,
    staticFileCopy
  ]
}