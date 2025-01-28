<template>
  <form @submit.prevent="submitForm">
    <div class="ifes-inputs-container">
      <div class="ife-input-container" v-for="(fields, index) in initialComparison" :key="index">
        <label> Universidade {{ index + 1 }}: </label>
        <Dropdown
          v-model="ifesSelected[index]"
          :options="allIfes"
          optionLabel="name"
          optionValue="code"
          placeholder="Selecione Universidade"
          filter
          class="ifes-input"
          required
        />
      </div>

      <Button
        @click="addNewIfesInput"
        style="margin: 0 1.5em"
        type="button"
        icon="pi pi-plus-circle"
        rounded
      ></Button>
    </div>

    <div class="period-inputs-container">
      <label for="startYear"> De: </label>
      <Dropdown
        v-model="startYear"
        :options="yearOptions"
        placeholder="Data Inicio..."
        dateFormat="yy"
        showIcon
        inputId="startYear"
        iconDisplay="input"
        id="startYear"
        required
      />

      <label for="endYear"> Até: </label>
      <Dropdown
        v-model="endYear"
        :options="yearOptions"
        placeholder="Data Fim..."
        dateFormat="yy"
        showIcon
        inputId="endYear"
        iconDisplay="input"
        id="endYear"
        required
      />

      <Button type="submit" label="Comparar" class="compare-button" />
    </div>
  </form>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

export default {
  components: {
    Dropdown,
    Button
  },
  props: {
    allIfes: { type: Array, required: true },
    yearOptions: { type: Array, required: true }
  },
  data() {
    return {
      ifesLength: 3,
      ifesSelected: Array(this.ifesLength).fill(null),
      initialComparison: [0, 1],
      startYear: null,
      endYear: null
    }
  },
  mounted(){
    const currentYear = new Date().getFullYear();
    this.startYear = currentYear;
    this.endYear = currentYear;
  },
  methods: {
    addNewIfesInput() {
      if (this.initialComparison.length < this.ifesLength) {
        this.initialComparison.push(this.initialComparison.length)
      }
    },
    submitForm() {
      this.$emit('compare', this.ifesSelected, this.startYear, this.endYear)
    }
  }
}
</script>

<style scoped>
.ifes-inputs-container {
  width: 95%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: auto;
  flex-wrap: wrap; 
}

.ife-input-container {
  display: flex;
  flex-direction: column;
  margin-right: 1.5em;
  width: 28%; 
  max-width: 30%;
}

.period-inputs-container {
  width: 95%;
  margin: 1em auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; 
  justify-content: center;
  align-items: center;
}

label {
  font-size: 16px;
  margin: 0.5em;
}

.ife-input {
  max-height: 3vh;
  font-size: small;
  width: 100%;
}

.compare-button {
  color: white;
  margin-left: 1em;
  padding: 1em;
  min-width: 20%; 
  background-color: #4B5D9D;
}
</style>
