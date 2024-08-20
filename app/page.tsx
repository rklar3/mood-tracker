'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './context/authContext'
import { useTheme } from './context/themeContext'
import { addDoc, collection } from 'firebase/firestore'
import { db } from './lib/firebase'
import Loading from './components/loading'
import { SignInButton } from './components/signInButton'
import { MoodForm } from './components/moodForm'
import { fetchMood } from './functions/fetchTodayMood'
import { matchMoodColor } from './functions/matchMoodColor'

export interface CurrentMood {
  phrase: string
  category: string
  color: string
}

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { setBackground, background, isDarkMode } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [currentMood, setCurrentMood] = useState('');
  const [submitting, SetSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState(true)


  const handleMoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { gradientFound} = matchMoodColor(event.target.value);
    setPrompt(event.target.value);
    setBackground(gradientFound);
  }

  const handleMoodSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    SetSubmitting(true);
    try {
      const { gradientFound, moodFound, colorFound} = matchMoodColor(prompt);

      console.log(prompt);
      console.log(gradientFound);
      console.log(moodFound);
      console.log(colorFound);

      await addDoc(collection(db, 'moods'), {
        userId: user?.uid,
        prompt,
        gradient: gradientFound,
        mood: moodFound,
        color: colorFound,
        timestamp: new Date(),
      })

      setCurrentMood(moodFound);
      setBackground(gradientFound);

      console.log('Mood submitted successfully')
    } catch (error) {
      console.error('Error submitting mood to Firebase:', error)
      setBackground('linear-gradient(270deg, #3498db, #e91e63, #9b59b6)')
    }finally{
      SetSubmitting(false);
    }
  }

  useEffect(() => {
    fetchMood(isAuthenticated, user, setBackground, setPrompt, setCurrentMood, setLoading)
  }, [isAuthenticated, user?.uid])

  if (loading) {
    return <Loading />
  }


  if (currentMood  && isAuthenticated) {
    return <>
     <main
      className="flex min-h-screen flex-col items-center pt-20 p-2"
      style={{ background: background }}
    >
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
      {`You submited your mood as `}
      <span className={isDarkMode ? 'text-primary' : 'text-muted'}>{ prompt }</span>
        {` today`}
    </h1>
    </main>
    </>
    
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-2"
      style={{ background: background }}
    >
      <div className="text-center items-center">
        {!currentMood && <MoodPrompt user={user} />}
        {!isAuthenticated && <SignInButton />}
      </div>
      {isAuthenticated && !currentMood && (
          <MoodForm
            handleSubmit={handleMoodSubmit}
            handleMoodChange={handleMoodChange}
            submitting={submitting}
          />
        )}
    </main>
  )
}


// main title
const MoodPrompt = ({ user }: { user: any }) => (
  <>
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      How are you feeling today {user?.displayName}?
    </h1>
    <p className="leading-7 [&:not(:first-child)]:mt-6">
      A way to track your emotions.
    </p>
  </>
)




