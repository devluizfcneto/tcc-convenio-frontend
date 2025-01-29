<template>
  <div class="container-main">
    <h2>Ranking de Convenios</h2>

    <RankingForm
      :yearOptions="yearOptions"
      :limitOptions="limitOptions"
      @generate-ranking="generateRanking"
    />

    <div class="data-table-container" v-if="isLoaded">
      <DataTable
        :value="ifesRankingFormated"
        stripedRows
        showGridLines
        size="small"
        ref="dtIfes"
        exportFilename="ranking-ifes"
      >
        <template #header>
          <div class="container-table-header">
            <h3>Ranking de Universidades</h3>
            <div style="text-align: left; margin-left: 1em">
              <Button
                icon="pi pi-external-link"
                severity="success"
                label="Exportar Tabela"
                id="ranking-ifes"
                @click="exportarCSV($event)"
              ></Button>
            </div>
          </div>
        </template>

        <template #empty>
          Não foi possível rankear Universidades. Nenhum Historico de Convenios encontrado no
          período informado
        </template>
        <template #loading> Carregando Ranking de Universidades, por favor aguarde. </template>

        <Column field="posicao" header="#"></Column>

        <Column field="ifesName" header="Nome da Universidade"></Column>

        <Column field="ifesTotalValue" header="Valor Total Repassado">
          <template #body="slotProps">
            {{ formatValue(slotProps.data.ifesTotalValue) }}
          </template>
        </Column>

        <Column field="convenenteName" header="Nome do Convenente"></Column>

        <Column field="convenenteTotalValue" header="Valor Total Recebido">
          <template #body="slotProps">
            {{ formatValue(slotProps.data.convenenteTotalValue) }}
          </template>
        </Column>

        <Column header="Detalhes" style="text-align: center">
          <template #body="slotProps">
            <a :href="slotProps.data.convenenteDetailUrl" target="_blank">
              <i class="pi pi-external-link"></i>
            </a>
          </template>
        </Column>
      </DataTable>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <ProgressSpinner />
    </div>

    <div class="data-table-container" v-if="isLoaded">
      <DataTable
        :value="convenentesRankingFormated"
        stripedRows
        showGridLines
        size="small"
        ref="dtConvenentes"
        exportFilename="ranking-convenentes"
      >
        <template #header>
          <div class="container-table-header">
            <h3>Ranking de Convenentes</h3>
            <div style="text-align: left; margin-left: 1em">
              <Button
                icon="pi pi-external-link"
                severity="success"
                label="Exportar Tabela"
                id="ranking-convenentes"
                @click="exportarCSV($event)"
              ></Button>
            </div>
          </div>
        </template>

        <template #empty>
          Não foi possível rankear Convenentes. Nenhum Historico de Convenios encontrado no período
          informado.
        </template>
        <template #loading> Carregando Ranking de Convenentes, por favor aguarde. </template>

        <Column field="posicao" header="#"></Column>

        <Column field="convenenteName" header="Nome do Convenente"></Column>

        <Column field="convenenteTotalValue" header="Valor Total Recebido">
          <template #body="slotProps">
            {{ formatValue(slotProps.data.convenenteTotalValue) }}
          </template>
        </Column>

        <Column field="ifesName" header="Nome da Universidade"></Column>

        <Column header="Detalhes" style="text-align: center">
          <template #body="slotProps">
            <a :href="slotProps.data.convenenteDetailUrl" target="_blank">
              <i class="pi pi-external-link"></i>
            </a>
          </template>
        </Column>
      </DataTable>
    </div>

    <Toast />
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import ConvenioService from '@/services/ConvenioService'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatValue, formatStringStartYear, formatStringEndYear } from '@/utils/format'
import RankingForm from '../Common/RankingForm.vue'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  components: {
    Dropdown,
    Button,
    DataTable,
    Column,
    RankingForm,
    ProgressSpinner
  },
  data() {
    return {
      startYear: '',
      endYear: '',
      limit: '',
      yearOptions: [],
      limitOptions: [],

      ifesRankingResponse: [],
      convenentesRankingResponse: [],
      isLoading: false,
      isLoaded: false,

      ifesRankingFormated: [],
      convenentesRankingFormated: []
    }
  },
  async mounted() {
    this.initializeOptions()
  },
  methods: {
    initializeOptions() {
      const currentYear = new Date().getFullYear()
      this.yearOptions = Array.from({ length: currentYear + 10 - 2000 + 1 }, (_, index) => {
        return 2000 + index
      })
      this.startYear = currentYear
      this.endYear = currentYear

      this.limitOptions = ['5', '10', '15', '20']
      this.limit = this.limitOptions[0]
    },
    async generateRanking(formInputs) {
      this.isLoading = true
      try {
        const request = {
          startYear: formatStringStartYear(formInputs.startYear),
          endYear: formatStringEndYear(formInputs.endYear),
          limit: formInputs.limit
        }
        const ranking = await ConvenioService.getConveniosRanking(
          request.startYear,
          request.endYear,
          request.limit
        )
        this.ifesRankingResponse = ranking.ifesRankingDTO
        this.convenentesRankingResponse = ranking.convenentesRankingDTO
        this.formatIfesRanking()
        this.formatConvenentesRanking()
        this.isLoaded = true
      } catch (error) {
        this.showErrors(error.message)
        this.isLoaded = false
      } finally {
        this.isLoading = false
      }
    },
    formatIfesRanking() {
      this.ifesRankingFormated = this.ifesRankingResponse.map((ifes, index) => {
        return {
          posicao: index + 1,
          ifesName: ifes.name,
          ifesTotalValue: ifes.totalValueReleased,
          convenenteName: ifes.convenentes[0].name,
          convenenteTotalValue: ifes.convenentes[0].totalValueReleased,
          convenenteDetailUrl: ifes.convenentes[0].detailUrl
        }
      })
    },

    formatConvenentesRanking() {
      this.convenentesRankingFormated = this.convenentesRankingResponse.map((convenente, index) => {
        return {
          posicao: index + 1,
          convenenteName: convenente.name,
          convenenteTotalValue: convenente.totalValueReleased,
          convenenteDetailUrl: convenente.detailUrl,
          ifesName: convenente.ifes.name
        }
      })
    },
    showErrors(message) {
      this.$toast.add({
        severity: 'error',
        summary: 'Erro no Servidor!',
        detail: message,
        life: 5000
      })
    },
    formatValue,
    formatStringStartYear,
    formatStringEndYear,
    exportarCSV(event) {
      const exportTableId = event.currentTarget.id
      if (exportTableId === 'ranking-ifes') {
        this.$refs.dtIfes.exportCSV()
      } else if (exportTableId === 'ranking-convenentes') {
        this.$refs.dtConvenentes.exportCSV()
      } else {
        console.error('Tabela não encontrada!')
      }
    }
  }
}
</script>

<style lang="css" scoped>
.container-main {
  width: 95%;
  margin: 1em auto;
  font-family: sans-serif;
}

h2 {
  font-size: 2em;
  margin-bottom: 0.5em;
  text-align: center;
  color: #333;
}

.data-table-container {
  width: 95%;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.container-table-header h3 {
  font-size: 1.2em;
  margin: 0;
}

.p-datatable .p-datatable-header {
  padding: 1rem;
  font-weight: 700;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
