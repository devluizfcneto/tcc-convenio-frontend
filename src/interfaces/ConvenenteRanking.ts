import type { IfesResumidoRanking } from './IfesResumidoRanking'

export interface ConvenenteRanking {
  convenenteId: number
  name: string
  totalValueReleased: number
  detailUrl: string
  ifes: IfesResumidoRanking
}
