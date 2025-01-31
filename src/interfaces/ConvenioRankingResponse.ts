import type { ConvenenteRanking } from './ConvenenteRanking'
import type { IfesRanking } from './IfesRanking'

export interface ConvenioRankingResponse {
  ifes: IfesRanking[]
  convenentes: ConvenenteRanking[]
}
