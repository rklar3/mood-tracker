'use client'

import React from 'react'
import { findMoodStats } from '@/app/functions/analyzeMoodData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MoodData } from '@/app/lib/interfaces'
import { useColors } from '@/app/context/colorContext'

// Component for displaying mood trends
export const MoodTrends: React.FC<{
  stats: ReturnType<typeof findMoodStats>
  monthlyData: MoodData[]
}> = ({ stats, monthlyData }) => {
  const { matchMoodColor } = useColors()

  return (
    <Card className="border-shadow border-primary bg-primary">
      <CardHeader>
        <CardTitle className="text-secondary">
          Mood trends over the last 90 days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {monthlyData.length > 0 && (
            <>
              <MoodTrendCard
                title="Most Common Mood"
                count={stats.mostCommon.count}
                mood={stats.mostCommon.mood}
                color={matchMoodColor(stats.mostCommon.mood).colorFound}
              />
              <MoodTrendCard
                title="Least Common Mood"
                count={stats.leastCommon.count}
                mood={stats.leastCommon.mood}
                color={matchMoodColor(stats.leastCommon.mood).colorFound}
              />
              <MoodTrendCard
                title="Most Common Prompt Entered"
                count={stats.mostCommonPrompt.count}
                mood={stats.mostCommonPrompt.prompt}
                color={matchMoodColor(stats.mostCommonPrompt.prompt).colorFound}
              />
              <MoodTrendCard
                title="Least Common Prompt Entered"
                count={stats.leastCommonPrompt.count}
                mood={stats.leastCommonPrompt.prompt}
                color={
                  matchMoodColor(stats.leastCommonPrompt.prompt).colorFound
                }
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Component for individual mood trend cards
const MoodTrendCard: React.FC<{
  title: string
  count: number
  mood: string
  color: string
}> = ({ title, count, mood, color }) => (
  <div className="rounded-lg p-4" style={{ background: color }}>
    <div className="text-2xl font-bold text-card-foreground">
      {count}x {mood}
    </div>
    <div className="text-sm text-primary-foreground">{title}</div>
  </div>
)
