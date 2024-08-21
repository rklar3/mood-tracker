'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar' // Adjust path as needed
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/authContext'
import { DEFAULT_BACKGROUND } from '../lib/utils'

export function MoodCalendar({
  date,
  setDate,
  setBackground,
  setPrompt,
  setCurrentMoodId,
  setPreviousMood,
  setColor,
}: {
  date: Date | undefined
  setDate: (arg0: Date) => void
  setBackground: (arg0: string) => void
  setPrompt: (arg0: any) => void
  setCurrentMoodId: (arg0: any) => void
  setPreviousMood: (arg0: any) => void
  setColor: (arg0: any) => void
}) {
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const fetchMoodForDate = async (selectedDate: Date | undefined) => {
    if (!selectedDate || !user?.uid || !isAuthenticated) {
      console.log('Missing date, user, or authentication status.')
      return
    }

    if (!(selectedDate instanceof Date)) {
      return
    }

    const start = new Date(selectedDate)
    start.setHours(0, 0, 0, 0) // Start of the day
    const end = new Date(selectedDate)
    end.setHours(23, 59, 59, 999) // End of the day

    setLoading(true)
    try {
      const moodsRef = collection(db, 'moods')
      const fbQuery = query(
        moodsRef,
        where('userId', '==', user.uid),
        where('timestamp', '>=', start),
        where('timestamp', '<=', end)
      )
      const querySnapshot = await getDocs(fbQuery)

      if (querySnapshot.docs && querySnapshot.docs.length > 0) {
        const moodData = querySnapshot.docs[0].data()
        setPrompt(moodData.prompt)
        setBackground(moodData.gradient)
        setCurrentMoodId(moodData.id)
        setPreviousMood(moodData.mood)
        setColor(moodData.color)
      } else {
        setPrompt(null)
        setCurrentMoodId(null)
        setBackground(DEFAULT_BACKGROUND)
        setPreviousMood(null)
        setColor(null)
      }
    } catch (error) {
      console.error('Error fetching mood data from Firebase:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMoodForDate(date)
  }, [date])

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(selectedDate) => {
          if (selectedDate) {
            // Ensure the selectedDate is a valid Date object
            setDate(new Date(selectedDate))
          }
        }}
        className="rounded-md border shadow"
      />
    </div>
  )
}
