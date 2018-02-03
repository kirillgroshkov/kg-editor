import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CollectionPage from '@/pages/CollectionPage.vue'

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/collection/:collectionName',
      component: CollectionPage,
    },
  ],
})
