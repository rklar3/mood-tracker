'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './context/authContext'
import { useTheme } from './context/themeContext'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './lib/firebase'
import Loading from './components/loading'
import { SignInButton } from './components/signInButton'
import { MoodForm } from './components/moodForm'
import { fetchMood } from './functions/fetchTodayMood'
import { matchMoodColor } from './functions/matchMoodColor'
import { v4 as uuidv4 } from 'uuid'
import { toast } from '@/components/ui/use-toast'
import { MoodMetrics } from './components/moodMetrics'
import { MoodCalendar } from './components/moodCalendar'
import { Button } from '@/components/ui/button'

export interface CurrentMood {
  phrase: string
  category: string
  color: string
  id?: string
}

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const { setBackground, background, isDarkMode } = useTheme()
  const [prompt, setPrompt] = useState('')
  const [currentMood, setCurrentMood] = useState('')
  const [previousMood, setPreviousMood] = useState('')

  const [currentMoodId, setCurrentMoodId] = useState<string | null>(null) // State for document ID
  const [submitting, SetSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false) // State to toggle editing mode
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showCalendar, SetShowCalendar] = useState<boolean>(false)
  const [color, setColor] = useState<string | null>(null)

  const handleMoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { gradientFound } = matchMoodColor(event.target.value)
    setPrompt(event.target.value)
    setBackground(gradientFound)
  }

  const handleMoodSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    SetSubmitting(true)
    try {
      const { gradientFound, moodFound, colorFound } = matchMoodColor(prompt)

      const newId = uuidv4()

      const moodDocRef = doc(db, 'moods', newId)

      if (!moodFound) {
        toast({
          title: 'Mood not found',
          description: `Please add a mood key word in ${prompt}`,
          variant: 'destructive',
        })
      } else {
        await setDoc(moodDocRef, {
          userId: user?.uid,
          prompt,
          gradient: gradientFound,
          mood: moodFound,
          color: colorFound,
          timestamp: selectedDate ?? new Date(),
          id: newId,
        })
      }

      setCurrentMood(moodFound)
      setBackground(gradientFound)
      setCurrentMoodId(newId)
      setPrompt(prompt)

      console.log('Mood submitted successfully')
    } catch (error) {
      console.error('Error submitting mood to Firebase:', error)
      setBackground('linear-gradient(270deg, #3498db, #e91e63, #9b59b6)')
    } finally {
      SetSubmitting(false)
    }
  }

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    SetSubmitting(true)
    try {
      const { gradientFound, moodFound, colorFound } = matchMoodColor(prompt)

      if (currentMoodId) {
        const moodDocRef = doc(db, 'moods', currentMoodId)

        if (!moodFound) {
          toast({
            title: 'Mood not found',
            description: `Please add a mood key word in ${prompt}`,
            variant: 'destructive',
          })
        } else {
          await updateDoc(moodDocRef, {
            prompt,
            gradient: gradientFound,
            mood: moodFound,
            color: colorFound,
            timestamp: selectedDate ?? new Date(),
          })
        }

        setCurrentMood(moodFound)
        setBackground(gradientFound)
        setPrompt(prompt)
      } else {
        console.log('No moodId found for update')
      }
    } catch (error) {
      console.log('Error updating mood in Firebase:', error)
      setBackground('linear-gradient(270deg, #3498db, #e91e63, #9b59b6)')
    } finally {
      SetSubmitting(false)
      setEditing(false)
    }
  }

  useEffect(() => {
    fetchMood(
      isAuthenticated,
      user,
      setBackground,
      setPrompt,
      setCurrentMood,
      setLoading,
      setCurrentMoodId,
      setColor
    )
  }, [isAuthenticated, user?.uid])

  useEffect(() => {}, [selectedDate])

  if (loading) {
    return <Loading />
  }

  return (
    <main
      className="flex min-h-screen flex-col p-2"
      style={{ background: background }}
    >
      {/* toggle between dashboard and calendar */}

      {isAuthenticated && currentMood && (
        <div className="mb-2 ml-auto">
          <Button
            className="mr-2 bg-primary tracking-tight"
            onClick={() => {
              SetShowCalendar(!showCalendar)
              if (showCalendar) {
                setEditing(true)
              }
            }}
          >
            {showCalendar ? 'View Dashboard' : 'View Calendar'}
          </Button>
        </div>
      )}

      {/* toggle between dashboard and calendar */}
      {isAuthenticated && !showCalendar && currentMood && (
        <>
          <div
            className="flex min-h-screen flex-col items-center p-2 pt-2"
            style={{ background: background }}
          >
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
              {`You submitted your mood as `}
              <span className={isDarkMode ? 'text-primary' : 'text-muted'}>
                {currentMood}
              </span>
              {` today`}
            </h1>
            <MoodMetrics />
          </div>
        </>
      )}

      {/* display calendar and prevous moods */}
      {isAuthenticated && showCalendar && (
        <div className="flex flex-col items-center p-2 pt-2">
          <h1 className="mb-10 scroll-m-10 text-4xl font-extrabold tracking-tight lg:text-3xl">
            {previousMood ? `On this day you felt ` : 'no record mood recorded'}
            <span className={isDarkMode ? 'text-primary' : 'text-muted'}>
              {previousMood}
            </span>
          </h1>
          <MoodCalendar
            date={selectedDate}
            setDate={setSelectedDate}
            setPrompt={setPrompt}
            setBackground={setBackground}
            setCurrentMoodId={setCurrentMoodId}
            setPreviousMood={setPreviousMood}
            setColor={setColor}
          />
        </div>
      )}

      {/* daily message if mood not set */}
      <div className="flex-col items-center text-center">
        {!currentMood && !editing && <MoodPrompt user={user} />}
        {!isAuthenticated && <SignInButton />}
      </div>

      {isAuthenticated && (!currentMood || showCalendar) && (
        <div className="flex-col items-center text-center">
          <MoodForm
            handleSubmit={(event) => {
              if (currentMoodId) {
                handleUpdateSubmit(event)
              } else {
                handleMoodSubmit(event)
              }
            }}
            handleMoodChange={handleMoodChange}
            submitting={submitting}
            initialPhrase={prompt}
          />
        </div>
      )}
    </main>
  )
}

// main title
const MoodPrompt = ({ user }: { user: any }) => (
  <>
    <h1 className="scroll-m-10 text-4xl font-extrabold tracking-tight lg:text-3xl">
      How are you feeling today {user?.displayName}?
    </h1>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
      A way to track your emotions.
    </p>
  </>
)
