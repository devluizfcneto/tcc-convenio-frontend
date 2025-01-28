<template>
  <div class="container-main">
    <h2>Ranking de Convenios</h2>

    <!-- Formulario para preencher o período, data incicial 2020 e data final até ano corrente e quantidade máxima de Ifes/Convenios -->
    <form class="ranking-form-container">
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

      <Button
        @click.lazy="generateRanking"
        type="button"
        label="Exibir Ranking"
        class="btn-ranking"
      ></Button>
    </form>

    <!-- Exibir tabela com Nome Universidades, valor total liberado, convenente que mais recebeu repasse, valor que convenente recebeu da Universidade -->
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

    <!-- Exibir Gráfico de Ranking de Universidades, Vertical: Nome das universidades / Horizontal: valorTotalLiberado -->

    <!-- Exibir tabela com nome dos Convenenentes, valor total liberado e Universidade que repassou para o convenente -->
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

    <!-- Exibir Gráfico de Ranking de Convenentes , Vertical: Nome dos convenentes / Horizontal: valorTotalLiberado -->
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
// import { exportCSV } from "primevue/utils";

export default {
  components: {
    Dropdown,
    Button,
    DataTable,
    Column
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
      isLoaded: false,

      ifesRankingFormated: [],
      convenentesRankingFormated: []
    }
  },
  async mounted() {
    console.log('created do CompararUniversidades executado')
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
    async generateRanking() {
      try {
        const request = {
          startYear: formatStringStartYear(this.startYear),
          endYear: formatStringEndYear(this.endYear),
          limit: this.limit
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
  width: 100%;
}

h2 {
  font-size: 25px;
  margin: 1em 1em;
  font-weight: bold;
}

.ranking-form-container {
  width: 95%;
  display: flex;
  flex-flow: row;
  margin: 1.5em auto;
  justify-content: flex-start;
  padding: 1.5em 3em;
}

.label-form {
  margin-left: 2em;
  font-size: 16px;
}

.dropdown {
  width: 100%;
}

.btn-ranking {
  color: white;
  margin-left: 1em;
  padding: 1em;
  min-width: 10%;
  background-color: #4b5d9d;
}

.data-table-container {
  width: 90%;
  margin: 1.5em auto;
  border: black 1.5px solid;
  border-radius: 3px;
}

.container-table-header {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
}
</style>
