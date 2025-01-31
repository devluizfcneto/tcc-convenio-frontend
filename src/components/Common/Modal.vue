<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="my-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h2 id="modal-title">Convênio {{ convenio.number }}</h2>
        <Button
          class="btn-close"
          icon="pi pi-times"
          text
          raised
          rounded
          aria-label="Fechar"
          @click="closeModal"
          ref="closeButton"
        />
      </div>
      <div class="modal-content">
        <p>
          <b>Detalhes:</b>
          <a :href="convenio.detailUrl" target="_blank">{{ convenio.detailUrl }}</a>
        </p>
        <p><b>Objeto:</b> {{ convenio.description }}</p>
        <p><b>Concedente:</b> {{ convenio.origin }}</p>
        <p><b>Convenente:</b> {{ convenio.destination }}</p>
        <p v-if="convenio.convenente && convenio.convenente.detailUrl">
          <b> Detalhe Convenente: </b>
          <a :href="convenio.convenente.detailUrl" target="_blank">
            {{ convenio.convenente.detailUrl }}
          </a>
        </p>
        <p><b>Tipo Convenente:</b> {{ convenio.destinationType }}</p>
        <p><b>Valor Total Liberado:</b> {{ formatValue(convenio.totalValueReleased) }}</p>
        <p><b>Valor Total Contratado:</b> {{ formatValue(convenio.totalValue) }}</p>
        <p v-if="convenio.valueLastRelease">
          <b>Último valor recebido:</b> {{ formatValue(convenio.valueLastRelease) }}
        </p>
        <p v-if="convenio.lastReleaseDate">
          <b>Última Data do Valor Recebido:</b> {{ formatDate(convenio.lastReleaseDate) }}
        </p>
        <p><b>Data Inicio Vigência:</b> {{ formatDate(convenio.startEffectiveDate) }}</p>
        <p><b>Data Fim Vigência:</b> {{ formatDate(convenio.endEffectiveDate) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button'
import { formatDate, formatValue } from '@/utils/format'

export default {
  components: { Button },
  props: {
    convenio: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.show) {
      this.$nextTick(() => {
        this.$refs.closeButton.$el.focus()
      })
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:show', false)
    },
    formatDate,
    formatValue
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.closeButton.$el.focus()
        })
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.my-modal {
  padding: 20px;
  border-radius: 8px;
  width: 50%;
  max-width: 70%;
  background-color: #4b5d9d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  margin-bottom: 1rem;
}

.btn-close {
  background-color: #ffffff;
}

.btn-close:hover {
  background-color: #d6d6d6;
}

.modal-content p {
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  word-wrap: break-word;
}

.modal-content b {
  margin-right: 0.3rem;
}

.modal-content a {
  color: #ffffff;
  text-decoration: underline;
  font-style: italic;
  word-wrap: break-word;
}
</style>
