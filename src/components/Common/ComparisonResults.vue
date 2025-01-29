<template>
  <div class="comparison-results-container">
    <div class="tree-table-container">
      <TreeTable :value="ifesTree" size="small">
        <template #header>
          <h2>
            Comparação de Convenios entre Universidades no período de {{ startYear }} até
            {{ endYear }}
          </h2>
        </template>
        <Column field="nome" header="Nome" expander style="width: 55%"></Column>
        <Column field="qtdConvenios" header="Qtd. Convenios" style="width: 10%"></Column>
        <Column header="Valor Total Liberado" style="width: 15%">
          <template #body="slotProps">
            {{ formatValue(slotProps.node.data.valorTotalLiberado) }}
          </template>
        </Column>
        <Column header="Valor Total Contratado" style="width: 15%">
          <template #body="slotProps">
            {{ formatValue(slotProps.node.data.valorTotalContratado) }}
          </template>
        </Column>
        <Column field="porcentagemPaga" header="% Pago" style="width: 5%"></Column>
      </TreeTable>
    </div>

    <div class="charts-container" ref="chartsContainer">
      <div class="charts-header-container">
        <h3 class="charts-header">
          Gráficos de comparação de Convenios entre Universidades selecionadas
        </h3>
        <Button
          class="export-pdf-btn"
          type="button"
          icon="pi pi-download"
          @click="exportDivToPDF"
        ></Button>
      </div>

      <div class="tab-panel-container" v-for="(ife, index) in ifesTree" :key="ife.key">
        <h4>Convênios da Universidade {{ ife.data.nome }}</h4>
        <div class="chart-container">
          <Chart
            class="full-detailed-chart"
            type="bar"
            :data="buildHorizontalBarChartQtdConvenios(index)"
            :options="buildHorizontalBarChartDataOptions(true, index)"
          ></Chart>
        </div>
        <div class="chart-container">
          <Chart
            class="full-detailed-chart"
            type="bar"
            :data="buildStackedHorizontalBarChartDataValorTotalLiberado(index)"
            :options="buildStackedHorizontalBarChartDataOptions(index)"
          ></Chart>
        </div>
      </div>

      <div class="tab-panel-container">
        <h3>Convênios de todas as Universidades selecionadas</h3>
        <div class="chart-container">
          <div class="chart-group">
            <Chart
              class="detailed-chart"
              type="bar"
              :data="buildHorizontalBarChartQtdAllIfes()"
              :options="buildHorizontalBarChartDataOptions(true)"
            ></Chart>
            <Chart
              class="doughnut-chart"
              type="doughnut"
              :data="buildDoughnutChartDataQtdConvenios()"
              :options="buildDoughnutChartDataOptions()"
            ></Chart>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-group">
            <Chart
              class="detailed-chart"
              type="bar"
              :data="buildStackedHorizontalBarChartDataValorTotalLiberadoAllIfes()"
              :options="buildStackedHorizontalBarChartDataOptions()"
            ></Chart>
            <Chart
              class="doughnut-chart"
              type="doughnut"
              :data="buildDoughnutChartDataValorTotalLiberado()"
              :options="buildDoughnutChartDataOptions(true)"
            ></Chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Chart from 'primevue/chart'
