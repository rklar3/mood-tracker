'use client'

import React from 'react'
import { useAuth } from './context/authContext'
import { useTheme } from './context/themeContext'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'
import { matchMoodColor } from './functions/matchMoodColor'
import { useMood } from './hooks/useMood'
import { fetchMood } from './services/fetchTodayMood'
import { addMood, updateMood } from './services/updateMood'
import MoodCalendar from './components/moodCalendar'
import MoodMetrics from './components/moodMetrics'
import MainSection from './components/wrappers/mainWrapper'
import CenteredColumn from './components/wrappers/centeredColumn'
import MoodMessage from './components/wrappers/moodMessage'
import MoodPrompt from './components/moodTitle'
import {
  notifyMoodNotFound,
  notifySubmissionError,
  notifySuccessfulSubmission,
} from './functions/toast'
import Loading from './components/loading'
import MoodForm from './components/moodForm'

// Main page of application
// users can set, update mood and see dashboard
const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const { setBackground, background } = useTheme()

  // state to manage components
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState(true)
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false)

  // Mood state
  const {
    moodState,
    setPrompt,
    setCurrentMood,
    setPreviousMood,
    setMoodId,
    setColor,
    setSelectedDate,
  } = useMood()

  const handleMoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { gradientFound } = matchMoodColor(event.target.value)
    setPrompt(event.target.value)
    setBackground(gradientFound)
  }

  const handleMoodSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const { gradientFound, moodFound, colorFound } = matchMoodColor(
        moodState.prompt
      )
      const newId = uuidv4()

      if (!moodFound) {
        notifyMoodNotFound(moodState.prompt)
      } else {
        await addMood(
          user!.uid,
          newId,
          moodState.prompt,
          gradientFound,
          moodFound,
          colorFound,
          moodState.selectedDate ?? new Date()
        )

        notifySuccessfulSubmission()
        setBackground(gradientFound)
        setCurrentMood(moodFound)
        setMoodId(newId)
      }
    } catch (error) {
      notifySubmissionError()
      console.log('Error submitting mood to Firebase:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const matchedMood = matchMoodColor(moodState.prompt)

      if (!matchedMood.moodFound) {
        notifyMoodNotFound(moodState.prompt)
      }
      await updateMood(
        moodState.currentMoodId!,
        moodState.prompt,
        matchedMood.gradientFound,
        matchedMood.moodFound,
        matchedMood.colorFound,
        moodState.selectedDate ?? new Date()
      )

      notifySuccessfulSubmission()
      setCurrentMood(matchedMood.moodFound)
      setBackground(matchedMood.gradientFound)
    } catch {
      notifySubmissionError()
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCalendar = (): void => {
    setShowCalendar(!showCalendar)
  }

  React.useEffect(() => {
    fetchMood(
      user,
      setBackground,
      setCurrentMood,
      setLoading,
      setMoodId,
      setColor
    )
  }, [user, setBackground, setColor, setCurrentMood, setMoodId])

  const getMoodHeader = (): string =>
    moodState.previousMood ? 'On this day you felt ' : 'No mood recorded '

  const getMoodHeaderFound = (): boolean => !!moodState.previousMood

  const getMoodTitle = (): string =>
    moodState.previousMood || moodState.currentMood

  if (loading && isAuthenticated) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return (
      <MainSection background={background}>
        <CenteredColumn>
          <MoodPrompt />
        </CenteredColumn>
      </MainSection>
    )
  }

  return (
    <MainSection background={background}>
      {/* toggle calendar and dashboard buttons */}
      {moodState.currentMood && (
        <div className="ml-auto">
          <Button className="mr-2 tracking-tight" onClick={toggleCalendar}>
            {showCalendar ? 'View Dashboard' : 'View Calendar'}
          </Button>
        </div>
      )}

      {/* state to include metrics */}
      {!showCalendar && moodState.currentMood && (
        <CenteredColumn>
          <MoodMessage
            mainText="You submitted your mood as "
            secondaryText={moodState.currentMood}
          ></MoodMessage>
          <MoodMetrics />
        </CenteredColumn>
      )}

      {/* state to include calendar */}
      {showCalendar && (
        <CenteredColumn>
          <MoodMessage
            mainText={getMoodHeader()}
            secondaryText={getMoodHeaderFound() ? getMoodTitle() : ''}
          ></MoodMessage>
          <MoodCalendar
            date={moodState.selectedDate}
            setDate={setSelectedDate}
            setPrompt={setPrompt}
            setBackground={setBackground}
            setMoodId={setMoodId}
            setPreviousMood={setPreviousMood}
            setColor={setColor}
          />
        </CenteredColumn>
      )}

      {/* state where user can enter daily mood */}
      <CenteredColumn>
        {!moodState.currentMood && !showCalendar && <MoodPrompt />}
      </CenteredColumn>

      {/* state where user can enter / update moods */}
      {(!moodState.currentMood || showCalendar) && (
        <div className="flex-col items-center text-center">
          <MoodForm
            handleSubmit={(event) => {
              if (moodState.currentMoodId) {
                handleUpdateSubmit(event)
              } else {
                handleMoodSubmit(event)
              }
            }}
            handleMoodChange={handleMoodChange}
            submitting={submitting}
            initialPhrase={moodState.prompt}
          />
        </div>
      )}
    </MainSection>
  )
}

export default Home
