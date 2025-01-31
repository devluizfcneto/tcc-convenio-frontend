<template>
  <form @submit.prevent="generate" class="ranking-form-container">
    <div class="label-form">
      <label for="startYear"> De: </label>
      <Dropdown
        class="dropdown"
        v-model="startYear"
        :options="yearOptions"
        placeholder="Data Inicio..."
        dateFormat="yy"
        showIcon
        inputId="startYear"
        iconDisplay="input"
      />
    </div>
    <div class="label-form">
      <label for="endYear"> Até: </label>
      <Dropdown
        class="dropdown"
        v-model="endYear"
        :options="yearOptions"
        placeholder="Data Fim..."
        dateFormat="yy"
        showIcon
        inputId="endYear"
        iconDisplay="input"
      />
    </div>

    <div class="label-form">
      <label for="limit"> Quantidade: </label>
      <Dropdown
        class="dropdown"
        v-model="limit"
        :options="limitOptions"
        placeholder="Quantidade..."
        showIcon
        inputId="limit"
        iconDisplay="input"
      />
    </div>

    <Button type="submit" label="Exibir Ranking" class="btn-ranking"></Button>
  </form>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

export default {
  name: 'RankingForm',
  components: {
    Dropdown,
    Button
  },
  props: {
    yearOptions: {
      type: Array,
      required: true
    },
    limitOptions: {
      type: Array,
      required: true
    },
    initialStartYear: {
      type: Number,
      required: true,
      default: new Date().getFullYear()
    },
    initialEndYear: {
      type: Number,
      required: true,
      default: new Date().getFullYear()
    },
    initialLimit: {
      type: String,
      required: true
    }
  },
  watch: {
    initialStartYear(newVal) {
      this.startYear = newVal
    },
    initialEndYear(newVal) {
      this.endYear = newVal
    },
    initialLimit(newVal) {
      this.limit = newVal
    }
  },
  data() {
    return {
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      limit: this.limitOptions[0]
    }
  },
  methods: {
    generate() {
      this.$emit('generate-ranking', {
        startYear: this.startYear,
        endYear: this.endYear,
        limit: this.limit
      })
    }
  }
}
</script>

<style lang="css" scoped>
.ranking-form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.label-form {
  display: flex;
  flex-direction: column;
  margin: 0;
  width: 200px;
}

.label-form label {
  font-size: 1em;
  margin-bottom: 5px;
  color: #555;
}

.dropdown {
  width: 100%;
}

.btn-ranking {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-ranking:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .ranking-form-container {
    flex-direction: column;
  }

  .label-form {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
