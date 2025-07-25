import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import ErrorHandler from '@/utils/errorHandler'

const http = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE_API || 'http://localhost:3001/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

class HttpService {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await http.get<T>(url, config)
      return response
    } catch (error: any) {
      this.handleError(error)
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await http.post<T>(url, data, config)
      return response
    } catch (error: any) {
      this.handleError(error)
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await http.put<T>(url, data, config)
      return response
    } catch (error: any) {
      this.handleError(error)
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await http.delete<T>(url, config)
      return response
    } catch (error: any) {
      this.handleError(error)
    }
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        console.error('ApiService - Response Error:', {
          status: axiosError.response.status,
          data: axiosError.response.data,
          url: axiosError.config?.url
        })
      } else if (axiosError.request) {
        console.error('ApiService - Network Error:', {
          message: 'Não foi possível conectar ao servidor',
          url: axiosError.config?.url
        })
      } else {
        console.error('ApiService - Request Setup Error:', axiosError.message)
      }
    } else {
      console.error('ApiService - Unknown Error:', error)
    }
    const friendlyMessage = ErrorHandler.handleApiError(error)
    throw new Error(friendlyMessage)
  }
}

export default new HttpService()
