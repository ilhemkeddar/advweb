import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import userService, { LoginResponse } from '../services/userService'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'professor' | 'student'
  department?: string
  title?: string
}

interface LoginResult { success: boolean; role?: string; error?: string }

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await userService.login(email, password) as LoginResponse
      const userData: User = {
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.email,
        role: response.user.role.toLowerCase() as 'admin' | 'professor' | 'student',
        department: response.user.department,
      }
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userData', JSON.stringify(userData))
      setUser(userData)
      return { success: true, role: userData.role }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed'
      return { success: false, error: errorMsg }
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
