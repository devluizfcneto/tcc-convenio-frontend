<template>
  <div class="container-aside" :class="{ 'collapsed': isCollapsed }">
    <button class="collapse-button" @click="toggleCollapse">
      <i :class="isCollapsed ? 'pi pi-angle-right' : 'pi pi-times'"></i>
    </button>
    <ul>
      <li v-for="link in asideLinks" :key="link.name">
        <router-link :to="link.to" active-class="active">
          <span class="aside-icon">
            <i :class="link.icon"></i>
          </span>
          <span v-if="!isCollapsed" class="aside-text">{{ link.name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
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
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
</script>

<style scoped>
.container-aside {
  min-width: 20%;
  max-width: 30%;
  background-color: #dddddd;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1; /* Permite que a lista cresça e empurre o botão para baixo */
}

li {
  list-style-type: none;
}

a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;
  padding: 1em;
  transition: transform 0.3s ease;
}

a:hover,
a:focus {
  background-color: #d3d3d3;
  font-weight: bold;
}

.active {
  background-color: #999999;
  font-weight: bold;
}

.aside-icon {
  margin: 0.5em;
  display: inline-flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.aside-text {
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.collapse-button {
  background: none;
  border: none;
  padding: 0.5em;
  cursor: pointer;
  margin-top: 1em;
  margin-right: 1em;
  margin-bottom: 0.5em;
  align-self: flex-end;
}

.collapsed {
  max-width: 10%;
  min-width: 5%;
}

.collapsed .aside-text {
  display: none;
}

.collapsed .aside-icon {
  transform: scale(1.8);
}

@media (max-width: 768px) {
  .container-aside {
    width: 25%;
  }
  a {
    font-size: 0.9em;
  }
  .collapsed {
    width: 40px;
  }
}
</style>
