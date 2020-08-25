import Vue from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import "./assets/css/material.css"

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
