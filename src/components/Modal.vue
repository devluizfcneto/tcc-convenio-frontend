<template>
    <div class="modal-overlay" v-if="show" @click.self="closeModal"> 
        <div class="my-modal">
            <div class="modal-header">
                <h2> Convênio {{ convenio.number }}</h2>
                <Button class="btn-close" icon="pi pi-times" text raised rounded aria-label="Cancel"  @click="closeModal"></Button>
            </div>
            <div class="modal-content">
                <p> <b> Detalhes: </b>  <a :href="convenio.detailUrl" target="_blank"> {{ convenio.detailUrl }} </a> </p> 
                <p> <b> Objeto: </b> {{ convenio.description }} </p>
                <p> <b> Concedente: </b> {{ convenio.origin }} </p>
                <p> <b> Convenente: </b> {{ convenio.destination }} </p>
                <p> <b> Detalhe Convenente: </b> <a :href="convenio.convenente.detailUrl" target="_blank"> {{ convenio.convenente.detailUrl }} </a> </p>
                <p> <b> Tipo Convenente: </b> {{ convenio.destinationType }} </p>
                <p> <b> Valor Total Liberado: </b> {{ formatValue(convenio.totalValueReleased) }} </p>
                <p> <b> Valor Total Contratado: </b> {{ formatValue(convenio.totalValue) }} </p>
                <p> <b> Último valor recebido: </b> {{ formatValue(convenio.valueLastRelease )}} </p>
                <p> <b> Última Data do Valor Recebido: </b> {{ formatDate(convenio.lastReleaseDate) }} </p>
                <p> <b> Data Inicio Vigência: </b> {{ formatDate(convenio.startEffectiveDate) }} </p>
                <p> <b> Data Fim Vigência: </b> {{ formatDate(convenio.endEffectiveDate )}} </p>
            </div>
        </div>
       
    </div>
</template>

<script>
import Button from 'primevue/button';
import { formatDate, formatValue } from '@/utils/format';

export default {
    components: {
        Button
    },
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
    data() {
        return {

        }
    },
    mounted() {
        console.log("Mounted de Modal executado");
    },
    methods: {
        closeModal(){
			this.$emit('update:show', false);
		},
        formatDate,
        formatValue
    },
    watch: {
        show(newVal) {}
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
  background-color: #4B5D9D;
}

.modal-header {
    display: flex;
    width: 100%;
    margin: 0 auto;
    justify-content: space-between;
    color: #FFFFFF;
    font-weight: bold;
}

.btn-close {
    background-color: #FFFFFF;
}

.btn-close:hover {
    background-color: #D6D6D6;
}

p {
    color: #FFFFFF;
    font-size: large;
}

a {
    text-decoration: underline;
    color: #FFFFFF;
    font-style: italic;
}

</style>