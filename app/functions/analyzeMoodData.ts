import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { MoodData } from '../lib/interfaces'

// Define the interface for the return type of findMoodStats
export interface MoodStats {
  mostCommon: {
    mood: string
    count: number
    color: string
  }
  leastCommon: {
    mood: string
    count: number
    color: string
  }
  moodEntries: {
    [mood: string]: {
      count: number
      color: string
    }
  }
  moodByDayOfWeek: {
    [dayOfWeek: string]: {
      [mood: string]: {
        count: number
        color: string
      }
    }
  }
  mostCommonPrompt: {
    prompt: string
    count: number
  }
  leastCommonPrompt: {
    prompt: string
    count: number
  }
  mostCommonWords: {
    [word: string]: number
  }
  leastCommonWords: {
    [word: string]: number
  }
  positiveMoodPercentage: number
  negativeMoodPercentage: number
  positiveMoodCount: number
  negativeMoodCount: number
  neutralMoodCount: number
  reportedDaysCount: number
  unreportedDaysCount: number
  reportedDaysPercentage: number
  unreportedDaysPercentage: number
  neutralDaysPercentage: number
}

interface ColorDataType {
  [mood: string]: {
    score: 'positive' | 'neutral' | 'negative'
    gradient: string
    color: string
    words: string[]
  }
}

/**
 * Generates various mood statistics from the given entries.
 * @param entries - Array of mood data entries for the last 90 days.
 * @returns An object containing various mood statistics.
 */
