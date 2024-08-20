'use client'

import React, { createContext, ReactNode, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import router from 'next/router'

export interface User {
  uid: string
  displayName: string
  email: string
  emailVerified: boolean
}

export interface AuthContextProps {
  isAuthenticated: boolean
  user: User | null
  setUser: (user: User | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>(
  undefined as unknown as AuthContextProps
)

/**
 * A custom hook that exposes the AuthContext to the developer. It throws an error if
 * called outside of the AuthContext provider
 * @returns AuthContextProps instance
 */
export const useAuth = (): AuthContextProps => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthContext provider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

/**
 * A component that wraps around the AuthContext's provider component. Any child components
 * wrapped inside of the AuthProvider can access various values of the AuthContext
 * @prop `children` - react child components that we want to wrap inside of AuthProvider
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const mappedUser: User = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          emailVerified: currentUser.emailVerified,
        }
        setUser(mappedUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setIsAuthenticated(false)
      router.push('/auth/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    setUser,
    setIsAuthenticated,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
