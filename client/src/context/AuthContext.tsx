import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  id: string
  username: string
  exp: number
}

interface AuthContextType {
  token: string | null
  username: string | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const getStoredToken = (): string | null => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      return null
    }
    return token
  } catch {
    localStorage.removeItem('token')
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken)
  const [username, setUsername] = useState<string | null>(() => {
    const t = getStoredToken()
    if (!t) return null
    try {
      return jwtDecode<JwtPayload>(t).username
    } catch {
      return null
    }
  })

  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    try {
      setUsername(jwtDecode<JwtPayload>(newToken).username)
    } catch {
      setUsername(null)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
