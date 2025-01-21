<template>
	<div class="container-main">
		<h2> Comparar Universidades </h2>
		<form>
			<div class="container-ifes-inputs">
				<div class="container-input-ife-n" v-for="(fields, index) in initialComparison" :key="index">
					<label> Universidade {{ index + 1 }}: </label>
					<Dropdown v-model="ifesSelected[index]" :options="allIfes" optionLabel="name" optionValue="code"
						placeholder="Selecione Universidade" filter class="ifes-input" />
				</div>

				<Button @click="addNewIfesInput" style="margin: 0 1.5em" type="button" icon="pi pi-plus-circle"
					rounded></Button>
			</div>

			<div class="container-period-inputs">
				<label for="startYear"> De: </label>
				<Dropdown v-model="startYear" :options="yearOptions" placeholder="Data Inicio..." dateFormat="yy"
					showIcon inputId="startYear" iconDisplay="input" />

				<label for="endYear"> Até: </label>
				<Dropdown v-model="endYear" :options="yearOptions" placeholder="Data Fim..." dateFormat="yy" showIcon
					inputId="endYear" iconDisplay="input" />

				<Button @click.lazy="doComparison" type="button" label="Comparar" class="btn-comparar"></Button>
			</div>
		</form>

		<div class="container-tree-table-comparison">
			<TreeTable v-if="comparisonLoaded" :value="ifesTree" size="small">
				<template #header>
					<h2> Comparação de Convenios entre Universidades no período de {{
						requestComparison.queryParam.startYear }} até {{ requestComparison.queryParam.endYear }}</h2>
					<!-- <div class="text-xl font-bold">Comparação de convenios</div> -->
				</template>
				<Column field="nome" header="Nome" expander style="width: 55%;"></Column>
				<Column field="qtdConvenios" header="Qtd. Convenios" style="width: 10%;"></Column>
				<Column header="Valor Total Liberado" style="width: 15%;">
					<template #body="slotProps">
						{{ formatValue(slotProps.node.data.valorTotalLiberado) }}
					</template>
				</Column>
				<Column header="Valor Total Contratado" style="width: 15%;">
					<template #body="slotProps">
						{{ formatValue(slotProps.node.data.valorTotalContratado) }}
					</template>
				</Column>
				<Column field="porcentagemPaga" header="% Pago" style="width: 5%;"></Column>
			</TreeTable>
		</div>

		<div class="container-tab-view-comparison" v-if="comparisonLoaded" ref="chartsContainer">
			<div class="tab-view-header-container">
				<h2 class="tab-view-header"> Gráficos de comparação de Convenios entre Universidades selecionadas</h2>
				<Button class="export-pdf-btn" type="button" icon="pi pi-download" @click="exportDivToPDF"></Button>
			</div>
			<div class="continer-tab-panel" v-for="(ife, index) in ifesTree" :key="ife.key">
				<h3> Convênios da Universidade {{ ife.data.nome }} </h3>
				<div class="container-charts-comparison">
					<div class="container-chart">
						<p> Quantidade de convênios de cada convenente: </p>
						<Chart class="full-detailed-chart" type="bar" :data="buildHorizontalBarChartQtdConvenios(index)"
							:options="buildHorizontalBarChartDataOptions(true, index)"></Chart>
					</div>
					<div class="container-chart">
						<p> Valor total liberado para cada convenente: </p>
						<Chart class="full-detailed-chart" type="bar"
							:data="buildStackedHorizontalBarChartDataValorTotalLiberado(index)"
							:options="buildStackedHorizontalBarChartDataOptions(index)"></Chart>

					</div>
				</div>
			</div>
			<div class="continer-tab-panel">
				<h3> Convênios de todas as Universidades selecionadas </h3>
				<div class="container-charts-comparison">
					<div class="container-chart">
						<p> Quantidade total de Convênios em cada Universidade: </p>
						<div class="container-charts-comparison">
							<Chart class="detailed-chart" type="bar" :data="buildHorizontalBarChartQtdAllIfes()"
								:options="buildHorizontalBarChartDataOptions(true)"></Chart>
							<Chart class="chart" type="doughnut" :data="buildDoughnutChartDataQtdConvenios()"
								:options="buildDoughnutChartDataOptions()" />
						</div>
					</div>

					<div class="container-chart">
						<p> Valor total liberado para Convênios em cada Universidade: </p>
						<div class="container-charts-comparison">
							<Chart class="detailed-chart" type="bar"
								:data="buildStackedHorizontalBarChartDataValorTotalLiberadoAllIfes()"
								:options="buildStackedHorizontalBarChartDataOptions()"></Chart>
							<Chart class="chart" type="doughnut" :data="buildDoughnutChartDataValorTotalLiberado()"
								:options="buildDoughnutChartDataOptions(true)" />
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>

	<Toast />

