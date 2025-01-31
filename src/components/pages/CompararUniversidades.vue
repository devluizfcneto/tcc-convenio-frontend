<template>
  <div class="container-main">
    <h2>Comparar Universidades</h2>

    <ComparisonForm 
      :all-ifes="allIfes" 
      :year-options="yearOptions" 
      @compare="doComparison" 
      />

    <div v-if="isLoading" class="loading-overlay">
      <ProgressSpinner />
    </div>

    <ComparisonResults
      v-if="comparisonLoaded"
      :ifes-tree="ifesTree"
      :start-year="requestComparison.queryParam.startYear"
      :end-year="requestComparison.queryParam.endYear"
      @export-pdf="exportDivToPDF"
    />

    <Toast />
  </div>
</template>
<script>
import IfesService from '@/services/IfesService'
import Toast from 'primevue/toast'
import { formatStringEndYear, formatStringStartYear, formatValue, getYearFromDateString } from '@/utils/format'
import ComparisonForm from '../Common/ComparisonForm.vue'
import ComparisonResults from '../Common/ComparisonResults.vue'
import ProgressSpinner from 'primevue/progressspinner'
import LocalStorageService from '@/services/LocalStorageService'

export default {
  components: {
    Toast,
    ComparisonForm,
    ComparisonResults,
    ProgressSpinner
  },
  data() {
    return {
      allIfes: [],
      yearOptions: [],
      firstYearOption: 2000,

      isLoading: false,
      comparisonLoaded: false,
      requestComparison: {},

      responseComparison: {},
      ifesTree: {},
      LAST_DO_COMPARISON_DATA_KEY: "last_comparison_data"
    }
  },
  async mounted() {
    this.initializeComparisonFormProps()
    await this.getAllIfes()
    this.restoreComparisonDataFromLocalStorage()
  },
  methods: {
    showErrors(message) {
      this.$toast.add({
        severity: 'error',
        summary: 'Erro no Servidor!',
        detail: message,
        life: 5000
      })
    },

    async getAllIfes() {
      try {
        const response = await IfesService.getAllIfes()
        this.allIfes = response
      } catch (error) {
        console.error(error.name, error.message)
        this.showErrors(error.message)
      }
    },

    async doComparison(ifesSelected, startYear, endYear) {
      this.createComparisonRequest(ifesSelected, startYear, endYear)
      this.isLoading = true
      try {
        const response = await IfesService.compareIfesConvenios(
          this.requestComparison.queryParam.startYear,
          this.requestComparison.queryParam.endYear,
          this.requestComparison.body.ifesSelected
        )
        this.responseComparison = response.comparacaoIfesConveniosResponse
        this.comparisonLoaded = true
        this.ifesTree = this.buildTreeFormat()
        this.isLoading = false
        this.saveLastComparisonIfes(this.requestComparison, this.responseComparison);
      } catch (error) {
        this.comparisonLoaded = false
        console.error(error.name, error.message)
        this.showErrors(error.message)
      } finally {
        this.isLoading = false
      }
    },

    saveLastComparisonIfes(request, comparison){
      const data = {
        startYear: request.queryParam.startYear,
        endYear: request.queryParam.endYear,
        ifesSelected: request.body.ifesSelected,
        comparisonResponse: comparison
      }
      LocalStorageService.setItem(this.LAST_DO_COMPARISON_DATA_KEY, data);
    },

    restoreComparisonDataFromLocalStorage() {
      const storedData = LocalStorageService.getItem(this.LAST_DO_COMPARISON_DATA_KEY);
      if(storedData){
        try {
          this.createComparisonRequest(this.ifesSelected, this.startYear, this.endYear);
          this.responseComparison = storedData.comparisonResponse;
          this.comparisonLoaded = true;
          this.ifesTree = this.buildTreeFormat();
          this.isLoading = false;
        }catch(error){
          console.log(error.name, error.message);
           LocalStorageService.removeItem(this.LAST_DO_COMPARISON_DATA_KEY);
        }
      }
    },

    createComparisonRequest(ifesSelected, startYear, endYear) {
      this.requestComparison.body = {
        ifesSelected: ifesSelected
      }

      this.requestComparison.queryParam = {
        startYear: formatStringStartYear(startYear),
        endYear: formatStringEndYear(endYear)
      }
    },

    initializeComparisonFormProps() {
      const currentYear = new Date().getFullYear()
      this.yearOptions = Array.from(
        { length: currentYear + 10 - this.firstYearOption + 1 },
        (_, index) => this.firstYearOption + index
      )

      this.startYear = currentYear;
      this.endYear = currentYear;
      this.ifesSelected = Array(this.ifesLength).fill(null);
    },

    buildTreeFormat() {
      return this.responseComparison.map((universidade, index) => {
        const convenenteNodes = universidade.listaConvenios.reduce((acc, convenio) => {
          const convenenteName = convenio.convenente.name
          if (!acc[convenenteName]) {
            acc[convenenteName] = []
          }
          acc[convenenteName].push(convenio)
          return acc
        }, {})

        let totalValorLiberadoUniversidade = 0
        let totalValorContratadoUniversidade = 0

        const children = Object.values(convenenteNodes).map((convenios, convenenteIndex) => {
          const totalConvenios = convenios.length
          let totalValorLiberadoConvenente = 0
          let totalValorContratadoConvenente = 0

          convenios.forEach((convenio) => {
            totalValorLiberadoConvenente += convenio.totalValueReleased
            totalValorContratadoConvenente += convenio.totalValue
          })

          totalValorLiberadoUniversidade += totalValorLiberadoConvenente
          totalValorContratadoUniversidade += totalValorContratadoConvenente

          const porcentagemPagaConvenente =
            (totalValorLiberadoConvenente / totalValorContratadoConvenente) * 100

          if (totalConvenios > 1) {
            return {
              key: `convenente-${index}-${convenenteIndex}`,
              data: {
                nome: convenios[0].convenente.name,
                qtdConvenios: totalConvenios,
                valorTotalLiberado: parseFloat(totalValorLiberadoConvenente.toFixed(2)),
                porcentagemPaga: isNaN(porcentagemPagaConvenente)
                  ? 0
                  : parseFloat(porcentagemPagaConvenente.toFixed(2)),
                valorTotalContratado: parseFloat(totalValorContratadoConvenente.toFixed(2))
              },
              children: convenios.map((convenio, convenioIndex) => ({
                key: `convenio-${index}-${convenenteIndex}-${convenioIndex}`,
                data: {
                  nome: convenio.convenente.name,
                  qtdConvenios: 1,
                  valorTotalLiberado: parseFloat(convenio.totalValueReleased.toFixed(2)),
                  porcentagemPaga: isNaN((convenio.totalValueReleased / convenio.totalValue) * 100)
                    ? 0
                    : parseFloat(
                        ((convenio.totalValueReleased / convenio.totalValue) * 100).toFixed(2)
                      ),
                  valorTotalContratado: parseFloat(convenio.totalValue).toFixed(2)
                }
              }))
            }
          } else {
            const convenio = convenios[0]
            const porcentagemPagaConvenio =
              (convenio.totalValueReleased / convenio.totalValue) * 100
            return {
              key: `convenio-${index}-${convenenteIndex}`,
              data: {
                nome: convenio.convenente.name,
                qtdConvenios: 1,
                valorTotalLiberado: parseFloat(convenio.totalValueReleased.toFixed(2)),
                porcentagemPaga: isNaN(porcentagemPagaConvenio)
                  ? 0
                  : parseFloat(porcentagemPagaConvenio.toFixed(2)),
                valorTotalContratado: parseFloat(convenio.totalValue).toFixed(2)
              }
            }
          }
        })

        const porcentagemPagaUniversidade =
          (totalValorLiberadoUniversidade / totalValorContratadoUniversidade) * 100

        return {
          key: `universidade-${index}`,
          data: {
            nome: universidade.nome,
            qtdConvenios: universidade.qtdConvenios,
            valorTotalLiberado: parseFloat(universidade.valorTotalLiberado.toFixed(2)),
            porcentagemPaga: isNaN(porcentagemPagaUniversidade)
              ? 0
              : parseFloat(porcentagemPagaUniversidade.toFixed(2)),
            valorTotalContratado: parseFloat(totalValorContratadoUniversidade.toFixed(2))
          },
          children: children
        }
      })
    },

    formatValue,
    getYearFromDateString,

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
        pdf.save('comparacao-graficos.pdf')
      })
    }
  }
}
</script>

<style scoped>
.container-main {
  width: 95%;
  margin: 0.5em auto;
  font-family: sans-serif;
}

h2 {
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
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
