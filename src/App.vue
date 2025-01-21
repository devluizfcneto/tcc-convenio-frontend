<script setup lang="ts">
import { RouterView } from "vue-router"
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Aside from "./components/Aside.vue";
</script>

<template>
  <div class="container-app">
    <Header />
    <div class="container-content">
      <Aside />
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<style>
.container-app {
  width: 100%;
  display: flex;
  flex-flow: column;
}

.container-content{
  width: 100%;
  display: flex;
  min-height: calc(100vh - 50px);
}
</style>
