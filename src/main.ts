/* tslint:disable:ordered-imports */
import '@/scss/global.scss'
import '@/polyfills'
import Vue from 'vue'
import './hooks' // must be defined BEFORE router is created!
import { router } from '@/router'
import { store } from '@/store'
import RootComponent from './cmp/RootComponent.vue'

Vue.config.productionTip = false

// Directives
import '@/dir/focus.dir'

// Material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
Vue.use(VueMaterial)

// Progress bar
const VueProgressBar = require('vue-progressbar')
Vue.use(VueProgressBar, {
  // color: '#bffaf3',
  // failedColor: '#874b4b',
  thickness: '4px',
  transition: {
    speed: '0.2s',
    opacity: '0.6',
    termination: 300,
  },
})

export const app = new Vue({
  router,
  store,
  el: '#app',
  components: { RootComponent },
  template: '<RootComponent/>',
})
