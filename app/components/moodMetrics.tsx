'use client'

import React from 'react'
import { useAuth } from '../context/authContext'
import { findMoodStats } from '../functions/analyzeMoodData'
import { MoodTrends } from './metrics/moodTrends'
import { MoodStatistics } from './metrics/moodStats'
import { MoodCharts } from './metrics/moodCharts'
import { MoodCommonWords } from './metrics/moodWords'
import { useFetchMonthlyMoods } from '../services/fetchMonthlyMoods'
import { MoodData } from '../lib/interfaces'

const MoodMetrics: React.FC = () => {
  const { user } = useAuth()
  const [monthlyData, setMonthlyData] = React.useState<MoodData[]>([])
  const [loading, setLoading] = React.useState(false)

  const { fetchMonthlyMoods } = useFetchMonthlyMoods({
    user,
    setMonthlyData,
    setLoading,
  })

  React.useEffect(() => {
    if (user) {
      fetchMonthlyMoods()
    }
  }, [user, fetchMonthlyMoods])

  // Calculate mood statistics based on the fetched data
  const stats = findMoodStats(monthlyData)

  return (
    <>
      {/* Render the content only when not loading */}
      {!loading && (
        <div className="mt-10 flex w-full flex-col">
          <section className="flex-1 p-4 md:p-6">
            <div className="container mx-auto grid gap-6">
              {/* Pass relevant data and stats to each component */}
              <MoodTrends stats={stats} monthlyData={monthlyData} />
              <MoodStatistics stats={stats} />
              <MoodCommonWords stats={stats} monthlyData={monthlyData} />
              <MoodCharts monthlyData={monthlyData} stats={stats} />
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default MoodMetrics
