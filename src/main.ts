import Vue from 'vue'
import './hooks' // must be defined BEFORE router is created!
import { router } from '@/router'
import { store } from '@/store'
import { bootstrapService } from '@/srv/bootstrap.service'
import LayoutComponent from './cmp/LayoutComponent.vue'
// import App from './App.vue'

Vue.config.productionTip = false

// Material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
Vue.use(VueMaterial)

bootstrapService.init() // async

new Vue({
  router,
  store,
  el: '#app',
  components: { LayoutComponent },
  template: '<LayoutComponent/>'
})
