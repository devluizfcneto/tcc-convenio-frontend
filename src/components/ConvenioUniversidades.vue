<template>
	<div class="container-main">
		<div class="container-datatable">
			<DataTable 
				:value="allConvenios" 
				stripedRows paginator 
				:rows="10" :rowsPerPageOptions="[10, 20, 50]" 
				tableStyle="min-width: 10rem"
				sortMode="multiple" removableSort
				showGridlines
				scrollable  scrollHeight="100rem"
				v-model:filters="filters"
				:globalFilterFields="['description', 'origin', 'destination', 'destinationType', 'value', 'releasedYear']"
				filterDisplay="row" 
				ref="dt" exportFilename="convenios"
				style="margin-top: 2em;"
				size="small"
			>
			<!-- Datatable Header -->
			<template #header>
                <div class="container-table-header">
                    <h2>Convênios</h2>
                    <Button style="margin-right: 1em" icon="pi pi-refresh" rounded raised @click.lazy="getConvenios"></Button>
					<div class="flex justify-content-end">
						<IconField iconPosition="left">
							<InputIcon>
								<i class="pi pi-search"></i>
							</InputIcon>
							<InputText v-model="filters['global'].value" placeholder="Pesquise algo na tabela..." />
						</IconField>
                	</div>
					<div style="text-align: left; margin-left: 1em">
                    	<Button icon="pi pi-external-link" severity="success" label="Exportar Tabela" @click="exportCSV($event)" ></Button>
                	</div>					
                </div>
            </template>

			<template #empty> Nenhum convênio encontrado. </template>
            <template #loading> Carregando convênios, por favor aguarde. </template>

			<Column field="detailUrl" header="Detalhe" style="width: 1%; text-align: center">
				<template #body="slotProps">
					<!-- Alterar futuramente para exibir um modal com detalhamento do conênio clicado -->
					<i @click="openModal(slotProps.data.number)" class="pi pi-info-circle icon-detail"></i>
                </template>
			</Column>

			<Column field="description" header="Objeto" style="width: 40%" filterField="description" :showFilterMenu="false" exportHeader="Objeto">
				<template #body="{ data }">
                    {{ data.description }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Filtre..." />
                </template>
			</Column>
					
			
			<Column field="origin" header="Concedente" style="width: 15%" filterField="origin" :showFilterMenu="false" exportHeader="Concedente">
				<template #body="{ data }">
                    {{ data.origin }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Filtre..." />
                </template>
			</Column>

			<Column field="acronym" header="UF" style="width: 5%" filterField="acronym" :showFilterMenu="false" exportHeader="Ifes">
				<template #body="{ data }">
                    {{ data.acronym }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Filtre..." />
                </template>
			</Column>

			<Column field="destination" header="Convenente" style="width: 15%" filterField="destination" :showFilterMenu="false" exportHeader="Convenente">
				<template #body="{ data }">
                    {{ data.destination }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Filtre..." />
                </template>
			</Column>

			<Column field="destinationType" header="Tipo Convenente" style="width: 5%" filterField="destinationType" :showFilterMenu="false" exportHeader="Tipo Convenente">
				<template #body="{ data }">
                    {{ data.destinationType }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Filtre..." />
                </template>
			</Column>

			<Column field="totalValueReleased" sortable header="Valor Total Liberado" style="width: 5%; text-align: center;" exportHeader="Valor Total Liberado">
				<template #body="{ data }"> 
					{{ formatValue(data.totalValueReleased) }}
				</template>
			</Column>
			<Column field="totalValue" sortable header="Valor Total Contratado" style="width: 5%; text-align: center;" exportHeader="Valor Total Contratado">
				<template #body="{ data }"> 
					{{ formatValue(data.totalValue) }}
				</template>
			</Column>

			<Column field="startEffectiveDate" sortable header="Data Inicio Vigência" style="width: 2%" exportHeader="Data Inicio Vigencia">
				<template #body="{ data }"> 
					{{ formatDate(data.startEffectiveDate) }}
				</template>
			</Column>
			
			<Column field="endEffectiveDate" sortable header="Data Fim Vigência" style="width: 2%" exportHeader="Data Fim Vigencia">
				<template #body="{ data }"> 
					{{ formatDate(data.endEffectiveDate) }}
				</template>
			</Column>

			<!-- Pagination buttons -->
			<template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text @click.lazy="getConvenios" ></Button>
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-download" @click="exportCSV($event)" text ></Button>
            </template>
		</DataTable>
		</div>
		
		<Modal v-if="convenioSelected" :convenio="convenioSelected" v-model:show="showModal"></Modal>
		<Toast/>

	</div>
</template>

<script>
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import {FilterMatchMode} from 'primevue/api';
import Modal from "@/components/Modal.vue";
import Toast from 'primevue/toast';
import ConvenioService from "@/services/ConvenioService.ts";
import { formatDate, formatValue } from '@/utils/format';

export default {
	components: {
		MultiSelect,
		Dropdown,
		Button,
		DataTable,
		Column,
		IconField,
		InputIcon,
		InputText,
		Modal,
		Toast
	},
	data() {
		return {			
			filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                description: { value: null, matchMode: FilterMatchMode.CONTAINS },
                origin: { value: null, matchMode: FilterMatchMode.CONTAINS },
				acronym: { value: null, matchMode: FilterMatchMode.CONTAINS },
                destination: { value: null, matchMode: FilterMatchMode.CONTAINS },
				destinationType: { value: null, matchMode: FilterMatchMode.STARTS_WITH}
            },

			allConvenios: [],

			loading: true,
			showModal: false,
			convenioSelected: null,
		}
	},

	async mounted() {
		await this.getConvenios();
	},

	methods: {
		exportCSV(){
			this.$refs.dt.exportCSV();
		},

		openModal(convenioNumber) {
			this.showModal = true;
			this.convenioSelected = this.allConvenios.find(convenio => convenioNumber === convenio.number);
		},

		showError(errorMessage) {
            this.$toast.add({ severity: 'error', summary: 'Erro no Servidor!', detail: errorMessage, life: 5000 });
        },

		async getConvenios(){
			console.log("getConvenios ConvenioUniversidades method");
			try {
				const response = await new ConvenioService().getAllConvenios();
				this.allConvenios = response;
				this.transformData();
			} catch (error){
				console.log(error.name, error.message);	
				this.showError(error.message);
			}
		},

		transformData(){
			this.allConvenios = this.allConvenios.map(convenio => {
				return {
					...convenio,
					acronym: convenio.ifes.acronym,
					destination: convenio.convenente.name,
					destinationType: convenio.convenente.type
				}
			});
		},
		formatDate,
		formatValue

	},
	watch: {
		showModal(newVal){}
	}

}
</script>

<style scoped>
.container-main {
	width: 95%;
}

h2 {
	width: 60%;
	font-size: 23px;
	font-weight: bold;
	margin: 1em auto;
}

.container-ifes-selected{
	width: 90%;
	display: flex;
	margin: 0 auto;
	margin-bottom: 2em;
	flex-flow: column;
	background-color: #DDDDDD;
	border-radius: 10px;
	padding: 2em;
}

ul {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
	width: auto;
	list-style: none;
}

li {
	margin: 0.5em;
	font-size: 18px;
}

.container-table-header {
	width: 100%;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.container-datatable{
	width: 95%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
}

.icon-detail:hover {
	cursor: pointer;
}


</style>