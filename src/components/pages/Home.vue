<template>
  <div class="home-container">
    <!-- Header Section -->
    <div class="hero-section">
      <h1 class="main-title">Sistema de Análise de Convênios Universitários</h1>
      <p class="subtitle">
        Ferramenta para consulta, análise e comparação de convênios estabelecidos entre
        Instituições Federais de Ensino Superior (IFES) e entidades conveniadas.
      </p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-section" v-if="!isLoadingStats">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-file-text"></i>
          </div>
          <div class="stat-content">
            <h3>{{ formatNumber(dashboardData.totalConvenios) }}</h3>
            <p>Total de Convênios</p>
            <small>Todos os convênios na base de dados</small>
          </div>
        </div>

        <div class="stat-card stat-card-active">
          <div class="stat-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>{{ formatNumber(dashboardData.totalConveniosAtivos) }}</h3>
            <p>Convênios Ativos</p>
            <small>Convênios atualmente vigentes</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-home"></i>
          </div>
          <div class="stat-content">
            <h3>{{ formatNumber(dashboardData.totalIfes) }}</h3>
            <p>IFES Cadastradas</p>
            <small>Instituições Federais de Ensino</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="pi pi-building"></i>
          </div>
          <div class="stat-content">
            <h3>{{ formatNumber(dashboardData.totalConvenentes) }}</h3>
            <p>Convenentes Únicos</p>
            <small>Entidades conveniadas distintas</small>
          </div>
        </div>
      </div>
      
      <!-- Data Update Info -->
      <div class="update-info-card">
        <div class="update-icon">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="update-content">
          <h4>Última Atualização dos Dados</h4>
          <p class="update-date">{{ dashboardData.ultimaDataAtualizacao }}</p>
          <small>Dados sincronizados automaticamente</small>
        </div>
      </div>
    </div>

    <!-- Loading Stats -->
    <div v-if="isLoadingStats" class="loading-stats">
      <ProgressSpinner />
      <p>Carregando estatísticas...</p>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2>Funcionalidades Disponíveis</h2>
      <div class="features-grid">
        <div class="feature-card" @click="navigateTo('/convenios-universidades')">
          <div class="feature-icon">
            <i class="pi pi-table"></i>
          </div>
          <div class="feature-content">
            <h3>Consulta de Convênios</h3>
            <p>
              Visualize todos os convênios com filtros avançados por objeto, concedente, 
              convenente, tipo e datas. Exportação completa em CSV disponível.
            </p>
            <ul>
              <li>Filtros dinâmicos</li>
              <li>Ordenação múltipla</li>
              <li>Paginação otimizada</li>
              <li>Exportação de dados</li>
            </ul>
          </div>
          <div class="feature-arrow">
            <i class="pi pi-arrow-right"></i>
          </div>
        </div>

        <div class="feature-card" @click="navigateTo('/comparar-universidades')">
          <div class="feature-icon">
            <i class="pi pi-chart-bar"></i>
          </div>
          <div class="feature-content">
            <h3>Comparação de Universidades</h3>
            <p>
              Compare métricas entre diferentes IFES, analisando valores totais, 
              quantidade de convênios e distribuição por tipos de convenentes.
            </p>
            <ul>
              <li>Seleção múltipla de IFES</li>
              <li>Gráficos comparativos</li>
              <li>Métricas detalhadas</li>
              <li>Análise temporal</li>
            </ul>
          </div>
          <div class="feature-arrow">
            <i class="pi pi-arrow-right"></i>
          </div>
        </div>

        <div class="feature-card" @click="navigateTo('/ranking-convenios')">
          <div class="feature-icon">
            <i class="pi pi-trophy"></i>
          </div>
          <div class="feature-content">
            <h3>Ranking de Convênios</h3>
            <p>
              Visualize rankings das IFES por diferentes critérios: valor total liberado, 
              quantidade de convênios e valor médio por convênio.
            </p>
            <ul>
              <li>Múltiplos critérios de ranking</li>
              <li>Visualização gráfica</li>
              <li>Filtros por período</li>
              <li>Comparação percentual</li>
            </ul>
          </div>
          <div class="feature-arrow">
            <i class="pi pi-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Info Section -->
    <div class="data-info-section">
      <h2>Sobre os Dados</h2>
      <div class="info-content">
        <div class="info-item">
          <h4>Fonte dos Dados</h4>
          <p>
            Os dados são sincronizados automaticamente a partir de fontes 
            <a href="https://api.portaldatransparencia.gov.br/swagger-ui/index.html" target="_blank">governamentais oficiais</a>
            , garantindo informações atualizadas e confiáveis sobre convênios universitários.
          </p>
        </div>
        
        <div class="info-item" v-if="dashboardData.tiposConvenentes?.length">
          <h4>Tipos de Convenentes Disponíveis</h4>
          <div class="tags-container">
            <span 
              v-for="tipo in dashboardData.tiposConvenentes" 
              :key="tipo" 
              class="type-tag"
            >
              {{ tipo }}
            </span>
          </div>
        </div>

        <div class="info-item">
          <h4>Atualização dos Dados</h4>
          <p>
            O sistema executa processos automatizados de sincronização para manter 
            os dados sempre atualizados. A última execução foi em 
            <strong>{{ dashboardData.ultimaDataAtualizacao }}</strong>.
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2>Ações Rápidas</h2>
      <div class="actions-grid">
        <Button 
          icon="pi pi-search" 
          label="Buscar Convênios" 
          class="p-button-lg p-button-outlined"
          @click="navigateTo('/convenios-universidades')"
        />
        <Button 
          icon="pi pi-chart-line" 
          label="Ver Rankings" 
          class="p-button-lg p-button-outlined"
          @click="navigateTo('/ranking-convenios')"
        />
        <Button 
          icon="pi pi-objects-column" 
          label="Comparar IFES" 
          class="p-button-lg p-button-outlined"
          @click="navigateTo('/comparar-universidades')"
        />
      </div>
    </div>

    <Toast />
  </div>
