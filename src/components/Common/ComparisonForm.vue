<template>
  <form @submit.prevent="submitForm">
    <div class="ifes-inputs-container">
      <div class="ife-input-container" v-for="(fields, index) in initialComparison" :key="index">
        <label>
          <img
            v-if="initialComparison.length > 2"
            class="remove-convenio"
            :id="index"
            src="@/assets/red-close.png"
            @click="removeConvenio(index)"
          />
          Universidade {{ index + 1 }}:
        </label>
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
  mounted() {
    const currentYear = new Date().getFullYear()
    this.startYear = currentYear
    this.endYear = currentYear
  },
  methods: {
    addNewIfesInput() {
      if (this.initialComparison.length < this.ifesLength) {
        this.initialComparison.push(this.initialComparison.length)
      }
    },
    removeConvenio(index) {
      if (this.initialComparison.length === 3) {
        this.initialComparison.splice(index, 1)
        this.ifesSelected.splice(index, 1)
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

.ife-input-container {
  display: flex;
  flex-direction: column;
  width: 250px;
}

.ife-input-container label {
  font-size: 1em;
  margin-bottom: 5px;
  color: #555;
}

.ifes-input {
  width: 100%;
}

.period-inputs-container {
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

.period-inputs-container label {
  font-size: 1em;
  margin-bottom: 5px;
  color: #555;
}

.compare-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.compare-button:hover {
  background-color: #0056b3;
}

.remove-convenio {
  max-height: 10px;
}
</style>
