import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: [
      'primevue/utils',
      'primevue/datatable',
      'primevue/column',
      'primevue/button',
      'primevue/dialog',
      'primevue/toast',
      'primevue/inputtext', 
      'primevue/dropdown',  
      'primevue/api',
      'primevue/usetoast',
      'primevue/usedialog',
      'primevue/confirmationservice',
      'primevue/iconfield',
      'primevue/inputicon',
      'primevue/multiselect',
      'primevue/treetable',
      'primevue/chart',
      'primevue/tabview',
      'primevue/tabpanel',
      'primevue/calendar'
    ],
  }
})
