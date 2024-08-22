import { moodMapping } from '../lib/moodMap'
import { DEFAULT_BACKGROUND } from '../lib/utils'

export interface MoodMapping {
  [key: string]: {
    words: string[]
    color: string
    gradient: string
  }
}

export interface MoodMatchResult {
  matched: boolean
  gradientFound: string
  moodFound: string
  colorFound: string
}

/**
 * Matches a given prompt to a mood and its associated color and gradient.
 * @param prompt - The input string to match against mood keywords.
 * @returns MoodMatchResult object containing match results.
 */
export const matchMoodColor = (prompt: string): MoodMatchResult => {
  const lowercasedPrompt = prompt.toLowerCase()
  let matched = false
  let moodFound = ''
  let gradientFound = DEFAULT_BACKGROUND
  let colorFound = ''

  // Iterate over moodMapping to find the matching mood
  for (const [mood, { words, color, gradient }] of Object.entries(
    moodMapping
  )) {
    // Check if any word in the mood's word list is present in the prompt
    if (words.some((word) => lowercasedPrompt.includes(word.toLowerCase()))) {
      matched = true
      moodFound = mood
      gradientFound = gradient
      colorFound = color
      break
    }
  }

  if (!matched) {
    console.log('No matching mood category found.')
  }
  return { matched, gradientFound, moodFound, colorFound }
}
