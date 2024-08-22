import React from 'react'
import { findMoodStats } from '@/app/functions/analyzeMoodData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FrownIcon, SmileIcon } from '@/app/lib/icons'
import { useColors } from '@/app/context/colorContext'

// Component for mood statistics (positive, negative, neutral moods, etc.)
export const MoodStatistics: React.FC<{
  stats: ReturnType<typeof findMoodStats>
}> = ({ stats }) => {
  const { matchMoodColor } = useColors()
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MoodStatCard
        title="Positive Moods"
        percentage={stats.positiveMoodPercentage.toFixed(1)}
        color={matchMoodColor('happy').colorFound}
        icon={<SmileIcon className="h-4 w-4 text-muted-foreground" />}
      />
      <MoodStatCard
        title="Negative Moods"
        percentage={stats.negativeMoodPercentage.toFixed(1)}
        color={matchMoodColor('angry').colorFound}
        icon={<FrownIcon className="h-4 w-4 text-muted-foreground" />}
      />
      <MoodStatCard
        title="Neutral Moods"
        percentage={stats.neutralDaysPercentage.toFixed(1)}
        color={matchMoodColor('calm').colorFound}
      />

      <Card
        style={{ color: `${matchMoodColor('neutral').colorFound}` }}
        className="border-shadow border-primary bg-primary"
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Reported Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {stats.reportedDaysCount} / 30
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component for individual mood stat cards
const MoodStatCard: React.FC<{
  title: string
  percentage: string
  color: string
  icon?: React.ReactNode
}> = ({ title, percentage, color, icon }) => (
  <Card style={{ color }} className="border-shadow border-primary bg-primary">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold">{percentage}%</div>
    </CardContent>
  </Card>
)
