// nuxt.config.js
export default {
  modules: ['@nuxtjs/axios'],
  axios: {
    baseURL: 'http://127.0.0.1:8000/api/', // Base URL for your Laravel API
  },
};
