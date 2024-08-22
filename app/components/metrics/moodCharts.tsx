import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import MoodPieChart from './moodPieChart'
import MoodBarChart from './moodBarChart'
import MoodAreaChart from './moodAreaChart'
import { findMoodStats } from '@/app/functions/analyzeMoodData'
import { MoodData } from '@/app/lib/interfaces'

export const MoodCharts: React.FC<{
  monthlyData: MoodData[]
  stats: ReturnType<typeof findMoodStats>
}> = ({ monthlyData, stats }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card className="border-shadow border-primary bg-primary">
      <CardHeader>
        <CardTitle className="text-secondary">Mood Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <MoodPieChart data={monthlyData} />
      </CardContent>
    </Card>
    <Card className="border-shadow border-primary bg-primary">
      <CardHeader>
        <CardTitle className="text-secondary">Entry Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <MoodBarChart data={monthlyData} />
      </CardContent>
    </Card>
    <Card className="border-shadow border-primary bg-primary">
      <CardHeader>
        <CardTitle className="text-secondary">Mood Totals</CardTitle>
      </CardHeader>
      <CardContent>
        <MoodAreaChart stats={stats} />
      </CardContent>
    </Card>
  </div>
)
