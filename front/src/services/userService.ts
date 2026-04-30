import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    fullName: string
    email: string
    role: 'Student' | 'Professor' | 'Admin'
    department?: string
    profilePicture?: string
  }
}

export interface RegisterCredentials {
  fullName: string
  email: string
  password: string
  role: 'Student' | 'Professor'
  department?: string
}

const userService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/users/login', { email, password }) as unknown as Promise<LoginResponse>,

  register: (data: RegisterCredentials) =>
    api.post<LoginResponse>('/users/register', data) as unknown as Promise<LoginResponse>,

  getDashboard: (userId: string) =>
    api.get(`/users/dashboard/${userId}`) as unknown as Promise<unknown>,
}

export default userService
