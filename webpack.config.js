const HtmlPlugin = require('html-webpack-plugin')
const PwaManifest = require('webpack-pwa-manifest')
const CopyPlugin = require('copy-webpack-plugin')
const EnvPlugin = require('env-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path')

const html = new HtmlPlugin({
  template: "./src/index.html",
  filename: "./index.html"
})

const workbox = new WorkboxPlugin.GenerateSW({
  swDest: 'sw.js',
  clientsClaim: true,
  skipWaiting: true,
})

const manifest = new PwaManifest({
  name: 'Spotify Compose',
  short_name: 'S.Compose',
  description: 'Composer for Spotify playlists',
  background_color: '#1DB954',
  start_url: "/",
  theme_color: '#1DB954',
  'theme-color': '#1DB954',
  filename: "manifest.json",
  icons: [{
    src: path.resolve("src/images/logo.png"),
    sizes: [96, 128, 192, 256, 384, 512],
    destination: path.join('assets', 'icons')
  }]
})

const staticFileCopy = new CopyPlugin([{
  from: 'src/static',
  to: ''
}])

const envPlugin = new EnvPlugin(["NODE_ENV"])

module.exports = {
  module: {
    rules: [{
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
    https: false,
    port: 9000
  },
  plugins: [
    envPlugin,
    html,
    workbox,
    manifest,
    staticFileCopy
  ]
}