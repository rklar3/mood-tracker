'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { DEFAULT_BACKGROUND } from '../lib/constant'

export interface ThemeContextProps {
  theme: string
  toggleTheme: () => void
  background: string
  setBackground: (gradient: string) => void
}

const ThemeContext = createContext<ThemeContextProps>(
  undefined as unknown as ThemeContextProps
)

export const useTheme = (): ThemeContextProps => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeContext provider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [background, setBackground] = useState<string>(DEFAULT_BACKGROUND)
  const [theme, setTheme] = useState<string>('light')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
    const savedBackground = localStorage.getItem('background')
    if (savedBackground) {
      setBackground(savedBackground)
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('theme', theme)
    }
  }, [theme, isClient])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('background', background)
    }
  }, [background, isClient])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const value: ThemeContextProps = {
    theme,
    toggleTheme,
    background,
    setBackground,
  }

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme} style={{ background }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
