import axios from 'axios'
import { api, ensureCsrfCookie } from './api'
import type { User, UserRole } from '../types/user'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: UserRole
  city: string
  state: string
  phone?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export async function register(payload: RegisterPayload): Promise<User> {
  await ensureCsrfCookie()
  const { data } = await api.post<{ data: User }>('/api/register', payload)
  return data.data
}

export async function login(payload: LoginPayload): Promise<User> {
  await ensureCsrfCookie()
  const { data } = await api.post<{ data: User }>('/api/login', payload)
  return data.data
}

export async function logout(): Promise<void> {
  await ensureCsrfCookie()
  await api.post('/api/logout')
}

export async function fetchMe(): Promise<User | null> {
  try {
    const { data } = await api.get<{ data: User }>('/api/user')
    return data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null
    }
    throw error
  }
}
