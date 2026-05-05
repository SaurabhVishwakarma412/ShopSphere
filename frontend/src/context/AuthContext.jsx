/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser)

  const saveSession = useCallback(({ token, user: nextUser }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const login = useCallback(async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    saveSession(data)
    return data.user
  }, [saveSession])

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    saveSession(data)
    return data.user
  }, [saveSession])

  const updateProfile = useCallback(async (payload) => {
    const { data } = await api.put('/auth/profile', payload)
    saveSession(data)
    return data.user
  }, [saveSession])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isSeller: user?.role === 'seller', login, register, logout, updateProfile }),
    [login, register, updateProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
