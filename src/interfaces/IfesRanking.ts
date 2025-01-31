import type { ConvenenteResumido } from './ConvenenteResumido'

export interface IfesRanking {
  code: string
  name: string
  totalValueReleased: number
  convenentes: ConvenenteResumido[]
}
