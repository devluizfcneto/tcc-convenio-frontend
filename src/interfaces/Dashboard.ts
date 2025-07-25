/**
 * Interface para dados estatísticos do dashboard vindos do endpoint /api/stats/
 */
export interface DashboardStats {
  totalConvenios: number
  totalIfes: number
  totalConveniosAtivos: number
  totalConvenentes: number
  tiposConvenentes: string[]
  ultimaDataAtualizacao: string
}

/**
 * Interface para o response da API /api/stats/
 * A API retorna os dados dentro de um wrapper "data"
 */
export interface DashboardApiResponse {
  data: {
    totalConvenios: number
    totalIfes: number
    totalConveniosActives: number
    totalConvenentes: number
    convenentesTypes: string[]
    lastUpdatedDate: string
  }
}