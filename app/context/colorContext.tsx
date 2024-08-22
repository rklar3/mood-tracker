'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchColors, addColor } from '../services/updateColors'
import { useAuth } from './authContext'
import { MoodMapping, moodMapping } from '../lib/moodMap'
import { DEFAULT_BACKGROUND } from '../lib/constant'

interface MoodMatchResult {
  matched: boolean
  moodFound: string
  gradientFound: string
  colorFound: string
}

interface ColorContextType {
  colors: MoodMapping
  setColors: React.Dispatch<React.SetStateAction<MoodMapping>>
  refreshColors: () => Promise<void>
  matchMoodColor: (prompt: string) => MoodMatchResult
  loadColors: () => Promise<void>
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

export const useColors = () => {
  const context = useContext(ColorContext)
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider')
  }
  return context
}

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colors, setColors] = useState<MoodMapping>(moodMapping)
  const { user } = useAuth()

  const loadColors = React.useCallback(async () => {
    if (user) {
      try {
        const colorsData = await fetchColors(user.uid)

        if (colorsData) {
          setColors(colorsData)
        } else {
          await addColor(user.uid, moodMapping)
          setColors(moodMapping)
        }
      } catch (error) {
        console.log('Error fetching colors from Firebase:', error)
      }
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadColors()
    }
  }, [user, loadColors])

  const refreshColors = async () => {
    await loadColors()
  }

  const matchMoodColor = React.useCallback(
    (prompt: string): MoodMatchResult => {
      const lowercasedPrompt = prompt.toLowerCase()
      let matched = false
      let moodFound = ''
      let gradientFound = DEFAULT_BACKGROUND
      let colorFound = ''

      for (const [mood, { words, color, gradient }] of Object.entries(colors)) {
        if (
          words.some((word) => lowercasedPrompt.includes(word.toLowerCase()))
        ) {
          matched = true
          moodFound = mood
          gradientFound = gradient
          colorFound = color
          break
        }
      }

      return {
        matched,
        moodFound: moodFound,
        gradientFound: gradientFound,
        colorFound: colorFound,
      }
    },
    [colors]
  )

  return (
    <ColorContext.Provider
      value={{
        colors,
        setColors,
        refreshColors,
        matchMoodColor,
        loadColors,
      }}
    >
      {children}
    </ColorContext.Provider>
  )
}
