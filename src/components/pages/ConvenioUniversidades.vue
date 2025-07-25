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
        :totalRecords="totalRecords"
        :currentPage="currentPage"
        :serverSide="true"
        @update:rows="updateTableRows"
        @open-detail="openModal"
        @page-change="onPageChange"
        @filter-change="onFilterChange"
        @sort-change="onSortChange"
        ref="customDataTable"
      >
        <template #header>
          <div class="container-table-header">
            <div class="header-title-section">
              <h2>Convênios</h2>
              <span class="total-records" v-if="totalRecords > 0">
                ({{ totalRecords.toLocaleString('pt-BR') }} {{ totalRecords === 1 ? 'registro' : 'registros' }})
              </span>
            </div>
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
            <div class="footer-info">
              <span class="records-info" v-if="totalRecords > 0">
                Total: {{ totalRecords.toLocaleString('pt-BR') }} registros
              </span>
            </div>
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
      totalRecords: 0,
      currentPage: 1,
      limit: 10,
      sortBy: 'startEffectiveDate',
      sortOrder: 'DESC',
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
      columnsToExport: [
        {
          field: 'detailUrl',
          header: 'Detalhe',
        },
        {
          field: 'description',
          header: 'Objeto',
          exportHeader: 'Objeto'
        },
        {
          field: 'origin',
          header: 'Concedente',
          exportHeader: 'Concedente'
        },
        {
          field: 'acronym',
          header: 'UF',
          exportHeader: 'Ifes'
        },
        {
          field: 'destination',
          header: 'Convenente',
          exportHeader: 'Convenente'
        },
        {
          field: 'destinationType',
          header: 'Tipo Convenente',
          exportHeader: 'Tipo Convenente'
        },
        {
          field: 'totalValueReleased',
          header: 'Valor Total Liberado',
          exportHeader: 'Valor Total Liberado',
          format: formatValue
        },
        {
          field: 'totalValue',
          header: 'Valor Total Contratado',
          exportHeader: 'Valor Total Contratado',
          format: formatValue
        },
        {
          field: 'valueLastRelease',
          header: 'Ultimo Valor Liberado',
          exportHeader: 'Ultimo Valor Liberado',
          format: formatValue
        },
        {
          field: 'startEffectiveDate',
          header: 'Data Inicio Vigência',
          exportHeader: 'Data Inicio Vigencia',
          format: formatDate
        },
        {
          field: 'endEffectiveDate',
          header: 'Data Fim Vigência',
          exportHeader: 'Data Fim Vigencia',
          format: formatDate
        },
        {
          field: 'destinationDetailUrl',
          header: 'Detalhe Convenente',
          exportHeader: 'Detalhe Convenente'
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
    async exportCSV() {
      this.isLoading = true
      try {
        const activeFilters = this.getActiveFilters()
        // Adicionar parâmetro 'all: true' para exportar todos os registros
        const filtersWithAll = { ...activeFilters, all: true }
        
        const response = await ConvenioService.getAllConvenios(
          1,
          10,  
          this.sortBy,
          this.sortOrder,
          filtersWithAll
        )
        
        const csvData = this.formatDataToCSV(response.data, this.columnsToExport)
        const fileName = `convenios-completo-${new Date().getTime()}`
        this.downloadCSV(csvData, fileName)
      } catch (error) {
        this.showError('Erro ao exportar dados: ' + error.message)
      } finally {
        this.isLoading = false
      }
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
        const activeFilters = this.getActiveFilters()
        const response = await ConvenioService.getAllConvenios(
          this.currentPage,
          this.limit,
          this.sortBy,
          this.sortOrder,
          activeFilters
        )
        this.allConvenios = response.data
        this.totalRecords = response.metadata.totalCount
        this.currentPage = response.metadata.currentPage
      } catch (error) {
        this.showError(error.message)
      } finally {
        this.isLoading = false
      }
    },
    getActiveFilters() {
      const activeFilters = {}
      // Mapeamento dos campos da interface para os campos esperados pela API
      const fieldMapping = {
        'acronym': 'ifesAcronym',           
        'destinationType': 'convenenteType'
      }
      
      Object.keys(this.filters).forEach(key => {
        const filterValue = this.filters[key].value
        if (filterValue && filterValue.trim() !== '') {
          // Usar o nome mapeado se existir, senão usar o nome original
          const apiFieldName = fieldMapping[key] || key
          activeFilters[apiFieldName] = filterValue
        }
      })
      return activeFilters
    },
    async onPageChange(event) {
      this.currentPage = event.page
      await this.getConvenios()
    },
    async onFilterChange(filters) {
      // Atualizar os filtros do componente
      Object.keys(filters).forEach(key => {
        if (this.filters[key]) {
          this.filters[key].value = filters[key]
        }
      })
      this.currentPage = 1
      await this.getConvenios()
    },
    async onSortChange(event) {
      // Mapeamento dos campos de ordenação da interface para os campos da API
      const sortFieldMapping = {
        'acronym': 'ifesAcronym' // Ordenação por sigla da IFES
      }
      
      this.sortBy = sortFieldMapping[event.sortField] || event.sortField
      this.sortOrder = event.sortOrder
      this.currentPage = 1
      await this.getConvenios()
    },
    formatDate,
    formatValue,
    updateFilters(newFilters) {
      this.filters = { ...newFilters }
    },
    async updateTableRows(newRows) {
      this.tableRows = newRows
      this.limit = newRows
      this.currentPage = 1 // Resetar para primeira página
      await this.getConvenios()
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

.header-title-section {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
}

.total-records {
  font-size: 0.9em;
  color: #666;
  font-weight: normal;
}

h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
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
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.footer-info {
  flex: 1;
}

.records-info {
  font-size: 0.9em;
  color: #666;
  font-weight: 500;
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
