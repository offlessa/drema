export type UserRole = 'client' | 'professional' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  phone: string | null
  city: string
  state: string
}
