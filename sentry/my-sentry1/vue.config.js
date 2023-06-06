module.exports = {
  // 基本路径
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  configureWebpack: {
      externals: {}
  },
  devServer: {
      port: '8080',
      proxy: {
          '/api': {
              target: 'http://localhost:4396',
              ws: true,
              changeOrigin: true,
              pathRewrite: { '^/api': '/' }
          }
      }
  }
}