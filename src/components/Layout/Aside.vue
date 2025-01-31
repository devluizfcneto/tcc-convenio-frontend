<template>
  <ul class="container-aside">
    <li v-for="link in asideLinks" :key="link.name">
      <router-link :to="link.to" active-class="active">
        <span v-if="link.icon" class="aside-icon">
          <i :class="link.icon"></i>
        </span>
        {{ link.name }}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      asideFunctionalities: [
        { name: 'Convenios Universidades', link: '/convenios-universidades', icon: 'pi pi-table' },
        {
          name: 'Comparar Universidades',
          link: '/comparar-universidades',
          icon: 'pi pi-chart-bar'
        },
        { name: 'Ranking Convenios', link: '/ranking-convenios', icon: 'pi pi-chart-line' }
      ]
    }
  },
  computed: {
    asideLinks() {
      return this.asideFunctionalities.map((func) => ({
        name: func.name,
        to: func.link,
        icon: func.icon
      }))
    }
  }
}
</script>

<style scoped>
.container-aside {
  min-width: 20%;
  max-width: 25%;
  background-color: #dddddd;
}

ul {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  width: auto;
  list-style: none;
}

li {
  width: auto;
  list-style-type: none;
}

a {
  display: block;
  text-decoration: none;
  color: black;
  padding: 1em 1em;
}

a:hover {
  background-color: #d3d3d3;
  font-weight: bold;
}

a:active {
  background-color: #d3d3d3;
}

.active {
  background-color: #999999;
  font-weight: bold;
}

.aside-icon {
  margin-right: 0.5em;
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .container-aside {
    width: 25%;
  }
  a {
    font-size: 0.9em;
  }
}
</style>
