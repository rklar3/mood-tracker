'use client'

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { startOfMonth, endOfMonth } from 'date-fns'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/authContext'
import { analyzeMoodData } from '../functions/analyzeMoodData'

export interface MoodData {
  prompt: string
  color: string
  mood: string
  userId: string
  id: string
  timestamp: Date
}

export interface MoodAnalysis {
  mostCommonMoodMonth: { mood: string; color: string; count: number }
  leastCommonMoodMonth: { mood: string; color: string; count: number }
  numDaysWithContinuousMood: number
  mostCommonTimeOfDay: { hour: number; count: number }
  mostCommonMoodByWeekday: {
    [key: string]: { mood: string; color: string; count: number }
  }
  mostCommonMoodThisWeek: { mood: string; color: string; count: number }
}

export function MoodMetrics() {
  const { isAuthenticated, user } = useAuth()
  const [monthlyData, setMonthlyData] = useState<MoodData[]>([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null)

  console.log(monthlyData)
  console.log(loading)

  const fetchMonthlyMoods = useCallback(
    async (
      userId: string,
      setMonthlyData: Dispatch<SetStateAction<MoodData[]>>,
      setLoading: Dispatch<SetStateAction<boolean>>
    ) => {
      setLoading(true)
      try {
        const moodsRef = collection(db, 'moods')
        const start = startOfMonth(new Date())
        const end = endOfMonth(new Date())
        const fbQuery = query(
          moodsRef,
          where('userId', '==', user?.uid),
          where('timestamp', '>=', start),
          where('timestamp', '<=', end)
        )
        const querySnapshot = await getDocs(fbQuery)

        const moodData = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              timestamp: doc.data().timestamp.toDate(),
            }) as MoodData
        )

        setMonthlyData(moodData)
        setAnalysis(analyzeMoodData(moodData))
      } catch (error) {
        console.error('Error fetching monthly moods from Firebase:', error)
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchMonthlyMoods(user!.uid!, setMonthlyData, setLoading)
    }
  }, [isAuthenticated, user, fetchMonthlyMoods])

  return (
    <div className="mt-10 flex w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood trends over the last month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                {analysis && (
                  <>
                    <div className="rounded-lg bg-muted p-4">
                      <div className="text-2xl font-bold text-card-foreground">
                        {analysis.mostCommonMoodMonth.mood}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Most Common Mood
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <div className="text-2xl font-bold text-card-foreground">
                        {analysis.leastCommonMoodMonth.mood}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Least Common Mood
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <div className="text-2xl font-bold text-card-foreground">
                        N/A
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Number of Days with Continuous Mood Submitted
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <div className="text-2xl font-bold text-card-foreground">
                        N/A
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Most Common Time of Day
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>More Stats 1</CardTitle>
              </CardHeader>
              <CardContent>{/* add chart here */}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>More Stats 2</CardTitle>
              </CardHeader>
              <CardContent>{/* add chart here */}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>More Stats 3</CardTitle>
              </CardHeader>
              <CardContent>{/* add chart here */}</CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
