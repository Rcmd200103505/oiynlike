const { defineConfig } = require("@vue/cli-service");
// const path = require("path");
// const VueI18nPlugin = require("@intlify/unplugin-vue-i18n/webpack");

module.exports = defineConfig({
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/scss/variables.scss";`,
      },
    },
  },
  // configureWebpack: {
  //   plugins: [
  //     VueI18nPlugin({
  //       include: path.resolve(__dirname, "./src/locales/**"),
  //     }),
  //   ],
  // },
});
