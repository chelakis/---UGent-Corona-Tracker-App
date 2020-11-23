import Vue from 'vue'
// import App from './App.vue'
import AppLogin from './AppLogin.vue'
// import router from './router'
// import axios from 'axios'
import VueResource from 'vue-resource'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './assets/app.scss'

// axios.defaults.baseURL = 'http://localhost:3000'
// Vue.prototype.$axios = axios

import VueSession from 'vue-session'
Vue.use(VueSession)

Vue.use(VueResource)

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false




new Vue({
  router,
  render: h => h(AppLogin),
}).$mount('#app')
