import webpack from 'webpack'
import path from 'path'
// variables
import {
  fileURLToPath
} from 'url'
const __filename = fileURLToPath(
  import.meta.url )
const __dirname = path.dirname( __filename )

const buildMode =
  process.argv.indexOf( '-p' ) >= 0 || process.env.NODE_ENV === 'production' ?
  'production' : 'development'
const sourcePath = path.join( __dirname, './src' )
const outPath = path.join( __dirname, './dist' )
import {
  WebpackManifestPlugin
} from 'webpack-manifest-plugin'
// plugins
import HtmlWebpackPlugin from 'html-webpack-plugin'
// var MiniCssExtractPlugin from mini-css-extract-plugin'
import {
  CleanWebpackPlugin
} from 'clean-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
//const ESLintPlugin from eslint-webpack-plugin'
import Dotenv from 'dotenv-webpack'

export default {
  mode: buildMode,
  context: __dirname,
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: outPath,
    filename: buildMode === 'production' ? '[id].[contenthash].js' :
      '[id].[hash].js',
    chunkFilename: buildMode === 'production' ?
      '[id].[name].[contenthash].js' : '[id].[name].[hash].js',
    publicPath: '/',
  },
  target: 'web',
  resolve: {
    extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: [ 'module', 'browser', 'main' ],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [ {
        test: /\.(j|t)s(x)?$/,
        include: [ path.resolve( __dirname, 'src' ) ],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                '@babel/preset-env', {
                  targets: {
                    browsers: 'last 2 versions'
                  }
                }, // or whatever your project requires
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              [ '@babel/plugin-proposal-decorators', {
                legacy: true
              } ],
              [ '@babel/plugin-proposal-class-properties', {
                loose: false
              } ],
              [ 'react-hot-loader/babel', {
                safetyNet: false
              } ],
            ],
          },
        },
      }, {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ],
      }, {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
      //     {
      //       loader: 'css-loader',
      //       query: {
      //         modules: true,
      //         sourceMap: !isProduction,
      //         importLoaders: 1,
      //         localIdentName: isProduction
      //           ? '[hash:base64:5]'
      //           : '[local]__[hash:base64:5]'
      //       }
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         ident: 'postcss',
      //         plugins: [
      //           require('postcss-import')({ addDependencyTo: webpack }),
      //           require('postcss-url')(),
      //           require('postcss-preset-env')({
      //             /* use stage 2 features (defaults) */
      //             stage: 2
      //           }),
      //           require('postcss-reporter')(),
      //           require('postcss-browser-reporter')({
      //             disabled: isProduction
      //           })
      //         ]
      //       }
      //     }
      //   ]
      // },
      // static assets
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          esModule: false
        }
      }, {
        test: /\.(a?png|jpe?g)$/,
        use: 'url-loader?limit=10000000'
      }, {
        test: /\.svg/,
        use: [ {
          loader: 'svg-url-loader',
          options: {},
        }, ],
      }, {
        test: /\.(gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      name: false,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10,
          filename: buildMode === 'production' ?
            'vendor.[contenthash].js' : 'vendor.[hash].js',
        },
      },
    },
    runtimeChunk: true,
    moduleIds: 'named',
  },
  plugins: [
    new webpack.EnvironmentPlugin( {
      NODE_ENV: `"${buildMode}"`,
      DEBUG: false,
    } ),
    new CleanWebpackPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: isProduction ? '[contenthash].css' : '[hash].css',
    //   disable: !isProduction
    // }),
    new ForkTsCheckerWebpackPlugin(),
    //new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin( {
      template: 'src/assets/index.html',
    } ),
    new WebpackManifestPlugin( {
      fileName: 'public/manifest.json',
    } ),
    new NodePolyfillPlugin(),
    //new ESLintPlugin()
    new Dotenv( {
      path: path.join( __dirname, './.env' )
    } ),
    new webpack.DefinePlugin( {
      'process.env': {
        'NODE_ENV': `"${buildMode}"`
      }
    } )
  ],
  devServer: {
    contentBase: path.resolve( __dirname, 'dist' ),
    disableHostCheck: true,
    hot: true,
    inline: true,
    host: '127.0.0.1',
    // public: '127.0.0.1:3000',
    allowedHosts: [ '127.0.0.1' ],
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy: [ {
        context: [
          '/logout',
          '/state',
          '/events',
          '/session',
          '/meme',
          '/upload',
          '/download',
          '/fetchTaskByID',
          '/fetchTaskByName',
          '/fetchDeck',
          '/search',
        ],
        target: 'http://127.0.0.1:8003',
        // changeOrigin: true,
      },
      // { context: [ "/socket.io"],
      //   ws: true,
      // }
    ],

    stats: 'minimal',
    clientLogLevel: 'debug',
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: 'eval-source-map',
  // devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    //fs: 'empty',
    //net: 'empty'
  },
}