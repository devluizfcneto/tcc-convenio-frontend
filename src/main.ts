import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import ToastServiceMethods from 'primevue/toastservice'

import 'normalize.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/mdc-light-indigo/theme.css' // Tema ativo

import { Chart } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ChartDataLabels)

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.use(ToastServiceMethods)
app.mount('#app')
