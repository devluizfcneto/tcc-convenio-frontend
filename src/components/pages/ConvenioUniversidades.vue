<template>
  <div class="container-main">
    <div class="container-datatable">
      <div v-if="isLoading" class="loading-overlay">
        <ProgressSpinner />
      </div>
      <CustomDataTable
        :data="allConvenios"
        :columns="columns"
        :paginator="true"
        :rows="tableRows"
        @update:rows="updateTableRows"
        @open-detail="openModal"
        ref="customDataTable"
      >
        <template #header>
          <div class="container-table-header">
            <h2>Convênios</h2>
            <div class="container-funcs">
              <Button
                :class="{ loading: isLoading }"
                icon="pi pi-refresh"
                rounded
                raised
                @click="getConvenios"
              ></Button>
              <Button
                icon="pi pi-external-link"
                severity="success"
                label="Exportar Tabela"
                @click="exportCSV"
              ></Button>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="container-table-footer">
            <Button type="button" icon="pi pi-download" @click="exportCSV" text></Button>
          </div>
        </template>
      </CustomDataTable>
    </div>
    <Modal v-if="convenioSelected" :convenio="convenioSelected" v-model:show="showModal"></Modal>
    <Toast />
  </div>
</template>

<script>
import Button from 'primevue/button'
import Modal from '@/components/Common/Modal.vue'
import Toast from 'primevue/toast'
import ConvenioService from '@/services/ConvenioService.ts'
import { formatDate, formatValue } from '@/utils/format'
import CustomDataTable from '@/components/Common/CustomDataTable.vue'
import { FilterMatchMode } from 'primevue/api'
import { downloadCSV, formatDataToCSV } from '@/utils/exportCsv'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  components: { Button, Modal, Toast, CustomDataTable, ProgressSpinner },
  data() {
    return {
      allConvenios: [],
      showModal: false,
      isLoading: false,
      convenioSelected: null,
      tableRows: 10,
      filters: {
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
        origin: { value: null, matchMode: FilterMatchMode.CONTAINS },
        acronym: { value: null, matchMode: FilterMatchMode.CONTAINS },
        destination: { value: null, matchMode: FilterMatchMode.CONTAINS },
        destinationType: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
      },
      columns: [
        {
          field: 'detailUrl',
          header: 'Detalhe',
          style: { width: '7%', textAlign: 'center' },
          detail: true
        },
        {
          field: 'description',
          header: 'Objeto',
          style: { width: '20%', textAlign: 'center' },
          filterable: true,
          filterPlaceholder: 'Filtrar por objeto',
          exportHeader: 'Objeto'
        },
        {
          field: 'origin',
          header: 'Concedente',
          style: { width: '8%', textAlign: 'center' },
          filterable: true,
          exportHeader: 'Concedente'
        },
        {
          field: 'acronym',
          header: 'UF',
          style: { width: '5%', textAlign: 'center' },
          filterable: true,
          exportHeader: 'Ifes'
        },
        {
          field: 'destination',
          header: 'Convenente',
          style: { width: '10%', textAlign: 'center' },
          filterable: true,
          exportHeader: 'Convenente'
        },
        {
          field: 'destinationType',
          header: 'Tipo Convenente',
          style: { width: '8%', textAlign: 'center' },
          filterable: true,
          exportHeader: 'Tipo Convenente'
        },
        {
          field: 'totalValueReleased',
          header: 'Valor Total Liberado',
          style: { width: '10%', textAlign: 'center' },
          sortable: true,
          exportHeader: 'Valor Total Liberado',
          format: formatValue
        },
        {
          field: 'totalValue',
          header: 'Valor Total Contratado',
          style: { width: '10%', textAlign: 'center' },
          sortable: true,
          exportHeader: 'Valor Total Contratado',
          format: formatValue
        },
        {
          field: 'startEffectiveDate',
          header: 'Data Inicio Vigência',
          style: { width: '8%', textAlign: 'center' },
          sortable: true,
          exportHeader: 'Data Inicio Vigencia',
          format: formatDate
        },
        {
          field: 'endEffectiveDate',
          header: 'Data Fim Vigência',
          style: { width: '8%', textAlign: 'center' },
          sortable: true,
          exportHeader: 'Data Fim Vigencia',
          format: formatDate
        }
      ],
      tableProps: {
        stripedRows: true,
        tableStyle: 'min-width: 10rem',
        sortMode: 'multiple',
        removableSort: true,
        showGridlines: true
      }
    }
  },
  async mounted() {
    await this.getConvenios()
  },
  methods: {
    formatDataToCSV,
    downloadCSV,
    exportCSV() {
      const dataToExport = this.$refs.customDataTable.displayedData
      const csvData = this.formatDataToCSV(dataToExport, this.columns)
      const fileName = `convenios-${new Date().getTime()}`
      this.downloadCSV(csvData, fileName)
    },
    openModal(convenioNumber) {
      this.showModal = true
      this.convenioSelected = this.allConvenios.find(
        (convenio) => convenioNumber === convenio.number
      )
    },
    showError(errorMessage) {
      this.$toast.add({
        severity: 'error',
        summary: 'Erro no Servidor!',
        detail: errorMessage,
        life: 5000
      })
    },
    async getConvenios() {
      this.isLoading = true
      try {
        const response = await ConvenioService.getAllConvenios()
        this.allConvenios = response
        this.transformData()
      } catch (error) {
        this.showError(error.message)
        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    },
    transformData() {
      this.allConvenios = this.allConvenios.map((convenio) => ({
        ...convenio,
        acronym: convenio.ifes.acronym,
        destination: convenio.convenente.name,
        destinationType: convenio.convenente.type
      }))
    },
    formatDate,
    formatValue,
    updateFilters(newFilters) {
      this.filters = { ...newFilters }
    },
    updateTableRows(newRows) {
      this.tableRows = newRows
    }
  }
}
</script>

<style scoped>
.container-main {
  width: 100%;
  font-family: sans-serif;
}

.container-table-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

h2 {
  font-size: 1.5em;
  font-weight: bold;
}

.container-funcs {
  display: flex;
  gap: 1em;
}

.container-datatable {
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
}

.container-table-footer {
  width: 65%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1em;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.icon-detail {
  cursor: pointer;
}

.loading {
  pointer-events: none;
  opacity: 0.7;
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
