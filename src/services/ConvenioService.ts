import http from './ApiService'
import type { Convenio } from '@/interfaces/Convenio'
import type { ConvenioRankingResponse } from '@/interfaces/ConvenioRankingResponse'
import type { AxiosResponse } from 'axios'

class ConvenioService {
  async getAllConvenios(): Promise<Convenio[]> {
    try {
      const response: AxiosResponse<Convenio[]> = await http.get<Convenio[]>('/api/convenios')
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar convênios:', error.message)
      throw new Error('Erro ao carregar convênios. Tente novamente mais tarde.')
    }
  }

  async getConveniosRanking(startYear: number, endYear: number, limit: number): Promise<any> {
    try {
      const response: AxiosResponse<ConvenioRankingResponse> = await http.get(
        `/api/convenios/ranking?startYear=${startYear}&endYear=${endYear}&limit=${limit}`
      )
      return response.data
    } catch (error: any) {
      console.error('Erro ao buscar ranking de convênios:', error.message)
      throw new Error('Erro ao carregar ranking de convênios. Tente novamente mais tarde.')
    }
  }
}

export default new ConvenioService()