</template>


<script>
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import IfesService from '@/services/IfesService';
import Toast from 'primevue/toast';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { formatStringEndYear, formatStringStartYear, formatValue } from "@/utils/format";
import Chart from 'primevue/chart';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
	components: {
		Dropdown,
		Button,
		Calendar,
		Toast,
		TreeTable,
		Column,
		Chart,
		TabView,
		TabPanel
	},
	data() {
		return {
			allIfes: [],

			startYear: "",
			endYear: "",
			yearOptions: [],

			ifesLength: 3,
			ifesSelected: Array(this.ifesLength).fill(null),
			initialComparison: [0, 1],

			comparisonLoaded: false,
			requestComparison: {},

			responseComparison: {},
			ifesTree: {}
		}
	},
	async mounted() {
		console.log("created do CompararUniversidades executado");
		this.initializeYearsOptions();
		await this.getAllIfes();
	},
	methods: {
		addNewIfesInput() {
			if (this.initialComparison.length < this.ifesLength) {
				this.initialComparison.push(this.initialComparison.length);
			}
		},

		showErrors(message) {
			this.$toast.add({ severity: 'error', summary: 'Erro no Servidor!', detail: message, life: 5000 });
		},

		async getAllIfes() {
			console.log("Executando getAllIfes");
			try {
				const response = await new IfesService().getAllIfes();
				this.allIfes = response;
			} catch (error) {
				console.error(error.name, error.message);
				this.showErrors(error.message);
			}
		},

		async doComparison() {
			console.log("Executando doComparison");
			this.createComparisonRequest();
			try {
				const response = await new IfesService().compareIfesConvenios(this.requestComparison);
				this.responseComparison = response;
				this.comparisonLoaded = true;
				this.ifesTree = this.buildTreeFormat();
			} catch (error) {
				this.comparisonLoaded = false;
				console.error(error.name, error.message);
				this.showErrors(error.message);
			}
		},

		createComparisonRequest() {
			this.requestComparison.body = {
				ifesSelected: this.ifesSelected
			};

			this.requestComparison.queryParam = {
				startYear: formatStringStartYear(this.startYear),
				endYear: formatStringEndYear(this.endYear)
			}
		},

		initializeYearsOptions() {
			const currentYear = new Date().getFullYear();
			this.yearOptions = Array.from({ length: (currentYear + 10) - 2000 + 1 }, (_, index) => {
				return 2000 + index;
			});
			this.startYear = currentYear;
			this.endYear = currentYear;
		},

		buildTreeFormat() {
			return this.responseComparison.map((universidade, index) => {

				const groupedConvenios = universidade.listaConvenios.reduce((acc, convenio) => {
					if (!acc[convenio.convenente.name]) {
						acc[convenio.convenente.name] = [];
					}
					acc[convenio.convenente.name].push(convenio);
					return acc;
				}, {});

				let totalValorLiberadoUniversidade = 0;
				let totalValorContratadoUniversidade = 0;

				const convenenteNodes = Object.keys(groupedConvenios).map((convenente, convenenteIndex) => {
					const convenios = groupedConvenios[convenente];
					const totalConvenios = convenios.length;

					let totalValorLiberadoConvenente = 0;
					let totalValorContratadoConvenente = 0;

					convenios.forEach((convenio) => {
						totalValorLiberadoConvenente += convenio.totalValueReleased;
						totalValorContratadoConvenente += convenio.totalValue;
					});

					totalValorLiberadoUniversidade += totalValorLiberadoConvenente;
					totalValorContratadoUniversidade += totalValorContratadoConvenente;

					const porcentagemPagaConvenente = (totalValorLiberadoConvenente / totalValorContratadoConvenente) * 100;

					if (totalConvenios > 1) {
						return {
							key: `convenente-${index}-${convenenteIndex}`,
							data: {
								nome: convenente,
								qtdConvenios: totalConvenios,
								valorTotalLiberado: parseFloat(totalValorLiberadoConvenente).toFixed(2),
								porcentagemPaga: porcentagemPagaConvenente.toFixed(2) && porcentagemPagaConvenente.toFixed(2) !== "NaN" ? porcentagemPagaConvenente.toFixed(2) : 0,
								valorTotalContratado: parseFloat(totalValorContratadoConvenente).toFixed(2)
							},

							children: convenios.map((convenio, convenioIndex) => ({
								key: `convenio-${index}-${convenenteIndex}-${convenioIndex}`,
								data: {
									nome: convenio.convenente.name,
									qtdConvenios: 1,
									valorTotalLiberado: parseFloat(convenio.totalValueReleased).toFixed(2),
									porcentagemPaga: ((convenio.totalValueReleased / convenio.totalValue) * 100).toFixed(2) && ((convenio.totalValueReleased / convenio.totalValue) * 100).toFixed(2) !== "NaN" ? ((convenio.totalValueReleased / convenio.totalValue) * 100).toFixed(2) : 0,
									valorTotalContratado: parseFloat(convenio.totalValue).toFixed(2)
								}
							}))
						};
					} else {
						const convenio = convenios[0];
						const porcentagemPagaConvenio = ((convenio.totalValueReleased / convenio.totalValue) * 100).toFixed(2);
						return {
							key: `convenio-${index}-${convenenteIndex}`,
							data: {
								nome: convenio.convenente.name,
								qtdConvenios: 1,
								valorTotalLiberado: parseFloat(convenio.totalValueReleased).toFixed(2),
								porcentagemPaga: porcentagemPagaConvenio && porcentagemPagaConvenio !== "NaN" ? porcentagemPagaConvenio : 0,
								valorTotalContratado: parseFloat(convenio.totalValue).toFixed(2)
							}
						}
					}
				});

				const porcentagemPagaUniversidade = (totalValorLiberadoUniversidade / totalValorContratadoUniversidade * 100).toFixed(2);

				return {
					key: `universidade-${index}`,
					data: {
						nome: universidade.nome,
						qtdConvenios: universidade.qtdConvenios,
						valorTotalLiberado: universidade.valorTotalLiberado.toFixed(2),
						porcentagemPaga: porcentagemPagaUniversidade && porcentagemPagaUniversidade !== "NaN" ? porcentagemPagaUniversidade : 0,
						valorTotalContratado: parseFloat(totalValorContratadoUniversidade).toFixed(2)
					},
					children: convenenteNodes
				};
			});
		},

		formatStringStartYear,
		formatStringEndYear,
		formatValue,

		buildBasicChartDataQtdConvenios() {
			const labels = this.ifesTree.map((node) => {
				return node.data.nome;
			});

			const datas = this.ifesTree.map((node) => {
				return node.data.qtdConvenios;
			})

			return {
				labels: labels,
				datasets: [
					{
						label: 'Quantidade de Convenios',
						data: datas,
						backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246, 0.2)'],
						borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
						borderWidth: 1
					}
				]
			}

		},

		buildBasicChartDataTotalLiberado() {
			const labels = this.ifesTree.map((node) => {
				return node.data.nome;
			});

			const datas = this.ifesTree.map((node) => {
				return node.data.valorTotalLiberado;
			})

			return {
				labels: labels,
				datasets: [
					{
						label: 'Valor Total Liberado',
						data: datas,
						backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246, 0.2)'],
						borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
						borderWidth: 1
					}
				]
			}
		},

		buildBasicChartDataOptions() {
			return {
				plugins: {
					legend: {
						labels: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
						}
					}
				},
				scales: {
					x: {
						ticks: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
						},
						grid: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
						}
					},
					y: {
						beginAtZero: true,
						ticks: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
						},
						grid: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
						}
					}
				}
			}
		},

		buildDoughnutChartDataOptions(numericFloat = false) {
			const documentStyle = getComputedStyle(document.documentElement);
			const textColor = documentStyle.getPropertyValue('--text-color');

			return {
				plugins: {
					legend: {
						labels: {
							cutout: '60%',
							color: textColor,
						}
					},
					datalabels: {
						color: '#000',
						font: {
							weight: 'bold',
							size: 11
						},
						formatter: (value, context) => {
							return numericFloat ? formatValue(value) : value;
						}
					}
				}
			};
		},

		buildDoughnutChartDataQtdConvenios() {
			const documentStyle = getComputedStyle(document.body);

			const labels = this.ifesTree.map((node) => {
				return node.data.nome;
			});

			const data = this.ifesTree.map((node) => {
				return node.data.qtdConvenios;
			});

			return {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--gray-500')],
						hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--gray-400')]
					}
				]
			};
		},

		buildDoughnutChartDataValorTotalLiberado() {
			const documentStyle = getComputedStyle(document.body);

			const labels = this.ifesTree.map((node) => {
				return node.data.nome;
			});

			const data = this.ifesTree.map((node) => {
				return node.data.valorTotalLiberado;
			});

			return {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--gray-500')],
						hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--gray-400')]
					}
				]
			};
		},

		buildHorizontalBarChartDataOptions(dataSetInteger = false, element = null) {
			let ratio = 5;
			if (element != null) {
				ratio = this.ifesTree[element].children.length < 2 ? 8 : 5
			}

			return {
				indexAxis: 'y',
				maintainAspectRatio: true,
				aspectRatio: ratio,
				plugins: {
					legend: {
						labels: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
						},
					},
					datalabels: false
				},
				scales: {
					x: {
						ticks: {
							stepSize: dataSetInteger ? 1 : 0,
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
							font: {
								weight: 500
							}
						},
						grid: {
							display: false,
							drawBorder: false
						}
					},
					y: {
						ticks: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
							font: {
								weight: 1000
							}
						},
						grid: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border'),
						}
					}
				}
			}
		},

		buildHorizontalBarChartDataValorTotalLiberado(index) {
			const convenentes = this.ifesTree[index].children;

			const labels = convenentes.map((convenente) => {
				return convenente.data.nome;
			});

			const data = convenentes.map((convenente) => {
				return convenente.data.valorTotalLiberado;
			});


			return {
				labels: labels,
				datasets: [
					{
						label: 'Valor Total Liberado',
						backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						data: data
					}
				]
			};
		},

		buildHorizontalBarChartQtdConvenios(index) {
			const convenentes = this.ifesTree[index].children;

			const nomesConvenentes = convenentes.map((convenente) => convenente.data.nome);
			const qtdConvenios = convenentes.map((convenente) => convenente.data.qtdConvenios);

			return {
				labels: nomesConvenentes,
				datasets: [
					{
						label: 'Quantidade de Convênios',
						backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						data: qtdConvenios
					}
				]
			}
		},

		buildHorizontalBarChartDataValorTotalLiberadoAllIfes() {
			const ifesName = this.ifesTree.map(ife => ife.data.nome);
			const ifesValorTotalLiberado = this.ifesTree.map(ife => ife.data.valorTotalLiberado);

			return {
				labels: ifesName,
				datasets: [
					{
						label: 'Valor Total Liberado',
						backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						data: ifesValorTotalLiberado
					}
				]
			};
		},

		buildHorizontalBarChartQtdAllIfes() {
			const ifesName = this.ifesTree.map(ife => ife.data.nome);
			const ifesQtdConvenios = this.ifesTree.map(ife => ife.data.qtdConvenios);
			return {
				labels: ifesName,
				datasets: [
					{
						label: 'Quantidade de Convênios',
						backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						data: ifesQtdConvenios
					}
				]
			}
		},

		buildStackedHorizontalBarChartDataOptions(element = null) {
			let ratio = 5;
			if (element != null) {
				ratio = this.ifesTree[element].children.length < 2 ? 8 : 5
			}

			return {
				indexAxis: 'y',
				maintainAspectRatio: true,
				aspectRatio: ratio,
				plugins: {
					tooltips: {
						mode: 'index',
						intersect: false
					},
					legend: {
						labels: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
						}
					},
					datalabels: false
				},
				scales: {
					x: {
						stacked: true,
						ticks: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary')
						},
						grid: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
						}
					},
					y: {
						stacked: true,
						ticks: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
							font: {
								weight: 1000
							}
						},

						grid: {
							color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
						}
					}
				}
			};

		},

		buildStackedHorizontalBarChartDataValorTotalLiberado(index) {
			const convenentes = this.ifesTree[index].children;
			const labels = convenentes.map((convenente) => {
				return convenente.data.nome;
			});

			const valorTotalLiberado = convenentes.map((convenente) => {
				return convenente.data.valorTotalLiberado;
			});

			const valorTotalContratadoMenosLiberado = convenentes.map((convenente) => {
				return convenente.data.valorTotalContratado - convenente.data.valorTotalLiberado;
			});

			return {
				labels: labels,
				datasets: [
					{
						type: 'bar',
						label: 'Pago',
						backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						data: valorTotalLiberado
					},
					{
						type: 'bar',
						label: 'Falta Pagar',
						backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--orange-500'),
						data: valorTotalContratadoMenosLiberado
					}
				]
			}
		},

		buildStackedHorizontalBarChartDataValorTotalLiberadoAllIfes() {
			const ifesName = this.ifesTree.map(ife => ife.data.nome);
			const ifesValorTotalLiberado = this.ifesTree.map(ife => ife.data.valorTotalLiberado);
			const ifesValorTotalContratadoMenosLiberado = this.ifesTree.map(ife => ife.data.valorTotalContratado - ife.data.valorTotalLiberado);

			return {
				labels: ifesName,
				datasets: [
					{
						type: 'bar',
						label: 'Pago',
						backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
						data: ifesValorTotalLiberado
					},
					{
						type: 'bar',
						label: 'Falta Pagar',
						backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--orange-500'),
						data: ifesValorTotalContratadoMenosLiberado
					}
				]
			}
		},

		exportDivToPDF() {

			const applyInlineStyles = (element) => {
				const computedStyle = window.getComputedStyle(element);
				for (let property of computedStyle) {
					element.style[property] = computedStyle.getPropertyValue(property);
				}

				Array.from(element.children).forEach((child) => applyInlineStyles(child));
			};

			// Seleciona a div que contém os gráficos (ou qualquer outro conteúdo que você queira capturar)
			applyInlineStyles(this.$refs.chartsContainer);


			// Usa html2canvas para capturar a div como uma imagem
			html2canvas(this.$refs.chartsContainer, { scale: 2 }).then((canvas) => {
				const imgData = canvas.toDataURL('image/png', 0.8); // Converte o canvas em imagem PNG

				// Cria um novo PDF
				const pdf = new jsPDF({
					orientation: 'portrait',
					unit: 'px',
					format: [canvas.width, canvas.height]
				});

				const pdfWidth = pdf.internal.pageSize.getWidth(); // Largura do PDF
				const pdfHeight = pdf.internal.pageSize.getHeight(); // Altura do PDF

				const imgWidth = canvas.width; // Largura da imagem
				const imgHeight = canvas.height; // Altura da imagem
				const ratio = imgWidth / imgHeight; // Proporção da imagem

				// Ajusta a altura proporcional ao PDF
				const scaledWidth = pdfWidth; // A largura da imagem será a largura total do PDF
				const scaledHeight = pdfWidth / ratio; // Altura proporcional à largura

				let positionY = 0; // Posição inicial no eixo Y
				let page = 0; // Contador de páginas

				// Enquanto a imagem não couber totalmente no PDF, dividimos em páginas
				while (positionY < imgHeight) {
					// Se não for a primeira página, adiciona uma nova página ao PDF
					if (page > 0) {
						pdf.addPage();
					}

					// Corta a imagem para caber na altura do PDF
					const canvasPortion = canvas.getContext('2d').getImageData(
						0,
						positionY,
						imgWidth,
						Math.min(pdfHeight * imgWidth / pdfWidth, imgHeight - positionY)
					);

					const tempCanvas = document.createElement('canvas'); // Canvas temporário
					tempCanvas.width = imgWidth;
					tempCanvas.height = canvasPortion.height;
					tempCanvas.getContext('2d').putImageData(canvasPortion, 0, 0);

					const tempImgData = tempCanvas.toDataURL('image/png', 0.8);

					const margin = 20;
					// Adiciona a parte da imagem ao PDF
					pdf.addImage(
						tempImgData,
						'PNG',
						margin,
						margin,
						pdfWidth - 2 * margin,
						scaledHeight,
						'',
						'FAST'
					);

					positionY += pdfHeight; // Avança para a próxima posição no eixo Y
					page++;
				}

				// Salva o PDF
				pdf.save('comparacao-graficos.pdf');
			});
		}
	}
}

