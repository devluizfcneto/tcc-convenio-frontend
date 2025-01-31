import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

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
      this.handleError(error) // Lança o erro tratado
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
        console.error('Response Error:', axiosError.response.status, axiosError.response.data)
        throw new Error(`Erro ${axiosError.response.status} || "Erro na requisição."}`)
      } else if (axiosError.request) {
        console.error('Request Error:', axiosError.request)
        throw new Error('Não foi possível conectar ao servidor.')
      } else {
        console.error('Error', axiosError.message)
        throw new Error('Erro na requisição.')
      }
    } else {
      console.error('Erro desconhecido:', error)
      throw new Error('Ocorreu um erro desconhecido.')
    }
  }
}

export default new HttpService()
