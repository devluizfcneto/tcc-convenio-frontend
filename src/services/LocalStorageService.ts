class LocalStorageService {
  private readonly MAX_STORAGE_SIZE = 4.5 * 1024 * 1024 // 4.5MB (deixar margem de segurança)
  private readonly CACHE_PREFIX = 'cache_'
  
  getItem(key: string): any {
    const cachedData = localStorage.getItem(key)
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData)
        
        if (parsedData && typeof parsedData === 'object' && parsedData.timestamp) {
          parsedData.lastAccessed = Date.now()
          localStorage.setItem(key, JSON.stringify(parsedData))
        }
        
        return parsedData
      } catch (error) {
        console.error(`Erro ao analisar cache para ${key}:`, error)
        localStorage.removeItem(key)
      }
    }
    return null
  }

  setItem(key: string, data: any): void {
    try {
      const dataToStore = {
        ...data,
        lastAccessed: Date.now()
      }
      
      const serializedData = JSON.stringify(dataToStore)
      
      if (this.getCurrentStorageSize() + serializedData.length > this.MAX_STORAGE_SIZE) {
        console.log('LocalStorage próximo do limite. Iniciando limpeza automática...')
        this.cleanupOldCache()
      }
      
      localStorage.setItem(key, serializedData)
      
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn('LocalStorage cheio! Executando limpeza forçada...')
        this.forceCleanup()
        
        try {
          localStorage.setItem(key, JSON.stringify({
            ...data,
            lastAccessed: Date.now()
          }))
        } catch (retryError) {
          console.error('Não foi possível armazenar no LocalStorage mesmo após limpeza:', retryError)
        }
      } else {
        console.error('Erro ao armazenar no LocalStorage:', error)
      }
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  isCacheValid(cachedData: any, cacheDuration: number): boolean {
    const now = Date.now()
    return now - cachedData.timestamp < cacheDuration
  }

  /**
   * Calcula o tamanho atual do LocalStorage em bytes
   */
  getCurrentStorageSize(): number {
    let totalSize = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length
      }
    }
    return totalSize
  }

  /**
   * Remove itens de cache expirados e mais antigos
   */
  cleanupOldCache(): void {
    const cacheItems = []
    const now = Date.now()
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && this.isCacheItem(key)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}')
          cacheItems.push({
            key,
            timestamp: item.timestamp || 0,
            lastAccessed: item.lastAccessed || item.timestamp || 0,
            size: localStorage.getItem(key)?.length || 0,
            data: item
          })
        } catch (error) {
          localStorage.removeItem(key)
        }
      }
    }

    const expiredItems = cacheItems.filter(item => 
      now - item.timestamp > 24 * 60 * 60 * 1000
    )
    
    expiredItems.forEach(item => {
      console.log(`Removendo cache expirado: ${item.key}`)
      localStorage.removeItem(item.key)
    })

    if (this.getCurrentStorageSize() > this.MAX_STORAGE_SIZE * 0.8) {
      const remainingItems = cacheItems.filter(item => 
        !expiredItems.includes(item)
      )
      
      remainingItems.sort((a, b) => a.lastAccessed - b.lastAccessed)
      
      const itemsToRemove = Math.ceil(remainingItems.length * 0.3)
      
      for (let i = 0; i < itemsToRemove && i < remainingItems.length; i++) {
        console.log(`Removendo cache pouco usado: ${remainingItems[i].key}`)
        localStorage.removeItem(remainingItems[i].key)
      }
    }
    
    console.log(`Limpeza concluída. Tamanho atual: ${(this.getCurrentStorageSize() / 1024 / 1024).toFixed(2)}MB`)
  }

  /**
   * Limpeza forçada quando LocalStorage está totalmente cheio
   */
  forceCleanup(): void {
    console.warn('Executando limpeza forçada do LocalStorage')
    
    const cacheItems = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && this.isCacheItem(key)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}')
          cacheItems.push({
            key,
            lastAccessed: item.lastAccessed || item.timestamp || 0,
            size: localStorage.getItem(key)?.length || 0
          })
        } catch (error) {
          localStorage.removeItem(key)
        }
      }
    }

    cacheItems.sort((a, b) => a.lastAccessed - b.lastAccessed)
    const itemsToRemove = Math.ceil(cacheItems.length * 0.5)
    
    for (let i = 0; i < itemsToRemove; i++) {
      localStorage.removeItem(cacheItems[i].key)
    }
    
    console.log(`Limpeza forçada concluída. ${itemsToRemove} itens removidos.`)
  }

  /**
   * Verifica se uma chave é um item de cache (não configuração do usuário)
   */
  private isCacheItem(key: string): boolean {
    const cachePatterns = [
      'convenios_cache',
      'convenios_ranking_cache', 
      'all_ifes_cache',
      'ifes_comparacao_cache',
      'dashboard_cache'
    ]
    
    return cachePatterns.some(pattern => key.includes(pattern))
  }

  /**
   * Método utilitário para verificar status do storage
   */
  getStorageInfo(): {
    totalSizeMB: string
    maxSizeMB: string  
    usagePercentage: string
    totalItems: number
    cacheItems: number
    cacheKeys: string[]
  } {
    const totalSize = this.getCurrentStorageSize()
    const totalItems = localStorage.length
    const cacheItems = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && this.isCacheItem(key)) {
        cacheItems.push(key)
      }
    }
    
    return {
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      maxSizeMB: (this.MAX_STORAGE_SIZE / 1024 / 1024).toFixed(2),
      usagePercentage: ((totalSize / this.MAX_STORAGE_SIZE) * 100).toFixed(1),
      totalItems,
      cacheItems: cacheItems.length,
      cacheKeys: cacheItems
    }
  }

  /**
   * Limpa todo o cache manualmente (útil para debugging)
   */
  clearAllCache(): void {
    const keysToRemove = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && this.isCacheItem(key)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    console.log(`Cache limpo: ${keysToRemove.length} itens removidos`)
  }
}

export default new LocalStorageService()
