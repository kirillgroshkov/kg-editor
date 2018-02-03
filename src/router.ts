import { bootstrapService } from '@/srv/bootstrap.service'
import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import CollectionPage from '@/pages/CollectionPage.vue'
import EditorPage from '@/pages/EditorPage.vue'

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
    {
      path: '/edit/:collectionName/:itemId',
      component: EditorPage,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  // ensure Bootstrap is finished before rendering any route
  await bootstrapService.init()
  next()
})
