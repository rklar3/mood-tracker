import React from 'react'
import { useAuth } from '../context/authContext'
import SignInButton from './signInButton'

const MoodPrompt: React.FC = () => {
  const { user, isAuthenticated } = useAuth()

  return (
    <>
      <h1 className="mt-40 scroll-m-10 text-4xl font-extrabold tracking-tight lg:text-3xl">
        How are you feeling today {user?.displayName}?
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        A way to track your emotions.
      </p>
      {!isAuthenticated && <SignInButton />}
    </>
  )
}

export default MoodPrompt
