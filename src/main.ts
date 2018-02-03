// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './hooks'
import Router from 'vue-router' // This must be imported before any component
import HelloWorld from '@/components/HelloWorld.vue'
import App from './App.vue'

Vue.config.productionTip = false

// Material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
Vue.use(VueMaterial)

// Router
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})

// Vuex
import Vuex from 'vuex'
Vue.use(Vuex)

new Vue({
  router,
  el: '#app',
  components: { App },
  template: '<App/>'
})
