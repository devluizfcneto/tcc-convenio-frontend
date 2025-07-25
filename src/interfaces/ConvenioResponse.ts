import type { Convenio } from './Convenio'

export interface ConvenioResponse {
    data: Convenio[]
    metadata: ConvenioMetadata
}

export interface ConvenioMetadata {
    totalCount: number
    limit: number
    currentPage: number
    totalPages: number
    sortBy: string
    sortOrder: string
}
