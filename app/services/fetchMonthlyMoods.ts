import { useCallback } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { subDays, startOfDay } from 'date-fns'
import { db } from '../lib/firebase'
import { MoodData } from '../lib/interfaces'

interface UseFetchMonthlyMoodsProps {
  user: { uid: string } | null
  setMonthlyData: React.Dispatch<React.SetStateAction<MoodData[]>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Fetches moods entries in the last 30 days
 * @param user - The authenticated user object containing the user's UID
 * @param setMonthlyData - Function to set the MonthlyData state
 * @param setLoading - Function to set the loading state
 *
 * Probably not the best place to pass setState functions
 * but will just leave here for now
 */
export const useFetchMonthlyMoods = ({
  user,
  setMonthlyData,
  setLoading,
}: UseFetchMonthlyMoodsProps) => {
  const fetchMonthlyMoods = useCallback(async () => {
    if (!user?.uid) return

    setLoading(true)
    try {
      const now = new Date()
      const startOfPeriod = startOfDay(subDays(now, 30))
      const endOfPeriod = startOfDay(now)

      const moodsRef = collection(db, 'moods')
      const firebaseQuery = query(
        moodsRef,
        where('userId', '==', user.uid),
        where('timestamp', '>=', startOfPeriod),
        where('timestamp', '<=', endOfPeriod)
      )
      const querySnapshot = await getDocs(firebaseQuery)

      const moodData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as MoodData[]

      setMonthlyData(moodData)
    } catch (error) {
      console.error('Error fetching monthly moods from Firebase:', error)
    } finally {
      setLoading(false)
    }
  }, [user, setMonthlyData, setLoading])

  return { fetchMonthlyMoods }
}
