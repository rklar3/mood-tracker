'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_BACKGROUND } from '@/app/lib/constant'
import { useAuth } from '../context/authContext'
import { Button } from '@/components/ui/button'
import CenteredColumn from '../components/wrappers/centeredColumn'
import MoodMessage from '../components/wrappers/moodMessage'
import { Loader2 } from 'lucide-react'
import { notifyError, notifySuccess } from '../functions/toast'
import { updateColors } from '../services/updateColors'
import ColorCard from '../components/colors/colorCard'
import { useColors } from '../context/colorContext'
import Loading from '../components/loading'

const ColorPicker: React.FC = () => {
  const { user, loading } = useAuth()
  const { colors, setColors } = useColors()
  const [saving, setSaving] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    // Should create a protected page wrapper but just gonna leave this here
    if (!loading) {
      if (!user) {
        router.push('/auth/signin') // Redirect to sign-in page if not authenticated
      }
    }
  }, [user, loading, router])

  const saveColors = async () => {
    if (user) {
      try {
        setSaving(true)
        await updateColors(user.uid, colors)
        notifySuccess(
          'Action Successful',
          'Your changes have been saved successfully'
        )
      } catch (error) {
        notifyError(
          'Action Failed',
          'There was an issue processing your request. Please try again.'
        )
        console.log('Error saving colors to Firebase:', error)
      } finally {
        setSaving(false)
      }
    }
  }

  const SaveButton: React.FC = () => (
    <div className="ml-auto">
      {!saving ? (
        <Button className="mr-2 tracking-tight" onClick={saveColors}>
          Save Colors
        </Button>
      ) : (
        <Button
          disabled
          className="flex items-center justify-center hover:bg-primary-foreground/90"
        >
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving..
        </Button>
      )}
    </div>
  )

  // Should create a protected page wrapper but just gonna leave this here
  if (!user) {
    return <Loading />
  }

  return (
    <main
      className="mt-0 flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: DEFAULT_BACKGROUND }}
    >
      <CenteredColumn>
        <MoodMessage mainText="Manage moods and colors" />
      </CenteredColumn>
      <SaveButton />
      <div className="container mx-auto mb-20 mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.keys(colors).map((mood) => (
          <ColorCard
            key={mood}
            mood={mood}
            colors={colors}
            setColors={setColors}
          />
        ))}
      </div>
    </main>
  )
}

export default ColorPicker
