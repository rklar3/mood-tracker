import { collection, query, where, getDocs } from 'firebase/firestore'
import { startOfDay } from 'date-fns'
import { db } from '../lib/firebase'
import { Dispatch, SetStateAction } from 'react'

export interface CurrentMood {
  phrase: string
  category: string
  color: string
}
export const fetchMood = async (
  isAuthenticated: boolean,
  user: { uid: string } | null,
  setBackground: (arg0: string) => void,
  setPrompt: (arg0: any) => void,
  setCurrentMood: (arg0: any) => void,
  setLoading: (arg0: boolean) => void,
  setCurrentMoodId: Dispatch<SetStateAction<string | null>>,
  setColor: Dispatch<SetStateAction<string | null>>
) => {
  if (isAuthenticated && user) {
    setLoading(true)

    try {
      const moodsRef = collection(db, 'moods')
      const today = startOfDay(new Date())
      const fbQuery = query(
        moodsRef,
        where('userId', '==', user?.uid),
        where('timestamp', '>=', today)
      )
      const querySnapshot = await getDocs(fbQuery)

      if (!querySnapshot.empty) {
        const mood = querySnapshot.docs[0].data()

        setBackground(mood.gradient)
        setPrompt(mood.prompt)
        setCurrentMood(mood.mood)
        setCurrentMoodId(mood.id)
        setColor(mood.color)
      }
    } catch (error) {
      console.error('Error fetching mood from Firebase:', error)
    } finally {
      setLoading(false)
    }
  }
}
