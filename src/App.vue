<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Layout/Header.vue'
import Footer from './components/Layout/Footer.vue'
import Aside from './components/Layout/Aside.vue'
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <div class="container-content">
      <Aside />
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container-content {
  display: flex;
  flex-grow: 1;
}
</style>
