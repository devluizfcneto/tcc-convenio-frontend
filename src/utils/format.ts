export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return ''
  }

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  } catch (error) {
    console.error('Erro ao formatar data:', error)
    return 'Data Inválida' 
  }
}

export function formatValue(value: number | null | undefined): string {
  if (value == null) {
    return 'R$ 0,00'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDateToString(date: Date | null | undefined): string {
  if (!date) {
    return ''
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatStringStartYear(year: string | null | undefined): string {
  if (!year) return ''
  return `01/01/${year}`
}

export function formatStringEndYear(year: string | null | undefined): string {
  const today = new Date()
  if (!year) return ''
  if (parseInt(year) == today.getFullYear()) return today.toLocaleDateString("pt-BR")
  return `31/12/${year}`
}

/**
 *
 * @param date formato: "dd/MM/YYYY"
 * @returns year
 */
export function getYearFromDateString(date: String): Number {
  if (!date) {
    throw new Error(`Não foi possível extrair ano da string: ${date}`)
  }
  return Number(date.trim().split('/')[2])
}

/**
 * Formata uma data para o formato esperado pela API (YYYY-MM-DD)
 * @param string Data a ser formatada
 * @return string no formato dd/mm/yyyy
 */
export function formatDateToApiString(date: string | null | undefined): string {
  if (!date) {
    return ''
  }
  const [year, month, day] = date.split('-').map(part => part.trim())
  return `${day}/${month}/${year}`
}
