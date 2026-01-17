import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    initialized: false,
    data: null
  })
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('freeducation_token')
        
        if (token) {
          // Verify token with backend
          const response = await authAPI.getProfile()
          if (response.success) {
            setUser({
              isAuthenticated: true,
              initialized: true,
              data: response.admin
            })
          } else {
            localStorage.removeItem('freeducation_token')
          }
        } else {
          // Check if system is initialized
          const initResponse = await authAPI.checkInitialization()
          setUser(prev => ({
            ...prev,
            initialized: initResponse.initialized
          }))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('freeducation_token')
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      
      if (response.token) {
        localStorage.setItem('freeducation_token', response.token)
        setUser({
          isAuthenticated: true,
          initialized: true,
          data: response.admin
        })
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const registerFirstAdmin = async (adminData) => {
    try {
      const response = await authAPI.registerFirstAdmin(adminData)
      
      if (response.token) {
        localStorage.setItem('freeducation_token', response.token)
        setUser({
          isAuthenticated: true,
          initialized: true,
          data: response.admin
        })
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('freeducation_token')
    setUser({
      isAuthenticated: false,
      initialized: true,
      data: null
    })
  }

  const value = {
    user,
    loading,
    isMobile,
    login,
    logout,
    registerFirstAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