</template>

<script>
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import DashboardService from '@/services/DashboardService.ts'

export default {
  name: 'Home',
  components: { Button, Toast, ProgressSpinner },
  data() {
    return {
      isLoadingStats: false,
      dashboardData: {
        totalConvenios: 0,
        totalIfes: 0,
        totalConveniosAtivos: 0,
        totalConvenentes: 0,
        tiposConvenentes: [],
        ultimaDataAtualizacao: null
      }
    }
  },
  async mounted() {
    await this.loadDashboardData()
  },
  methods: {
    formatNumber(num) {
      if (!num) return '0'
      return num.toLocaleString('pt-BR')
    },
    navigateTo(path) {
      this.$router.push(path)
    },
    async loadDashboardData() {
      this.isLoadingStats = true
      try {
        const response = await DashboardService.getDashboardStats()
        this.dashboardData = response
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
        this.$toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as estatísticas do sistema',
          life: 5000
        })
        
      } finally {
        this.isLoadingStats = false
      }
    },
    showError(errorMessage) {
      this.$toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
        life: 5000
      })
    }
  }
}
</script>

<style scoped>
.home-container {
  width: 100%;
  padding: 1rem;
  font-family: sans-serif;
  box-sizing: border-box;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
}

.main-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.stat-card-active {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: #28a745;
}

.stat-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.8rem;
  border-radius: 50%;
  font-size: 1.2rem;
  min-width: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card:not(.stat-card-active) .stat-icon {
  background: #e9ecef;
  color: #495057;
}

.stat-content h3 {
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0 0 0.3rem 0;
}

.stat-content p {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.2rem 0;
}

.stat-content small {
  opacity: 0.8;
  font-size: 0.8rem;
}

.update-info-card {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.update-icon {
  background: #007bff;
  color: white;
  padding: 0.8rem;
  border-radius: 50%;
  font-size: 1.2rem;
  min-width: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.update-content h4 {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
  color: #333;
}

.update-date {
  font-size: 1.1rem;
  font-weight: bold;
  color: #007bff;
  margin: 0 0 0.2rem 0;
}

.update-content small {
  color: #666;
  font-size: 0.8rem;
}

.loading-stats {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Features Section */
.features-section {
  margin-bottom: 2rem;
}

.features-section h2 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

.features-grid {
  display: grid;
  gap: 1rem;
}

.feature-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.feature-icon {
  background: #f5f5f5;
  color: #333;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.2rem;
  min-width: 50px;
  text-align: center;
  border: 1px solid #ddd;
}

.feature-card:hover .feature-icon {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.feature-content {
  flex: 1;
}

.feature-content h3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.feature-content p {
  color: #666;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  font-size: 0.9rem;
}

.feature-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.feature-content li {
  background: #f8f9fa;
  color: #666;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  border: 1px solid #e9ecef;
}

.feature-arrow {
  color: #007bff;
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-arrow {
  transform: translateX(3px);
}

/* Data Info Section */
.data-info-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  margin-bottom: 2rem;
}

.data-info-section h2 {
  color: #333;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.info-content {
  display: grid;
  gap: 1rem;
}

.info-item h4 {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.info-item p {
  color: #666;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.type-tag {
  background: #007bff;
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Quick Actions */
.quick-actions-section {
  text-align: center;
}

.quick-actions-section h2 {
  color: #333;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.actions-grid {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .home-container {
    padding: 0.5rem;
  }
  
  .main-title {
    font-size: 1.5rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
  }
  
  .feature-content ul {
    justify-content: center;
  }
  
  .actions-grid {
    flex-direction: column;
    align-items: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-content h3 {
    font-size: 1.4rem;
  }
}
</style>
