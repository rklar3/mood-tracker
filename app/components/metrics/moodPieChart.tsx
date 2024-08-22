'use client'

import React from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { findMoodStats } from '../../functions/analyzeMoodData'
import { MoodData } from '@/app/lib/interfaces'
import { useColors } from '@/app/context/colorContext'

interface PieChartProps {
  data: MoodData[]
}

const MoodPieChart: React.FC<PieChartProps> = ({ data }) => {
  const { colors } = useColors()
  const { moodEntries } = findMoodStats(data, colors)

  const chartData = Object.entries(moodEntries).map(([mood, moodData]) => ({
    mood,
    count: moodData.count,
    fill: moodData.color,
  }))

  const totalEntries = chartData.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <Card className="border-shadow border-primary bg-primary">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-secondary">Total Entries by Mood</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            mood: {
              label: 'Mood',
            },
            count: {
              label: 'Entries',
            },
          }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="mood"
              innerRadius={60}
              strokeWidth={10}
            >
              <Label
                className="text-secondary"
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-secondary text-3xl font-bold"
                        >
                          {totalEntries.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-secondary"
                        >
                          Total Entries
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MoodPieChart
