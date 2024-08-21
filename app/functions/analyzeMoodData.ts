import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  getDay,
  getHours,
} from 'date-fns'
import { MoodAnalysis, MoodData } from '../components/moodMetrics'

export const analyzeMoodData = (data: MoodData[]): MoodAnalysis => {
  const moodCountsMonth: { [key: string]: number } = {}
  const moodCountsWeekday: { [key: string]: { [key: string]: number } } = {}
  const moodCountsWeek: { [key: string]: number } = {}
  const hourCounts: { [key: number]: number } = {}

  const now = new Date()
  const startMonth = startOfMonth(now)
  const endMonth = endOfMonth(now)
  const startWeek = startOfWeek(now)
  const endWeek = endOfWeek(now)

  let numDaysWithContinuousMood = 1 // initialize to 1 since we have at least 1 mood data point
  let prevDate: Date | null = null

  data.forEach((item) => {
    const { mood, color, timestamp } = item
    const isInMonth = timestamp >= startMonth && timestamp <= endMonth
    const isInWeek = timestamp >= startWeek && timestamp <= endWeek
    const weekday = getDay(timestamp) // Sunday = 0, Monday = 1, etc.
    const hour = getHours(timestamp)

    // Count moods for the month
    if (isInMonth) {
      moodCountsMonth[mood] = (moodCountsMonth[mood] || 0) + 1
    }

    // Count moods by weekday
    if (!moodCountsWeekday[weekday]) {
      moodCountsWeekday[weekday] = {}
    }
    moodCountsWeekday[weekday][mood] =
      (moodCountsWeekday[weekday][mood] || 0) + 1

    // Count moods for the week
    if (isInWeek) {
      moodCountsWeek[mood] = (moodCountsWeek[mood] || 0) + 1
    }

    // Count hours
    hourCounts[hour] = (hourCounts[hour] || 0) + 1

    // Check for continuous mood submissions
    if (prevDate && timestamp.getDate() === prevDate.getDate()) {
      numDaysWithContinuousMood++
    }
    prevDate = timestamp
  })

  // Find most common mood for the month
  const mostCommonMoodMonth = Object.entries(moodCountsMonth).reduce(
    (acc, [mood, count]) =>
      count > acc.count
        ? {
            mood,
            color: data.find((item) => item.mood === mood)?.color || '',
            count,
          }
        : acc,
    { mood: '', color: '', count: 0 }
  )

  // Find least common mood for the month
  const leastCommonMoodMonth = Object.entries(moodCountsMonth).reduce(
    (acc, [mood, count]) =>
      count < acc.count
        ? {
            mood,
            color: data.find((item) => item.mood === mood)?.color || '',
            count,
          }
        : acc,
    { mood: '', color: '', count: Number.MAX_SAFE_INTEGER }
  )

  // Find most common mood by weekday
  const mostCommonMoodByWeekday = Object.keys(moodCountsWeekday).reduce(
    (acc, weekday) => {
      const mostCommon = Object.entries(moodCountsWeekday[weekday]).reduce(
        (acc, [mood, count]) =>
          count > acc.count
            ? {
                mood,
                color: data.find((item) => item.mood === mood)?.color || '',
                count,
              }
            : acc,
        { mood: '', color: '', count: 0 }
      )
      acc[weekday] = mostCommon
      return acc
    },
    {} as { [key: string]: { mood: string; color: string; count: number } }
  )

  // Find most common mood for the week
  const mostCommonMoodThisWeek = Object.entries(moodCountsWeek).reduce(
    (acc, [mood, count]) =>
      count > acc.count
        ? {
            mood,
            color: data.find((item) => item.mood === mood)?.color || '',
            count,
          }
        : acc,
    { mood: '', color: '', count: 0 }
  )

  // Find most common time of day
  const mostCommonTimeOfDay = Object.entries(hourCounts).reduce(
    (acc, [hour, count]) =>
      count > acc.count ? { hour: parseInt(hour), count } : acc,
    { hour: 0, count: 0 }
  )

  return {
    mostCommonMoodMonth,
    leastCommonMoodMonth,
    numDaysWithContinuousMood,
    mostCommonTimeOfDay,
    mostCommonMoodByWeekday,
    mostCommonMoodThisWeek,
  }
}
