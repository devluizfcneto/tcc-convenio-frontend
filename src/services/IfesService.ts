import http from './ApiService'
import type { Ifes } from '@/interfaces/Ifes'
import type { IfesComparacaoResponse } from '@/interfaces/IfesComparacaoResponse'
import type { AxiosResponse } from 'axios'

class IfesService {
  async getAllIfes(): Promise<Ifes[]> {
    try {
      const response: AxiosResponse<{ allIfes: Ifes[] }> = await http.get<{ allIfes: Ifes[] }>(
        '/api/ifes'
      )
      return response.data.allIfes
    } catch (error: any) {
      console.error('Erro ao buscar IFES:', error.message)
      throw new Error('Erro ao carregar IFES. Tente novamente mais tarde.')
    }
  }

  async compareIfesConvenios(
    startYear: number,
    endYear: number,
    ifesSelected: number[]
  ): Promise<any> {
    try {
      const response: AxiosResponse<IfesComparacaoResponse> = await http.post(
        `/api/ifes/compare/convenios?dataInicio=${startYear}&dataFim=${endYear}`,
        { ifesSelected }
      )
      return response.data
    } catch (error: any) {
      console.error('Erro ao comparar convênios de IFES:', error.message)
      throw new Error('Erro ao comparar convênios de IFES. Tente novamente mais tarde.')
    }
  }
}

export default new IfesService()
