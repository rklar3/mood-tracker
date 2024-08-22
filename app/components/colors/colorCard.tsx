'use client'

import { MoodMapping } from '@/app/lib/moodMap'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'
import React, { useState } from 'react'

// MoodCard Component
const ColorCard: React.FC<{
  mood: string
  colors: MoodMapping
  setColors: React.Dispatch<React.SetStateAction<MoodMapping>>
}> = ({ mood, colors, setColors }) => {
  const [newWord, setNewWord] = useState<string>('')

  // Handler function to update the gradient color at a specific index
  const handleColorChange = (mood: string, index: number, newColor: string) => {
    const updatedColors = { ...colors }
    // Extract current gradient colors
    const gradientParts =
      updatedColors[mood]?.gradient.match(/#[0-9A-Fa-f]{6}/g)
    if (gradientParts) {
      gradientParts[index] = newColor // Update the specific color
      updatedColors[mood].gradient =
        `linear-gradient(270deg, ${gradientParts.join(', ')})` // Recreate the gradient string
      setColors(updatedColors) // Update state with new colors
    }
  }

  // Handler function to update the main color for a mood
  const handleMainColorChange = (mood: string, newColor: string) => {
    const updatedColors = { ...colors }
    if (updatedColors[mood]) {
      updatedColors[mood].color = newColor // Update the main color
      setColors(updatedColors) // Update state with new colors
    }
  }

  // Handler function to update the score for a mood
  const handleScoreChange = (
    mood: string,
    newScore: 'positive' | 'neutral' | 'negative'
  ) => {
    const updatedColors = { ...colors }
    if (updatedColors[mood]) {
      updatedColors[mood].score = newScore // Update the score
      setColors(updatedColors) // Update state with new score
    }
  }

  // Handler function to add a new word to the mood's word list
  const handleAddWord = (mood: string, newWord: string) => {
    const updatedColors = { ...colors }
    if (updatedColors[mood]) {
      updatedColors[mood].words = [...updatedColors[mood].words, newWord] // Add new word to the list
      setColors(updatedColors)
    }
    setNewWord('') // Clear the input field after adding
  }

  // Handler function to remove a word from the mood's word list
  const handleRemoveWord = (mood: string, globalIndex: number) => {
    const updatedColors = { ...colors }
    if (updatedColors[mood]) {
      updatedColors[mood].words.splice(globalIndex, 1) // Remove word at the specified index
      setColors(updatedColors)
    }
  }

  return (
    <Card className="border-shadow rounded-md border-primary bg-primary p-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-secondary">
          {mood}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          style={{ background: colors[mood]?.gradient }}
          className="mb-3 h-6 w-full rounded-md"
        />
        <div className="mb-2">
          <p className="text-secondary">Gradient</p>
          <div className="mb-4 flex space-x-4">
            {colors[mood]?.gradient
              .match(/#[0-9A-Fa-f]{6}/g)
              ?.map((color: string, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) =>
                      handleColorChange(mood, index, e.target.value)
                    }
                    className="w-16"
                  />
                </div>
              ))}
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-secondary">Color</p>
            <Input
              type="color"
              value={colors[mood]?.color}
              onChange={(event) =>
                handleMainColorChange(mood, event.target.value)
              }
              className="w-16"
            />
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <p className="text-secondary">Score</p>
            <Select
              value={colors[mood]?.score}
              onValueChange={(value: 'positive' | 'neutral' | 'negative') =>
                handleScoreChange(mood, value)
              }
            >
              <SelectTrigger className="w-36 text-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-primary">
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-secondary">Words</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {colors[mood]?.words.map((word, index) => (
            <span
              key={index}
              className="flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800"
            >
              {word}
              <button
                onClick={() => handleRemoveWord(mood, index)}
                className="ml-2 text-red-500"
                aria-label="Remove word"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-secondary">
        <Input
          type="text"
          placeholder="Add new word"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && newWord.trim()) {
              handleAddWord(mood, newWord)
            }
          }}
          className="w-full text-secondary"
        />
      </CardFooter>
    </Card>
  )
}

export default ColorCard
