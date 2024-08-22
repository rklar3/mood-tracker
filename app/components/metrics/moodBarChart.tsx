'use client'

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { findMoodStats } from '@/app/functions/analyzeMoodData'
import { MoodData } from '@/app/lib/interfaces'
import { useColors } from '@/app/context/colorContext'

interface MoodBarChartProps {
  data: MoodData[]
}

const MoodBarChart: React.FC<MoodBarChartProps> = ({ data = [] }) => {
  // Compute mood statistics from the data
  const { colors } = useColors()

  const { moodByDayOfWeek } = findMoodStats(data, colors)
  const { matchMoodColor } = useColors()

  // Transform the moodByDayOfWeek data to the format required by BarChart
  const chartData = Object.keys(moodByDayOfWeek).map((dayOfWeek) => {
    const dayData = moodByDayOfWeek[dayOfWeek]

    // Calculate the total count for the day
    const totalMoodCount = Object.values(dayData).reduce(
      (sum, moodData) => sum + moodData.count,
      0
    )

    return {
      dayOfWeek,
      count: totalMoodCount,
    }
  })

  const chartConfig = {
    desktop: {
      label: 'dayOfWeek',
      color: 'red',
    },
    mobile: {
      label: 'dayOfWeek',
      color: 'red',
    },
  } satisfies ChartConfig

  return (
    <Card className="border-shadow border-primary bg-primary">
      <CardHeader>
        <CardTitle className="text-secondary">Entries By Week Day</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={chartData} className="h-full w-full">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dayOfWeek"
              tickLine={false}
              tickMargin={1}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="count"
              radius={4}
              fill={`${matchMoodColor('sad').colorFound}`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MoodBarChart
