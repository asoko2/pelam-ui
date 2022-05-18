import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - pelam",
    title: "pelam",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],
  // css: ["@sweetalert2/theme-dark"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "vue-toastification/nuxt",
    "vue-sweetalert2/nuxt",
  ],
  toast: {
    timeout: 2000,
  },

  // router: {
  //   middleware: ["auth"],
  // },

  //Config Nuxt Auth
  auth: {
    plugins: ["~/plugins/auth.js"],
    strategies: {
      local: {
        token: {
          property: "data.token",
          global: true,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: "data",
          // autoFetch: true
        },
        endpoints: {
          login: {
            url: "/auth/login",
            method: "post",
            // propertyName: "token",
          },
          logout: { url: "/auth/logout", method: "post" },
          user: { url: "/auth/user", method: "get" },
        },
      },
    },
    redirect: {
      login: "/",
      logout: "/",
      home: "/admin/dashboard",
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "http://localhost:3333",
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      themes: {
        light: {
          primary: {
            base: "#459EED",
            darken1: "#1165B0",
          },
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
