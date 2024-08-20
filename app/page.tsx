'use client'

import React from 'react'
import { useAuth } from './context/authContext'
import { useTheme } from './context/themeContext'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './lib/firebase'
import Loading from './components/loading'
import MoodForm from './components/moodForm'
import { fetchMood } from './functions/fetchTodayMood'
import { Button } from '@/components/ui/button'
import MoodPrompt from './components/moodTitle'
import {
  notifyMoodNotFound,
  notifySuccessfulSubmission,
  notifySubmissionError,
} from './functions/toast'
import { v4 as uuidv4 } from 'uuid'
import { matchMoodColor } from './functions/matchMoodColor'
import { useMood } from './hooks/useMood'
import { MoodMetrics } from './components/moodMetrics'
import MoodCalendar from './components/moodCalendar'

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const { setBackground, background, isDarkMode } = useTheme()

  // state to manage components
  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState(true)
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false)

  // Mood state
  const {
    getPrompt,
    getCurrentMood,
    getPreviousMood,
    getMoodId,
    getSelectedDate,
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
      const { gradientFound, moodFound, colorFound } =
        matchMoodColor(getPrompt())
      const newId = uuidv4()
      const moodDocRef = doc(db, 'moods', newId)

      if (!moodFound) {
        notifyMoodNotFound(getPrompt())
      } else {
        await setDoc(moodDocRef, {
          userId: user?.uid,
          prompt: getPrompt(),
          gradient: gradientFound,
          mood: moodFound,
          color: colorFound,
          timestamp: getSelectedDate() ?? new Date(),
          id: newId,
        })

        notifySuccessfulSubmission()
        setBackground(gradientFound)
        setCurrentMood(moodFound)
        setMoodId(newId)
        setPrompt(getPrompt())
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
      const { gradientFound, moodFound, colorFound } =
        matchMoodColor(getPrompt())

      if (getMoodId()) {
        const moodDocRef = doc(db, 'moods', getMoodId()!)

        if (!moodFound) {
          notifyMoodNotFound(getPrompt())
        } else {
          await updateDoc(moodDocRef, {
            prompt: getPrompt(),
            gradient: gradientFound,
            mood: moodFound,
            color: colorFound,
            timestamp: getSelectedDate() ?? new Date(),
          })

          notifySuccessfulSubmission()
          setCurrentMood(moodFound)
          setBackground(gradientFound)
          setPrompt(getPrompt())
        }
      } else {
        console.log('No moodId found for update')
      }
    } catch (error) {
      notifySubmissionError()
      console.log('Error updating mood in Firebase:', error)
      setBackground('linear-gradient(270deg, #3498db, #e91e63, #9b59b6)')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCalendar = (): void => {
    setShowCalendar(!showCalendar)
  }

  React.useEffect(() => {
    console.log('currentMood ', getCurrentMood())
  }, [getCurrentMood])

  React.useEffect(() => {
    fetchMood(
      isAuthenticated,
      user,
      setBackground,
      setPrompt,
      setCurrentMood,
      setLoading,
      setMoodId,
      setColor
    )
  }, [
    isAuthenticated,
    user,
    setBackground,
    setPrompt,
    setCurrentMood,
    setLoading,
    setMoodId,
    setColor,
  ])

  if (loading && isAuthenticated) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return (
      <main
        className="flex min-h-screen flex-col p-2"
        style={{ background: background }}
      >
        <div className="flex-col items-center text-center">
          <MoodPrompt />
        </div>
      </main>
    )
  }

  return (
    <main
      className="flex min-h-screen flex-col p-2"
      style={{ background: background }}
    >
      {/* toggle calendar and dashboard buttons */}
      {getCurrentMood() && (
        <div className="mb-2 ml-auto">
          <Button
            className="mr-2 bg-primary tracking-tight"
            onClick={toggleCalendar}
          >
            {showCalendar ? 'View Dashboard' : 'View Calendar'}
          </Button>
        </div>
      )}

      {/* state to include metrics */}
      {!showCalendar && getCurrentMood() && (
        <div
          className="flex min-h-screen flex-col items-center p-2 pt-2"
          style={{ background: background }}
        >
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
            {`You submitted your mood as `}
            <span className={isDarkMode ? 'text-primary' : 'text-muted'}>
              {getCurrentMood()}
            </span>
            {` today`}
          </h1>
          <MoodMetrics />
        </div>
      )}

      {/* state to include calendar */}
      {showCalendar && (
        <div className="flex flex-col items-center p-2 pt-2">
          <h1 className="mb-10 scroll-m-10 text-4xl font-extrabold tracking-tight lg:text-3xl">
            {(getCurrentMood() ?? getPreviousMood())
              ? `On this day you felt `
              : 'No mood recorded'}
            <span className={isDarkMode ? 'text-primary' : 'text-muted'}>
              {getPreviousMood() ?? getCurrentMood()}
            </span>
          </h1>
          <MoodCalendar
            date={getSelectedDate()}
            setDate={setSelectedDate}
            setPrompt={setPrompt}
            setBackground={setBackground}
            setMoodId={setMoodId}
            setPreviousMood={setPreviousMood}
            setColor={setColor}
          />
        </div>
      )}

      {/* state where user can enter daily mood */}
      <div className="flex-col items-center text-center">
        {!getCurrentMood() && !showCalendar && <MoodPrompt />}
      </div>

      {/* state where user can enter / update moods */}
      {(!getCurrentMood() || showCalendar) && (
        <div className="flex-col items-center text-center">
          <MoodForm
            handleSubmit={(event) => {
              if (getMoodId()) {
                handleUpdateSubmit(event)
              } else {
                handleMoodSubmit(event)
              }
            }}
            handleMoodChange={handleMoodChange}
            submitting={submitting}
            initialPhrase={getPrompt()}
          />
        </div>
      )}
    </main>
  )
}

export default Home