</script>


<style scoped>
.container-main {
	width: 100%;
}

h2 {
	font-size: 25px;
	margin: 1em 1em;
	font-weight: bold;
}

.tab-view-header-container {
	width: 100%;
	display: flex;
	flex-flow: row;
	justify-content: center;
}

.tab-view-header {
	width: 80%;
}

.export-pdf-btn {
	width: 5%;
}

.container-ifes-inputs {
	width: 95%;
	max-width: 100%;
	margin: 0 auto;
	display: flex;
	flex-direction: row;
	align-items: center;
	overflow-x: auto;
}

.container-input-ife-n {
	display: flex;
	flex-direction: column;
	margin-right: 1.5em;
	width: 33%;
}

.container-period-inputs {
	width: 95%;
	margin: 1.5em auto;
	display: flex;
	flex-direction: row;
}

label {
	font-size: 16px;
	margin: 0.5em;
}

.btn-comparar {
	color: white;
	margin-left: 1em;
	padding: 1em;
	min-width: 10%;
	background-color: #4B5D9D;
}

.ifes-input,
.years-input {
	max-height: 6vh;
	font-size: small;
}

.container-tree-table-comparison {
	width: 90%;
	margin: 3em auto;
	display: flex;
	justify-content: center;
}

.container-tab-view-comparison {
	width: 100%;
	margin: 3em auto;
	padding: 1em;
	display: flex;
	flex-flow: row wrap;
	border-radius: 3px;
	border: solid 1px #bcbcbc;
}