import { formatValue } from '@/utils/format'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  components: {
    TreeTable,
    Column,
    Button,
    Chart
  },
  props: {
    ifesTree: { type: Array, required: true },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true }
  },
  methods: {
    formatValue,

    buildHorizontalBarChartDataOptions(dataSetInteger = false, element = null) {
      const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
              font: {
                size: 14
              }
            }
          },
          datalabels: false
        },
        scales: {
          x: {
            ticks: {
              stepSize: dataSetInteger ? 1 : undefined,
              color: getComputedStyle(document.documentElement).getPropertyValue(
                '--text-color-secondary'
              ),
              font: {
                weight: 'bold'
              }
            },
            grid: {
              display: true,
              color: getComputedStyle(document.documentElement).getPropertyValue(
                '--surface-border'
              ),
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue(
                '--text-color-secondary'
              ),
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
            }
          }
        }
      }

      if (element != null) {
        options.aspectRatio = this.ifesTree[element].children.length < 2 ? 8 : 5
      }

      return options
    },

    buildHorizontalBarChartDataValorTotalLiberado(index) {
      const convenentes = this.ifesTree[index].children

      const labels = convenentes.map((convenente) => {
        return convenente.data.nome
      })

      const data = convenentes.map((convenente) => {
        return convenente.data.valorTotalLiberado
      })

      return {
        labels: labels,
        datasets: [
          {
            label: 'Valor Total Liberado',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--cyan-500'
            ),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
            data: data
          }
        ]
      }
    },

    buildHorizontalBarChartQtdConvenios(index) {
      const convenentes = this.ifesTree[index].children

      const nomesConvenentes = convenentes.map((convenente) => convenente.data.nome)
      const qtdConvenios = convenentes.map((convenente) => convenente.data.qtdConvenios)

      return {
        labels: nomesConvenentes,
        datasets: [
          {
            label: 'Quantidade de Convênios',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--cyan-500'
            ),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
            data: qtdConvenios
          }
        ]
      }
    },

    buildHorizontalBarChartDataValorTotalLiberadoAllIfes() {
      const ifesName = this.ifesTree.map((ife) => ife.data.nome)
      const ifesValorTotalLiberado = this.ifesTree.map((ife) => ife.data.valorTotalLiberado)

      return {
        labels: ifesName,
        datasets: [
          {
            label: 'Valor Total Liberado',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--cyan-500'
            ),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
            data: ifesValorTotalLiberado
          }
        ]
      }
    },

    buildHorizontalBarChartQtdAllIfes() {
      const ifesName = this.ifesTree.map((ife) => ife.data.nome)
      const ifesQtdConvenios = this.ifesTree.map((ife) => ife.data.qtdConvenios)
      return {
        labels: ifesName,
        datasets: [
          {
            label: 'Quantidade de Convênios',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--cyan-500'
            ),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
            data: ifesQtdConvenios
          }
        ]
      }
    },

    buildStackedHorizontalBarChartDataOptions(element = null) {
      const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            display: true,
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
              font: {
                size: 14
              }
            }
          },
          datalabels: false
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue(
                '--text-color-secondary'
              ),
              font: {
                weight: 'bold'
              }
            },
            grid: {
              display: true,
              color: getComputedStyle(document.documentElement).getPropertyValue(
                '--surface-border'
              ),
              drawBorder: false
            }
          },
          y: {
            stacked: true,
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue(
                '--text-color-secondary'
              ),
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
            }
          }
        }
      }

      if (element != null) {
        options.aspectRatio = this.ifesTree[element].children.length < 2 ? 8 : 5
      }

      return options
    },

    buildStackedHorizontalBarChartDataValorTotalLiberado(index) {
      const convenentes = this.ifesTree[index].children
      const labels = convenentes.map((convenente) => {
        return convenente.data.nome
      })

      const valorTotalLiberado = convenentes.map((convenente) => {
        return convenente.data.valorTotalLiberado
      })

      const valorTotalContratadoMenosLiberado = convenentes.map((convenente) => {
        return convenente.data.valorTotalContratado - convenente.data.valorTotalLiberado
      })

      return {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Pago',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--cyan-500'
            ),
            data: valorTotalLiberado
          },
          {
            type: 'bar',
            label: 'Falta Pagar',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--orange-500'
            ),
            data: valorTotalContratadoMenosLiberado
          }
        ]
      }
    },

    buildStackedHorizontalBarChartDataValorTotalLiberadoAllIfes() {
      const ifesName = this.ifesTree.map((ife) => ife.data.nome)
      const ifesValorTotalLiberado = this.ifesTree.map((ife) => ife.data.valorTotalLiberado)
      const ifesValorTotalContratadoMenosLiberado = this.ifesTree.map(
        (ife) => ife.data.valorTotalContratado - ife.data.valorTotalLiberado
      )

      return {
        labels: ifesName,
        datasets: [
          {
            type: 'bar',
            label: 'Pago',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--cyan-500'
            ),
            data: ifesValorTotalLiberado
          },
          {
            type: 'bar',
            label: 'Falta Pagar',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
              '--orange-500'
            ),
            data: ifesValorTotalContratadoMenosLiberado
          }
        ]
      }
    },

    buildDoughnutChartDataOptions(numericFloat = false) {
      const documentStyle = getComputedStyle(document.documentElement)
      const textColor = documentStyle.getPropertyValue('--text-color')

      return {
        plugins: {
          legend: {
            labels: {
              cutout: '60%',
              color: textColor,
              font: {
                size: 10
              }
            }
          },
          datalabels: {
            color: '#000',
            font: {
              weight: 'bold',
              size: 11
            },
            formatter: (value, context) => {
              return numericFloat ? formatValue(value) : value
            }
          }
        }
      }
    },

    buildDoughnutChartDataQtdConvenios() {
      const documentStyle = getComputedStyle(document.body)

      const labels = this.ifesTree.map((node) => {
        return node.data.nome
      })

      const data = this.ifesTree.map((node) => {
        return node.data.qtdConvenios
      })

      return {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              documentStyle.getPropertyValue('--cyan-500'),
              documentStyle.getPropertyValue('--orange-500'),
              documentStyle.getPropertyValue('--gray-500')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--cyan-400'),
              documentStyle.getPropertyValue('--orange-400'),
              documentStyle.getPropertyValue('--gray-400')
            ]
          }
        ]
      }
    },

    buildDoughnutChartDataValorTotalLiberado() {
      const documentStyle = getComputedStyle(document.body)

      const labels = this.ifesTree.map((node) => {
        return node.data.nome
      })

      const data = this.ifesTree.map((node) => {
        return node.data.valorTotalLiberado
      })

      return {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              documentStyle.getPropertyValue('--cyan-500'),
              documentStyle.getPropertyValue('--orange-500'),
              documentStyle.getPropertyValue('--gray-500')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--cyan-400'),
              documentStyle.getPropertyValue('--orange-400'),
              documentStyle.getPropertyValue('--gray-400')
            ]
          }
        ]
      }
    },

    exportDivToPDF() {
      const applyInlineStyles = (element) => {
        const computedStyle = window.getComputedStyle(element)
        for (let property of computedStyle) {
          element.style[property] = computedStyle.getPropertyValue(property)
        }

        Array.from(element.children).forEach((child) => applyInlineStyles(child))
      }

      applyInlineStyles(this.$refs.chartsContainer)

      html2canvas(this.$refs.chartsContainer, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 0.8)

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()

        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = imgWidth / imgHeight

        const scaledWidth = pdfWidth
        const scaledHeight = pdfWidth / ratio

        let positionY = 0
        let page = 0

        while (positionY < imgHeight) {
          if (page > 0) {
            pdf.addPage()
          }

          const canvasPortion = canvas
            .getContext('2d')
            .getImageData(
              0,
              positionY,
              imgWidth,
              Math.min((pdfHeight * imgWidth) / pdfWidth, imgHeight - positionY)
            )

          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = imgWidth
          tempCanvas.height = canvasPortion.height
          tempCanvas.getContext('2d').putImageData(canvasPortion, 0, 0)

          const tempImgData = tempCanvas.toDataURL('image/png', 0.8)

          const margin = 20
          pdf.addImage(
            tempImgData,
            'PNG',
            margin,
            margin,
            pdfWidth - 2 * margin,
            scaledHeight,
            '',
            'FAST'
          )

          positionY += pdfHeight
          page++
        }

        // Salva o PDF
        pdf.save('comparacao-graficos.pdf')
      })
    }
  }
}
</script>

