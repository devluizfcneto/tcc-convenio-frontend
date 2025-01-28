import type { Convenente } from './Convenente'
import type { IfesResumido } from './IfesResumido'

export interface Convenio {
  number: number
  detailUrl: string
  description: string
  origin: string
  destination: string
  convenente: Convenente // Interface aninhada
  destinationType: string
  totalValueReleased: number
  totalValue: number
  valueLastRelease?: number | null // Permite valores nulos
  lastReleaseDate?: string | null // Permite valores nulos
  startEffectiveDate: string
  endEffectiveDate: string
  ifes: IfesResumido // Interface aninhada (versão resumida de Ifes)
}
