<template>
  <div class="custom-table-container">
    <div class="table-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <table class="custom-table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.field"
            :style="col.style"
            @click="handleSort(col)"
            :class="{
              'sortable-header': col.sortable,
              'sorted-asc': col.field === sortKey && sortOrder === 'asc',
              'sorted-desc': col.field === sortKey && sortOrder === 'desc'
            }"
          >
            {{ col.header }}
            <span v-if="col.sortable" class="sort-icon">
              <i v-if="col.field === sortKey && sortOrder === 'asc'" class="pi pi-sort-up"></i>
              <i v-if="col.field === sortKey && sortOrder === 'desc'" class="pi pi-sort-down"></i>
            </span>
            <div v-if="col.filterable" class="filter-container">
              <input
                type="text"
                v-model="filterValues[col.field]"
                @input="filterData"
                :placeholder="col.filterPlaceholder || 'Filtrar...'"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in displayedData" :key="row.id">
          <td v-for="(col, index) in columns" :key="col.field" :style="col.style">
            <template v-if="index === 0 && col.detail">
              <i
                class="pi pi-info-circle icon-detail"
                @click="$emit('open-detail', row.number)"
              ></i>
            </template>
            <template v-else>
              <span v-if="col.format">
                {{ col.format(row[col.field]) }}
              </span>
              <span v-else>
                {{ row[col.field] }}
              </span>
            </template>
          </td>
        </tr>
        <tr v-if="displayedData.length === 0">
          <td :colspan="columns.length" class="no-data">Nenhum registro encontrado.</td>
        </tr>
      </tbody>
    </table>
    <div class="table-footer" v-if="$slots.footer">
      <div class="pagination" v-if="paginator && (serverSide ? totalRecords > 0 : filteredData.length > 0)">
        <div class="rows-per-page">
          <span>Itens por página:</span>
          <select :value="rows" @input="$emit('update:rows', Number($event.target.value))">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div class="page-navigation">
          <button @click="prevPage" :disabled="activePage === 1">
            <i class="pi pi-chevron-left"></i>
          </button>
          <span>Página {{ activePage }} de {{ totalPages }}</span>
          <button @click="nextPage" :disabled="activePage === totalPages">
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
      </div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomDataTable',
  props: {
    data: { type: Array, required: true },
    columns: { type: Array, required: true },
    paginator: { type: Boolean, default: false },
    rows: { type: Number, default: 10 },
    totalRecords: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 },
    serverSide: { type: Boolean, default: false }
  },
  data() {
    return {
      filterValues: {},
      localCurrentPage: 1,
      sortKey: null,
      sortOrder: 'asc',
      filterTimeout: null
    }
  },
  computed: {
    activePage() {
      return this.serverSide ? this.currentPage : this.localCurrentPage
    },
    filteredData() {
      return this.data.filter((row) => {
        return this.columns.every((col) => {
          if (!col.filterable || !this.filterValues[col.field]) {
            return true
          }
          const filterValue = String(this.filterValues[col.field]).toLowerCase()
          const cellValue = String(row[col.field]).toLowerCase()
          return cellValue.includes(filterValue)
        })
      })
    },
    displayedData() {
      // Se for serverSide, retorna os dados diretamente pois já vêm filtrados e paginados
      if (this.serverSide) {
        return this.data
      }

      // Lógica original para frontend
      const sortedData = [...this.filteredData]

      if (this.sortKey) {
        sortedData.sort((a, b) => {
          const aValue = a[this.sortKey]
          const bValue = b[this.sortKey]

          if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1
          else if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1
          else return 0
        })
      }

      if (!this.paginator) return sortedData

      const startIndex = (this.localCurrentPage - 1) * this.rows
      const endIndex = startIndex + this.rows

      return sortedData.slice(startIndex, endIndex)
    },
    totalPages() {
      if (!this.paginator) return 1
      
      if (this.serverSide) {
        return Math.ceil(this.totalRecords / this.rows)
      }
      
      return Math.ceil(this.filteredData.length / this.rows)
    }
  },
  methods: {
    filterData() {
      if (this.serverSide) {
        // Debounce para evitar muitas requisições
        clearTimeout(this.filterTimeout)
        this.filterTimeout = setTimeout(() => {
          this.$emit('filter-change', this.filterValues)
        }, 500)
      } else {
        this.localCurrentPage = 1
      }
    },
    nextPage() {
      if (this.serverSide) {
        if (this.currentPage < this.totalPages) {
          this.$emit('page-change', { page: this.currentPage + 1 })
        }
      } else {
        if (this.localCurrentPage < this.totalPages) this.localCurrentPage++
      }
    },
    prevPage() {
      if (this.serverSide) {
        if (this.currentPage > 1) {
          this.$emit('page-change', { page: this.currentPage - 1 })
        }
      } else {
        if (this.localCurrentPage > 1) this.localCurrentPage--
      }
    },
    handleSort(col) {
      if (col.sortable) {
        if (this.serverSide) {
          const newSortOrder = (this.sortKey === col.field && this.sortOrder === 'asc') ? 'DESC' : 'ASC'
          this.sortKey = col.field
          this.sortOrder = newSortOrder.toLowerCase()
          this.$emit('sort-change', { 
            sortField: col.field, 
            sortOrder: newSortOrder 
          })
        } else {
          if (this.sortKey === col.field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
          } else {
            this.sortKey = col.field
            this.sortOrder = 'asc'
          }
        }
      }
    }
  },
  emits: ['open-detail', 'update:rows', 'page-change', 'filter-change', 'sort-change'],
  beforeDestroy() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout)
    }
  }
}
</script>

<style scoped>
.custom-table-container {
  width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #ddd;
  table-layout: fixed;
  box-sizing: border-box;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;
  font-size: 13px;
}

.custom-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.filter-container {
  margin-top: 5px;
}

.filter-container input {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.no-data {
  text-align: center;
  padding: 10px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
  padding: 0 1em;
  box-sizing: border-box;
  width: 100%;
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 5px;
  box-sizing: border-box;
}

.rows-per-page select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.icon-detail {
  cursor: pointer;
  font-size: 1.2em;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  width: 100%;
}

.table-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  box-sizing: border-box;
  width: 100%;
}

.sortable-header {
  cursor: pointer;
}

.sort-icon {
  margin-left: 5px;
}
</style>
