const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getEntry = require('./getEntry');

let entry = getEntry('./src/js/**/*.js');
let pages = getEntry('./src/template/**/*.html');

function getHtmlPlugins(htmlPath = {}) {
  let plugins = [];
  for (let pathname in htmlPath) {
    // 配置生成的html文件，定义路径等
    let conf = {
      filename: pathname + '.html',
      template: htmlPath[pathname], // 模板路径
      inject: true, // js插入位置
      minify: {
        //removeComments: true,
        //collapseWhitespace: true,
        //removeAttributeQuotes: true
      },
      chunks: ['manifest', 'vendor', pathname],
      hash: true,
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    };

    plugins.push(new HtmlWebpackPlugin(conf));
  }
  return plugins;
}

let webpackConfig = {
  entry: entry,
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor'
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/dist',
              name: '[path][name].[ext]?[hash]'
              // useRelativePath: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname
    }),
    new CopyWebpackPlugin(
      [
        {
          from: './src/assets',
          to: './assets/'
        }
      ],
      {}
    ),
    ...getHtmlPlugins(pages)
  ]
};

module.exports = webpackConfig;
