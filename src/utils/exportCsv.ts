export function formatDataToCSV(data: any[], columns: any[]): string {
  const csvRows: string[] = []

  const headers = columns.map((col) => col.exportHeader || col.header)
  csvRows.push(headers.join(','))

  data.forEach((row) => {
    const values = columns.map((col) => {
      let value = row[col.field]

      if (col.format) {
        value = col.format(value)
      }

      return `"${value ? value.toString().replace(/"/g, '""') : ''}"`
    })
    csvRows.push(values.join(','))
  })

  return csvRows.join('\n')
}

export function downloadCSV(csvData: string, filename: string): void {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
