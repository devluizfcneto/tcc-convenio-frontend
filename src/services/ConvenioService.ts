import http from './ApiService'
import type { ConvenioDataTableResponse } from '@/interfaces/ConvenioDataTable'
import type { ConvenioRankingResponse } from '@/interfaces/ConvenioRankingResponse'
import type { AxiosResponse } from 'axios'
import LocalStorageService from './LocalStorageService'

const CONVENIOS_CACHE_KEY = 'convenios_cache'
const CONVENIOS_RANKING_CACHE_KEY = 'convenios_ranking_cache'

class ConvenioService {
  async getAllConvenios(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'startEffectiveDate',
    sortOrder: string = 'DESC',
    filters?: Record<string, any>
  ): Promise<ConvenioDataTableResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    })

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key].toString())
        }
      })
    }

    const endpoint = `/api/convenios?${params.toString()}`
    const cacheKey = `${CONVENIOS_CACHE_KEY}_${params.toString()}`
    
    return this.getCachedOrFetch<ConvenioDataTableResponse>(cacheKey, endpoint)
  }

  async getConveniosRanking(startYear: number, endYear: number, limit: number): Promise<ConvenioRankingResponse> {
    const endpoint = `/api/convenios/ranking?startYear=${startYear}&endYear=${endYear}&limit=${limit}`
    const cacheKey = `${CONVENIOS_RANKING_CACHE_KEY}_${startYear}_${endYear}_${limit}`
    return this.getCachedOrFetch(cacheKey, endpoint)
  }

  private async getCachedOrFetch<T = any>(cacheKey: string, endpoint: string): Promise<T> {
    const cachedData = LocalStorageService.getItem(cacheKey)

    if (cachedData && LocalStorageService.isCacheValid(cachedData, 24 * 60 * 60 * 1000)) {
      return cachedData.data
    }

    try {
      const response: AxiosResponse<T> = await http.get(endpoint)
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
