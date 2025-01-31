export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return ''
  }

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  } catch (error) {
    console.error('Erro ao formatar data:', error)
    return 'Data Inválida' // Mensagem de erro mais informativa
  }
}

export function formatValue(value: number | null | undefined): string {
  if (value == null) {
    // Usando == para verificar null e undefined
    return 'R$ 0,00' // Valor padrão mais claro
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
  if (!year) return ''
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
