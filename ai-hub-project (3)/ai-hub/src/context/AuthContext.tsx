import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '../data/mockData'

interface LoginResult { success: boolean; role?: string }

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, _password: string): Promise<LoginResult> => {
    if (!email) return { success: false }
    await new Promise(r => setTimeout(r, 500))
    let mockUser: User
    if (email.toLowerCase().includes('admin')) {
      mockUser = { id:'admin1', name:'Admin Boudiaf', email, role:'admin' }
    } else if (email.toLowerCase().includes('prof') || email.toLowerCase().includes('dr')) {
      mockUser = { id:'prof1', name:'Dr. Meriem Hadj', email, role:'professor', department:'Computer Science', title:'Associate Professor' }
    } else {
      mockUser = { id:'stu1', name:'Amine Bensaid', email, role:'student', department:'Computer Science' }
    }
    setUser(mockUser)
    return { success: true, role: mockUser.role }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