export const findMoodStats = (
  entries: MoodData[],
  colorsData: ColorDataType
): MoodStats => {
  const positiveMoods = new Set<string>()
  const negativeMoods = new Set<string>()
  const neutralMoods = new Set<string>()

  // Populate sets based on the score of each mood in colorsData
  for (const mood in colorsData) {
    const moodData = colorsData[mood]
    switch (moodData.score) {
      case 'positive':
        positiveMoods.add(mood)
        break
      case 'neutral':
        neutralMoods.add(mood)
        break
      case 'negative':
        negativeMoods.add(mood)
        break
    }
  }

  // Initialize accumulators for mood statistics
  const moodCount: { [key: string]: number } = {}
  const moodColors: { [key: string]: string } = {}
  const moodByDayOfWeek: {
    [key: string]: { [mood: string]: { count: number; color: string } }
  } = {}
  const promptCount: { [prompt: string]: number } = {}
  const wordCount: { [word: string]: number } = {}
  const reportedDays = new Set<string>() // To track days with reported moods
  const neutralDays = new Set<string>() // To track days with only neutral moods

  /**
   * Tokenizes a prompt into lowercase words.
   * @param prompt - The prompt string to tokenize.
   * @returns An array of tokenized words.
   */
  const tokenizePrompt = (prompt: string) =>
    prompt.toLowerCase().match(/\b\w+\b/g) || []

  /**
   * Updates statistics based on a single mood entry.
   * @param entry - A single mood data entry.
   */
  const updateMoodStats = (entry: MoodData) => {
    const mood = entry.mood
    const entryDate = new Date(entry.timestamp)
    const dayOfWeek = entryDate.toLocaleString('en-US', { weekday: 'long' })
    const dateKey = entryDate.toISOString().split('T')[0]

    // Update mood count and color mapping
    moodCount[mood] = (moodCount[mood] || 0) + 1
    moodColors[mood] = entry.color
    reportedDays.add(dateKey)

    // Initialize moodByDayOfWeek for the current day of the week if not already present
    if (!moodByDayOfWeek[dayOfWeek]) {
      moodByDayOfWeek[dayOfWeek] = {}
    }

    // Update mood count for the day of the week
    if (!moodByDayOfWeek[dayOfWeek][mood]) {
      moodByDayOfWeek[dayOfWeek][mood] = { count: 0, color: moodColors[mood] }
    }
    moodByDayOfWeek[dayOfWeek][mood].count += 1

    // Update prompt count
    const prompt = entry.prompt || ''
    promptCount[prompt] = (promptCount[prompt] || 0) + 1

    // Tokenize and count words in the prompt
    for (const word of tokenizePrompt(prompt)) {
      wordCount[word] = (wordCount[word] || 0) + 1
    }

    // Track neutral days
    if (neutralMoods.has(mood)) {
      neutralDays.add(dateKey)
    }
  }

  /**
   * Finds the most and least common items from a count map.
   * @param countMap - A map of items and their counts.
   * @returns An object containing the most common item, least common item, and their counts.
   */
  const findMostAndLeastCommon = (countMap: { [key: string]: number }) => {
    let mostCommon = ''
    let leastCommon = ''
    let highestCount = 0
    let lowestCount = Infinity

    for (const [key, count] of Object.entries(countMap)) {
      if (count > highestCount) {
        mostCommon = key
        highestCount = count
      }
      if (count < lowestCount) {
        leastCommon = key
        lowestCount = count
      }
    }

    return { mostCommon, leastCommon, highestCount, lowestCount }
  }

  /**
   * Calculates the percentage based on a count and total value.
   * @param count - The count to calculate the percentage for.
   * @param total - The total value to calculate the percentage against.
   * @returns The calculated percentage.
   */
  const calculatePercentages = (count: number, total: number) =>
    total > 0 ? (count / total) * 100 : 0

  // Sort entries by timestamp
  entries.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  // Process each entry to update statistics
  for (const entry of entries) {
    updateMoodStats(entry)
  }

  // Get most and least common mood
  const {
    mostCommon: mostCommonMood,
    leastCommon: leastCommonMood,
    highestCount,
    lowestCount,
  } = findMostAndLeastCommon(moodCount)
  const moodEntries = Object.fromEntries(
    Object.entries(moodCount).map(([mood, count]) => [
      mood,
      { count, color: moodColors[mood] },
    ])
  )

  // Get most and least common prompts
  const {
    mostCommon: mostCommonPrompt,
    leastCommon: leastCommonPrompt,
    highestCount: highestPromptCount,
    lowestCount: lowestPromptCount,
  } = findMostAndLeastCommon(promptCount)

  // Get most and least common words
  const sortedWords = Object.entries(wordCount).sort(
    ([_, countA], [, countB]) => countB - countA
  )
  const mostCommonWords = Object.fromEntries(sortedWords.slice(0, 4))
  const leastCommonWords = Object.fromEntries(
    sortedWords.filter(
      ([_, count]) =>
        count ===
        (sortedWords.length > 4 ? sortedWords[sortedWords.length - 1][1] : 1)
    )
  )

  // Calculate reported and unreported days
  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(new Date())
  const totalDaysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  }).length
  const reportedDaysCount = reportedDays.size
  const unreportedDaysCount = totalDaysInMonth - reportedDaysCount
  const reportedDaysPercentage = calculatePercentages(
    reportedDaysCount,
    totalDaysInMonth
  )
  const unreportedDaysPercentage = calculatePercentages(
    unreportedDaysCount,
    totalDaysInMonth
  )

  // Calculate positive, negative, and neutral mood percentages based on reported days
  const positiveMoodCount = Object.entries(moodCount)
    .filter(([mood]) => positiveMoods.has(mood))
    .reduce((sum, [, count]) => sum + count, 0)
  const negativeMoodCount = Object.entries(moodCount)
    .filter(([mood]) => negativeMoods.has(mood))
    .reduce((sum, [, count]) => sum + count, 0)
  const neutralMoodCount = Object.entries(moodCount)
    .filter(([mood]) => neutralMoods.has(mood))
    .reduce((sum, [, count]) => sum + count, 0)

  const positiveMoodPercentage = calculatePercentages(
    positiveMoodCount,
    reportedDaysCount
  )
  const negativeMoodPercentage = calculatePercentages(
    negativeMoodCount,
    reportedDaysCount
  )
  const neutralDaysPercentage = calculatePercentages(
    neutralMoodCount,
    reportedDaysCount
  )

  return {
    mostCommon: {
      mood: mostCommonMood,
      count: highestCount,
      color: moodColors[mostCommonMood],
    },
    leastCommon: {
      mood: leastCommonMood,
      count: lowestCount,
      color: moodColors[leastCommonMood],
    },
    moodEntries,
    moodByDayOfWeek,
    mostCommonPrompt: { prompt: mostCommonPrompt, count: highestPromptCount },
    leastCommonPrompt: {
      prompt: leastCommonPrompt,
      count: lowestPromptCount === Infinity ? 0 : lowestPromptCount,
    },
    mostCommonWords,
    leastCommonWords,
    positiveMoodPercentage,
    negativeMoodPercentage,
    positiveMoodCount,
    negativeMoodCount,
    neutralMoodCount,
    reportedDaysCount,
    unreportedDaysCount,
    reportedDaysPercentage,
    unreportedDaysPercentage,
    neutralDaysPercentage,
  }
}
