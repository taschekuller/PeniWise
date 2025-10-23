import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAppStore } from '../store/useAppStore'

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth token from store
    const token = useAppStore.getState().user.id

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Set loading state
    useAppStore.getState().setLoading('api', true)

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error: AxiosError) => {
    useAppStore.getState().setLoading('api', false)
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    useAppStore.getState().setLoading('api', false)
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    useAppStore.getState().setLoading('api', false)

    console.error('❌ Response Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    })

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear user data
      useAppStore.getState().logout()
    }

    return Promise.reject(error)
  }
)

// API Service Class
export class ApiService {
  // Generic methods
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config)
    return response.data
  }

  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  }

  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  }

  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config)
    return response.data
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  }

  // Specific API methods
  static async login(email: string, password: string) {
    return this.post<{ user: any; token: string }>('/auth/login', {
      email,
      password,
    })
  }

  static async register(userData: {
    name: string
    email: string
    password: string
  }) {
    return this.post<{ user: any; token: string }>('/auth/register', userData)
  }

  static async getUserProfile() {
    return this.get<{ user: any }>('/user/profile')
  }

  static async updateUserProfile(userData: Partial<{
    name: string
    email: string
  }>) {
    return this.patch<{ user: any }>('/user/profile', userData)
  }

  // Calendar/Events API
  static async getEvents() {
    return this.get<{ events: any[] }>('/events')
  }

  static async createEvent(eventData: {
    title: string
    date: string
    time?: string
    description?: string
  }) {
    return this.post<{ event: any }>('/events', eventData)
  }

  static async updateEvent(eventId: string, eventData: Partial<{
    title: string
    date: string
    time?: string
    description?: string
  }>) {
    return this.patch<{ event: any }>(`/events/${eventId}`, eventData)
  }

  static async deleteEvent(eventId: string) {
    return this.delete<{ success: boolean }>(`/events/${eventId}`)
  }

  // File upload
  static async uploadFile(file: FormData, onProgress?: (progress: number) => void) {
    return apiClient.post('/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  }
}

// Custom hooks for API calls
export const useApiCall = () => {
  const setLoading = useAppStore((state) => state.setLoading)

  const callApi = async <T>(
    apiCall: () => Promise<T>,
    loadingKey: 'user' | 'calendar' | 'api' = 'api'
  ): Promise<T> => {
    try {
      setLoading(loadingKey, true)
      const result = await apiCall()
      return result
    } catch (error) {
      console.error('API Call Error:', error)
      throw error
    } finally {
      setLoading(loadingKey, false)
    }
  }

  return { callApi }
}

// Error handling utility
export const handleApiError = (error: AxiosError): string => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const message = (error.response.data as any)?.message || error.message

    switch (status) {
      case 400:
        return 'Bad request. Please check your input.'
      case 401:
        return 'Unauthorized. Please log in again.'
      case 403:
        return 'Forbidden. You do not have permission to perform this action.'
      case 404:
        return 'Resource not found.'
      case 422:
        return message || 'Validation error.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return message || 'An unexpected error occurred.'
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.'
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.'
  }
}

export default apiClient
