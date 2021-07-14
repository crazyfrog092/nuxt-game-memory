export default {
  ssr: false,

  head: {
    title: 'nuxt-game-memory',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  css: [
    '~assets/scss/global.scss',
  ],

  plugins: [
  ],

  components: true,

  modules: [
    'nuxt-moment',
  ],

  build: {
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
      config.node = {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      };
    },
    babel: {
      compact: false,
    },
  },
};
