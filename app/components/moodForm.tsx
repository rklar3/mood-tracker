'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

// Define the props for the MoodForm component
interface MoodFormProps {
  handleSubmit: (event: React.FormEvent) => void
  handleMoodChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  submitting: boolean
  initialPhrase?: string
}

// MoodForm functional component
const MoodForm: React.FC<MoodFormProps> = ({
  handleSubmit,
  handleMoodChange,
  submitting,
  initialPhrase = 'I feel happy today',
}) => {
  // State to manage the input value
  const [inputValue, setInputValue] = useState(initialPhrase)

  /**
   * Handles input change and updates local state and parent component.
   * @param event - The change event from the input field.
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    handleMoodChange(event)
  }

  return (
    <form
      className="mt-10 flex flex-col items-center gap-4 text-center"
      onSubmit={handleSubmit}
    >
      {!submitting ? (
        <>
          <Input
            type="text"
            placeholder={initialPhrase}
            className="max-w-lg flex-1"
            onChange={handleInputChange}
            value={inputValue}
          />
          <Button
            type="submit"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            variant="default"
          >
            Save
          </Button>
        </>
      ) : (
        <Button
          disabled
          className="flex items-center justify-center bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
        </Button>
      )}
    </form>
  )
}

export default MoodForm
