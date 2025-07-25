import { formatDateToApiString } from '@/utils/format'
import ApiService from './ApiService'
import type { DashboardApiResponse, DashboardStats } from '@/interfaces/Dashboard'

/**
 * Serviço para obter dados estatísticos do dashboard
 */
class DashboardService {
  /**
   * Obtém estatísticas gerais do sistema do endpoint /api/stats/
   * @returns {Promise<DashboardStats>} Dados do dashboard
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const axiosResponse = await ApiService.get('/api/stats/')
      const response = axiosResponse.data as DashboardApiResponse
      const apiData = response.data
     
      return {
        totalConvenios: apiData.totalConvenios,
        totalIfes: apiData.totalIfes,
        totalConveniosAtivos: apiData.totalConveniosActives,
        totalConvenentes: apiData.totalConvenentes,
        tiposConvenentes: apiData.convenentesTypes,
        ultimaDataAtualizacao: formatDateToApiString(apiData.lastUpdatedDate)
      }
      
    } catch (error) {
      throw new Error('Não foi possível carregar as estatísticas do sistema')
    }
  }
}

export default DashboardService
