class LocalStorageService {
  getItem(key: string): any {
    const cachedData = localStorage.getItem(key)
    if (cachedData) {
      try {
        return JSON.parse(cachedData)
      } catch (error) {
        console.error(`Erro ao analisar cache para ${key}:`, error)
        localStorage.removeItem(key)
      }
    }
    return null
  }

  setItem(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  isCacheValid(cachedData: any, cacheDuration: number): boolean {
    const now = Date.now()
    return now - cachedData.timestamp < cacheDuration
  }
}

export default new LocalStorageService()
