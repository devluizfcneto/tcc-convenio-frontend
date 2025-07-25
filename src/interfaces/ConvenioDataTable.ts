export interface ConvenioDataTable {
  number: string
  detailUrl: string
  description: string
  origin: string
  totalValueReleased: number
  totalValue: number
  valueLastRelease: number
  startEffectiveDate: string
  endEffectiveDate: string
  lastReleaseDate: string
  destination: string
  destinationType: string
  destinationDetailUrl: string
  acronym: string
}

export interface ConvenioDataTableMetadata {
  totalCount: number
  limit: number
  currentPage: number
  totalPages: number
  sortBy: string
  sortOrder: string
}

export interface ConvenioDataTableResponse {
  data: ConvenioDataTable[]
  metadata: ConvenioDataTableMetadata
}
