import http from './ApiService'
import type { Convenio } from '@/interfaces/Convenio'
import type { ConvenioRankingResponse } from '@/interfaces/ConvenioRankingResponse'
import type { AxiosResponse } from 'axios'
import LocalStorageService from './LocalStorageService'

const CONVENIOS_CACHE_KEY = 'convenios_cache'
const CONVENIOS_RANKING_CACHE_KEY = 'convenios_ranking_cache'

class ConvenioService {
  async getAllConvenios(): Promise<Convenio[]> {
    return this.getCachedOrFetch(CONVENIOS_CACHE_KEY, '/api/convenios')
  }

  async getConveniosRanking(startYear: number, endYear: number, limit: number): Promise<any> {
    const endpoint = `/api/convenios/ranking?startYear=${startYear}&endYear=${endYear}&limit=${limit}`
    const cacheKey = `${CONVENIOS_RANKING_CACHE_KEY}_${startYear}_${endYear}_${limit}`
    return this.getCachedOrFetch(cacheKey, endpoint)
  }

  private async getCachedOrFetch(cacheKey: string, endpoint: string): Promise<any> {
    const cachedData = LocalStorageService.getItem(cacheKey)

    if (cachedData && LocalStorageService.isCacheValid(cachedData, 24 * 60 * 60 * 1000)) {
      return cachedData.data
    }

    try {
      const response: AxiosResponse<any> = await http.get(endpoint)
      const data = response.data

      const dataToCache = {
        data: data,
        timestamp: Date.now()
      }
      LocalStorageService.setItem(cacheKey, dataToCache)
      return data
    } catch (error: any) {
      console.error(`Erro ao buscar dados de ${endpoint}:`, error.message)
      throw new Error(`Erro ao carregar dados. Tente novamente mais tarde.`)
    }
  }
}

export default new ConvenioService()
