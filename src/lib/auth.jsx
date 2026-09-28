import { createContext, useContext, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import * as api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.getSessionUser())

  const value = {
    user,
    setUser,
    signUp: async (data) => setUser(await api.signUp(data)),
    signIn: async (data) => setUser(await api.signIn(data)),
    signOut: async () => {
      await api.signOut()
      setUser(null)
    },
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}
