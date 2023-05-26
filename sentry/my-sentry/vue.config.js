const { defineConfig } = require('@vue/cli-service')
// const SentryWebpackPlugin  = require("@sentry/webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  // configureWebpack: (config) => {
  //   config.plugins = new SentryWebpackPlugin ({
  //     org: 'zhouwenjie',
  //     project: 'javascript-vue',
  //     include: "./dist",
  //     release: 'javascript-vue1.0',
  //     authToken: 'faa0ddb68ebb42398f4de01e953db9461d29c4951d5345729f253de09975d0ea'
  //   })
  // }
})
