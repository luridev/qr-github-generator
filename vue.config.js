const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const ElementPlus = require('unplugin-element-plus/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  publicPath: '/github-qr-generator/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      ElementPlus({
        useSource: false
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
})