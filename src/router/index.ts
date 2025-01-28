import { createRouter, createWebHistory } from 'vue-router'
import ConvenioUniversidades from '../components/pages/ConvenioUniversidades.vue'
import CompararUniversidades from '../components/pages/CompararUniversidades.vue'
import RankingConvenios from '../components/pages/RankingConvenios.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/convenios-universidades',
      name: 'conveniosUniversidades',
      component: ConvenioUniversidades
    },
    {
      path: '/comparar-universidades',
      name: 'compararUniversidades',
      component: CompararUniversidades
    },
    {
      path: '/ranking-convenios',
      name: 'rankingConvenios',
      component: RankingConvenios
    }
  ],
  linkExactActiveClass: 'active'
})

export default router
