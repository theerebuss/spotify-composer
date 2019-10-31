const Webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const PwaManifest = require('webpack-pwa-manifest')
const CopyPlugin = require('copy-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

const version = require('./package.json').version || 0

module.exports = (env, argv) => {
  const cleanup = new CleanWebpackPlugin()

  const html = new HtmlPlugin({
    template: "./src/index.html",
    filename: "./index.html"
  })

  const workbox = new WorkboxPlugin.GenerateSW({
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true
  })

  const manifest = new PwaManifest({
    name: 'Spotify Compose',
    short_name: 'Spotify Compose',
    description: 'Composer for Spotify playlists',
    background_color: '#1DB954',
    start_url: "/",
    inject: true,
    ios: true,
    theme_color: '#1DB954',
    'theme-color': '#1DB954',
    filename: "manifest.json",
    icons: [{
      src: path.resolve("src/static/logo.png"),
      sizes: [96, 128, 192, 256, 384, 512],
      destination: path.join('assets', 'icons'),
      ios: true
    }],
    share_target: {
      action: "/share",
      method: "GET",
      enctype: "application/x-www-form-urlencoded",
      params: {
        text: "text"
      }
    }
  })

  const staticFileCopy = new CopyPlugin([{
    from: 'src/static',
    to: ''
  }])

  const definePlugin = new Webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(argv.mode),
    'process.env.PACKAGE_VERSION': JSON.stringify(version)
  })

  return {
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
      cleanup,
      definePlugin,
      html,
      workbox,
      manifest,
      staticFileCopy
    ]
  }
}