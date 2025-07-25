/**
 * Utilitário para tratamento centralizado de erros da API
 * Extrai e usa as mensagens originais da API para exibição ao usuário
 */

import axios from 'axios'

export interface ApiError {
  status: number
  message: string
  originalError?: any
}

export class ErrorHandler {
  /**
   * Extrai informações de erro de uma resposta da API
   * Prioriza sempre a mensagem original do backend
   */
  static extractErrorInfo(error: any): ApiError {
    if (!error.response && axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return {
          status: 0,
          message: 'Tempo limite da requisição excedido. Tente novamente.',
          originalError: error
        }
      }
      return {
        status: 0,
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
        originalError: error
      }
    }

    const status = error.response?.status || 0
    const data = error.response?.data

    let message = 'Erro inesperado. Tente novamente mais tarde.'
    
    if (data && data.message) {
      message = data.message
    } else if (data) {
      message = data.error || data.details || data.msg || message
    }

    return {
      status,
      message,
      originalError: error
    }
  }

  /**
   * Extrai mensagem de erro da API para qualquer contexto
   * Usa sempre a mensagem original do backend quando disponível
   */
  static getApiErrorMessage(error: any): string {
    const errorInfo = this.extractErrorInfo(error)
    
    if (errorInfo.status > 0 && errorInfo.message !== 'Erro inesperado. Tente novamente mais tarde.') {
      return errorInfo.message
    }

    switch (errorInfo.status) {
      case 0:
        return errorInfo.message
      
      default:
        return errorInfo.message || 'Erro inesperado. Tente novamente mais tarde.'
    }
  }

  /**
   * Métodos específicos que agora apenas chamam getApiErrorMessage
   * Mantidos para compatibilidade com o código existente
   */
  static mapDashboardError(error: any): string {
    return this.getApiErrorMessage(error)
  }

  static mapConveniosError(error: any): string {
    return this.getApiErrorMessage(error)
  }

  static mapRankingError(error: any): string {
    return this.getApiErrorMessage(error)
  }

  static mapIfesError(error: any): string {
    return this.getApiErrorMessage(error)
  }

  static mapGenericError(error: any): string {
    return this.getApiErrorMessage(error)
  }

  static handleApiError(error: any): string {
    return this.getApiErrorMessage(error)
  }
}


export default ErrorHandler