<style scoped>
.comparison-results-container {
  width: 90%;
  margin: 3em auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-flow: column;
}

.comparison-results-container .p-treetable .p-treetable-header {
  padding: 1rem;
  font-weight: 700;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.comparison-results-container .p-treetable .p-treetable-tbody > tr > td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}

.charts-container {
  width: 100%;
  padding: 1em;
  border-radius: 3px;
  flex-grow: 1;
}

@media (max-width: 768px) {
  .ifes-inputs-container {
    flex-direction: column;
  }

  .ife-input-container {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .period-inputs-container {
    flex-direction: column;
  }
}

.tree-table-container {
  width: 100%;
  margin-bottom: 2em;
}

.charts-header-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1em;
}

.export-pdf-btn {
  width: 5%;
}

.tab-panel-container {
  width: 100%;
  margin: 1em 0;
  padding: 1em 0;
  border-radius: 3px;
}

h4 {
  text-align: center;
  margin: 0 2.5em 0.5em;
  font-size: 20px;
}

.chart-container {
  width: 100%;
}

.tab-panel-container .chart-container {
  width: 100%;
  display: flex;
  flex-flow: column;
  margin-bottom: 1em;
}

.full-detailed-chart {
  width: 99%;
  min-height: 20em;
  max-height: 25em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px solid #bcbcbc;
  padding: 0.5em;
  border-radius: 3px;
  background-color: aliceblue;
}

.all-universities-charts-container .chart-container {
  width: 100%;
  display: flex;
  flex-flow: row;
  margin-bottom: 1em;
}

.chart-group {
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: center;
}

.detailed-chart {
  width: 70%;
  min-height: 20em;
  max-height: 30em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px solid #bcbcbc;
  padding: 1.5em;
  border-radius: 3px;
  background-color: aliceblue;
}

.doughnut-chart {
  width: 30%;
  min-height: 3em;
  max-height: 20em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px solid #bcbcbc;
  padding: 1.5em;
  border-radius: 3px;
  background-color: aliceblue;
}
</style>
