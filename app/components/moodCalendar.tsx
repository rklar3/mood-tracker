'use client'

import React from 'react'
import { Calendar } from '@/components/ui/calendar' // Adjust path as needed
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/authContext'
import { DEFAULT_BACKGROUND } from '../lib/utils'

// Define the props for the MoodCalendar component
interface MoodCalendarProps {
  date: Date | undefined
  setDate: (date: Date) => void
  setBackground: (gradient: string) => void
  setPrompt: (prompt: string) => void
  setMoodId: (id: string | null) => void
  setPreviousMood: (mood: string) => void
  setColor: (color: string | null) => void
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({
  date,
  setDate,
  setBackground,
  setPrompt,
  setMoodId,
  setPreviousMood,
  setColor,
}) => {
  const { user } = useAuth()

  /**
   * Fetches mood data for the selected date from Firebase.
   * Updates state with fetched mood data or sets default values if no data is found.
   */
  const fetchMoodForDate = React.useCallback(
    async (selectedDate: Date | undefined) => {
      if (!selectedDate || !user?.uid) {
        console.log('Missing date or user.')
        return
      }

      const start = new Date(selectedDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(selectedDate)
      end.setHours(23, 59, 59, 999)

      try {
        const moodsRef = collection(db, 'moods')
        const fbQuery = query(
          moodsRef,
          where('userId', '==', user.uid),
          where('timestamp', '>=', start),
          where('timestamp', '<=', end)
        )
        const querySnapshot = await getDocs(fbQuery)

        if (!querySnapshot.empty) {
          const moodData = querySnapshot.docs[0].data()
          setPrompt(moodData.prompt)
          setBackground(moodData.gradient)
          setMoodId(moodData.id)
          setPreviousMood(moodData.mood)
          setColor(moodData.color)
        } else {
          // Set default values if no mood data is found
          setPrompt('')
          setMoodId(null)
          setBackground(DEFAULT_BACKGROUND)
          setPreviousMood('')
          setColor(null)
        }
      } catch (error) {
        console.log('Error fetching mood data from Firebase:', error)
      }
    },
    [user, setPrompt, setBackground, setMoodId, setPreviousMood, setColor]
  )

  // Wrap setDate in useCallback to ensure it's stable and avoid unnecessary re-renders
  const stableSetDate = React.useCallback(
    (newDate: Date) => {
      setDate(newDate)
    },
    [setDate]
  )

  // Fetch mood data on initial load (first page hit)
  React.useEffect(() => {
    stableSetDate(new Date())
  }, [stableSetDate])

  // Fetch mood data whenever the date changes
  React.useEffect(() => {
    fetchMoodForDate(date)
  }, [date, fetchMoodForDate])

  return (
    <div className="mt-10">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(selectedDate) => {
          if (selectedDate) {
            // Ensure the selectedDate is a valid Date object
            setDate(new Date(selectedDate))
          }
        }}
        className="rounded-md border border-primary shadow"
      />
    </div>
  )
}

export default MoodCalendar
