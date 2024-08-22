'use client'

import React from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { findMoodStats } from '@/app/functions/analyzeMoodData'
import { matchMoodColor } from '@/app/functions/matchMoodColor'

// Updated MoodAreaChart component
const MoodAreaChart: React.FC<{
  stats: ReturnType<typeof findMoodStats>
}> = ({ stats }) => {
  // Extract percentages from stats
  const chartData = [
    { key: 'Positive', metric: stats.positiveMoodCount },
    { key: 'Negative', metric: stats.negativeMoodCount },
    { key: 'Neutral', metric: stats.neutralMoodCount },
  ]

  // set color to higher number between positive and negative mood count
  const getColor = () => {
    if (stats.positiveMoodCount >= stats.negativeMoodCount) {
      return `${matchMoodColor('mad').colorFound}`
    } else {
      return `${matchMoodColor('sad').colorFound}`
    }
  }

  const chartConfig = {
    metric: {
      label: 'metric',
      color: getColor(),
    },
    label: {
      color: `text-secondary`,
    },
  } satisfies ChartConfig

  return (
    <Card className="border-shadow border-primary bg-primary">
      <CardHeader>
        <CardTitle className="text-secondary">Entry Type</CardTitle>
      </CardHeader>
      <CardContent className="text-secondary">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="key"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="metric" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="metric"
              layout="vertical"
              fill="var(--color-metric)"
              radius={4}
            >
              <LabelList
                className="fill-muted"
                dataKey="key"
                position="insideLeft"
                offset={10}
                fontSize={14}
              />
              <LabelList
                dataKey="metric"
                position="right"
                offset={50}
                className="fill-secondary"
                fontSize={20}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MoodAreaChart
