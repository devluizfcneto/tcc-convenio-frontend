import http from './ApiService'
import type { Ifes } from '@/interfaces/Ifes'
import type { IfesComparacaoResponse } from '@/interfaces/IfesComparacaoResponse'
import type { AxiosResponse } from 'axios'
import LocalStorageService from './LocalStorageService'

const ALL_IFES_CACHE_KEY = 'all_ifes_cache'

class IfesService {
  async getAllIfes(): Promise<Ifes[]> {
    return this.getCachedOrFetch(ALL_IFES_CACHE_KEY, '/api/ifes')
  }

  async compareIfesConvenios(
    startYear: number,
    endYear: number,
    ifesSelected: number[]
  ): Promise<IfesComparacaoResponse> {
    const params = `?dataInicio=${startYear}&dataFim=${endYear}`
    const data = { ifesSelected }
    const cacheKey = `ifes_comparacao_cache_${startYear}_${endYear}_${ifesSelected.join('_')}`

    const cachedData = LocalStorageService.getItem(cacheKey)

    if (cachedData && LocalStorageService.isCacheValid(cachedData, 24 * 60 * 60 * 1000)) {
      return cachedData.data
    }

    try {
      const response: AxiosResponse<IfesComparacaoResponse> = await http.post(
        `/api/ifes/compare/convenios${params}`,
        data
      )
      const responseData = response.data
      const dataToCache = {
        data: responseData,
        timestamp: Date.now()
      }
      LocalStorageService.setItem(cacheKey, dataToCache)
      return responseData
    } catch (error: any) {
      console.error('Erro ao comparar convênios de IFES:', error)
      throw error 
    }
  }

  private async getCachedOrFetch(cacheKey: string, endpoint: string): Promise<any> {
    const cachedData = LocalStorageService.getItem(cacheKey)

    if (cachedData && LocalStorageService.isCacheValid(cachedData, 24 * 60 * 60 * 1000)) {
      return cachedData.data
    }

    try {
      const response: AxiosResponse<any> = await http.get(endpoint)
      const data = response.data.allIfes
      const dataToCache = {
        data: data,
        timestamp: Date.now()
      }
      LocalStorageService.setItem(cacheKey, dataToCache)
      return data
    } catch (error: any) {
      console.error(`Erro ao buscar dados de ${endpoint}:`, error)
      throw error 
    }
  }
}

export default new IfesService()
