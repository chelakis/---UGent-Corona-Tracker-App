import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Texts from '@/components/Texts.vue'
// import AppLogin from '../AppLogin.vue'
// import App from '../App.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/texts',
      name: 'texts',
      component: Texts,
      // redirect: {
      //                   name: "Texts"
      //               }
    }
  ]
})

// export default new VueRouter({
//   routes: [
//     {
//       path: '/',
//             redirect: {
//                 name: "AppLogin"
//             }
//     },
//     {
//       path: '/App',
//       name: 'App',
//       component: App,
//     },
//     {
//       path: '/AppLogin',
//       name: 'AppLogin',
//       component: AppLogin,
//     }
//   ]
// })