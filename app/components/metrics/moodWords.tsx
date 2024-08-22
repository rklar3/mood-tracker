import React from 'react'
import { findMoodStats } from '@/app/functions/analyzeMoodData'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MoodData } from '@/app/lib/interfaces'
import { useColors } from '@/app/context/colorContext'

// Component for displaying common words used in prompts
export const MoodCommonWords: React.FC<{
  stats: ReturnType<typeof findMoodStats>
  monthlyData: MoodData[]
}> = ({ stats, monthlyData }) => {
  const { matchMoodColor } = useColors()

  return (
    <Card className="border-shadow border-primary bg-primary">
      <CardHeader>
        <CardTitle className="text-secondary">
          Mood common words used in the last 90 days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {monthlyData.length > 0 &&
            Object.entries(stats.mostCommonWords).map(([word, count]) => (
              <MoodWordCard
                key={word}
                word={word}
                count={count}
                color={matchMoodColor(word).colorFound}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Component for individual word cards
const MoodWordCard: React.FC<{
  word: string
  count: number
  color: string
}> = ({ word, count, color }) => (
  <div className="rounded-lg bg-muted p-4" style={{ background: color }}>
    <div className="text-2xl font-bold text-card-foreground">
      {count}x {word}
    </div>
  </div>
)
