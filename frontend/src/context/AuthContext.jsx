import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('shopverse_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data)
    return data
  }, [])

  const register = useCallback(async (fullName, email, password, phone) => {
    const { data } = await api.post('/auth/register', { fullName, email, password, phone })
    persist(data)
    return data
  }, [])

  const persist = (data) => {
    localStorage.setItem('shopverse_token', data.token)
    const userInfo = { userId: data.userId, fullName: data.fullName, email: data.email, roles: data.roles }
    localStorage.setItem('shopverse_user', JSON.stringify(userInfo))
    setUser(userInfo)
  }

  const logout = useCallback(() => {
    localStorage.removeItem('shopverse_token')
    localStorage.removeItem('shopverse_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
