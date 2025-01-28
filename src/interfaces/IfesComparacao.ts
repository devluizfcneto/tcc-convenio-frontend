import type { ConvenioComparacao } from './ConvenioComparacao'

export interface IfesComparacao {
  nome: string
  qtdConvenios: number
  valorTotalLiberado: number
  listaConvenios: ConvenioComparacao[]
}
