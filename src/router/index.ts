import { createRouter, createWebHistory } from 'vue-router'
import ConvenioUniversidades from "../components/ConvenioUniversidades.vue";
import CompararUniversidades from "../components/CompararUniversidades.vue";
import RankingConvenios from "../components/RankingConvenios.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/convenios-universidades",
      name: "conveniosUniversidades",
      component: ConvenioUniversidades
    },
    {
      path: "/comparar-universidades",
      name: "comparar-universidades",
      component: CompararUniversidades
    },
    {
      path: "/ranking-convenios",
      name: "rankingConvenios",
      component: RankingConvenios
    }

    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
  linkExactActiveClass: 'active'
})

export default router
