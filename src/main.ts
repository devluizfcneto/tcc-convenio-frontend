import PrimeVue from "primevue/config";
import "normalize.css";
import ToastServiceMethods from "primevue/toastservice";

import 'primeicons/primeicons.css';
import "primevue/resources/primevue.min.css";
// import "primevue/resources/themes/md-light-indigo/theme.css";
// import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/themes/mdc-light-indigo/theme.css";
// import "primevue/resources/themes/aura-light-indigo/theme.css";
// import "primevue/resources/themes/lara-light-blue/theme.css"

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels)

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.use(ToastServiceMethods);
app.mount('#app');
