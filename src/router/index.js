import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/Index.vue'
import SingleGame from '../pages/SingleGame.vue'
import AgainstGame from '../pages/AgainstGame.vue'


Vue.use(Router)



export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/single-game',
      component: SingleGame
    },
    {
      path: '/against-game',
      component: AgainstGame
    }
  ]
})