.continer-tab-panel {
	width: 100%;
	margin: 1em 0;
	padding: 1em 0;
	border-radius: 3px;
}

h3 {
	text-align: center;
	margin: 0 2.5em;
	font-size: 20px;
}

.container-charts-comparison {
	width: 100%;
	margin: 0.25em auto;
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
}

.container-chart {
	width: 100%;
	display: flex;
	flex-flow: column wrap;
}

p {
	margin-left: 0.5em;
	font-size: 15px;
	font-weight: 300;
}

.chart {
	width: 26%;
	margin: 0.25em;
	min-height: 3em;
	max-height: 25em;
	display: flex;
	justify-content: center;
	align-items: center;
	border: #bcbcbc 1.5px solid;
	padding: 1.5em;
	border-radius: 3px;
	background-color: aliceblue;
}

.detailed-chart {
	width: 72%;
	margin: 0.25em;
	min-height: 3em;
	max-height: 20em;
	justify-content: center;
	align-items: center;
	border: #bcbcbc 1.5px solid;
	padding: 1.5em;
	border-radius: 3px;
	background-color: aliceblue;
}

.full-detailed-chart {
	max-width: 100%;
	width: 99%;
	margin: 0.25em;
	min-height: 3em;
	max-height: 20em;
	display: flex;
	justify-content: center;
	align-items: center;
	border: #bcbcbc 1.5px solid;
	padding: 1.5em;
	border-radius: 3px;
	background-color: aliceblue;
	flex-grow: 1;
}
</style>