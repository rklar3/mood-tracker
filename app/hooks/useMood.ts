import React from 'react'

export interface MoodState {
  prompt: string
  currentMood: string
  previousMood: string
  currentMoodId: string | null
  color: string | null
  selectedDate: Date | undefined
}

export interface MoodHook {
  setPrompt: (prompt: string) => void
  getPrompt: () => string
  setCurrentMood: (mood: string) => void
  getCurrentMood: () => string
  setPreviousMood: (mood: string) => void
  getPreviousMood: () => string
  setMoodId: (id: string | null) => void
  getMoodId: () => string | null
  setColor: (color: string | null) => void
  getColor: () => string | null
  setSelectedDate: (date: Date | undefined) => void
  getSelectedDate: () => Date | undefined
  resetMoodState: () => void
}

/**
 * Creates a custom hook to manage the mood state, including getter and setter functions.
 * This hook also includes functionality to match a mood and color based on a given phrase.
 *
 * @returns The mood hook containing functions to manipulate the state.
 */
export const useMood = (): MoodHook => {
  const [prompt, setPrompt] = React.useState<string>('')
  const [currentMood, setCurrentMood] = React.useState<string>('')
  const [previousMood, setPreviousMood] = React.useState<string>('')
  const [moodId, setMoodId] = React.useState<string | null>(null)
  const [color, setColor] = React.useState<string | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  )

  /**
   * Resets all mood state to their initial values.
   */
  const resetMoodState = (): void => {
    setPrompt('')
    setCurrentMood('')
    setPreviousMood('')
    setMoodId(null)
    setColor(null)
    setSelectedDate(undefined)
  }

  return {
    setPrompt,
    getPrompt: () => prompt,

    setCurrentMood,
    getCurrentMood: () => currentMood,

    setPreviousMood,
    getPreviousMood: () => previousMood,

    setMoodId,
    getMoodId: () => moodId,

    setColor,
    getColor: () => color,

    setSelectedDate,
    getSelectedDate: () => selectedDate,

    resetMoodState,
  }
}
