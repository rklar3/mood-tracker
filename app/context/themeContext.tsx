'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'

export interface ThemeContextProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
  background: string
  setBackground: (gradient: string) => void
}

const ThemeContext = createContext<ThemeContextProps>(
  undefined as unknown as ThemeContextProps
)

/**
 * A custom hook that exposes the ThemeContext to the developer. It throws an error if
 * called outside of the ThemeContext provider
 * @returns ThemeContextProps instance
 */
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

/**
 * A component that wraps around the ThemeContext's provider component. Any child components
 * wrapped inside of the ThemeProvider can access various values of the ThemeContext
 * @prop `children` - react child components that we want to wrap inside of ThemeProvider
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getInitialDarkMode = (): boolean => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkMode')
      return savedTheme ? JSON.parse(savedTheme) : false
    }
    return false
  }

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode)
  const [background, setBackground] = useState<string>(
    'linear-gradient(270deg, #3498db, #e91e63, #9b59b6, #3498db)'
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    }
  }, [isDarkMode])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('background', background)
    }
  }, [background])

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  const value: ThemeContextProps = {
    isDarkMode,
    toggleDarkMode,
    background,
    setBackground,
  }

  return (
    <ThemeContext.Provider value={value}>
      <div className={isDarkMode ? '' : 'dark'} style={{ background }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
