import { collection, query, where, getDocs } from 'firebase/firestore'
import { startOfDay } from 'date-fns'
import { db } from '../lib/firebase'
import { MoodData } from '../lib/interfaces'

/**
 * Fetches the current mood from Firebase based on the authenticated user.
 * will update the state if document is found
 * @param user - The authenticated user object
 * @param setBackground - Function to set the background gradient state
 * @param setCurrentMood - Function to set the current mood.
 * @param setLoading - Function to set the loading state
 * @param setMoodId - Function to set the moodId state
 * @param setColor - Function to set the color state
 */
export const fetchMood = async (
  user: { uid: string } | null,
  setBackground: (gradient: string) => void,
  setCurrentMood: (currentMood: string) => void,
  setLoading: (loading: boolean) => void,
  setMoodId: (id: string) => void,
  setColor: (color: string) => void
) => {
  if (user) {
    // Set loading state to true while fetching data
    setLoading(true)
    try {
      const moodsRef = collection(db, 'moods')
      const today = startOfDay(new Date())

      const fbQuery = query(
        moodsRef,
        where('userId', '==', user.uid),
        where('timestamp', '>=', today)
      )

      const querySnapshot = await getDocs(fbQuery)

      if (!querySnapshot.empty) {
        const mood = querySnapshot.docs[0].data() as MoodData

        // Update the state with the fetched mood data
        setBackground(mood.gradient)
        setCurrentMood(mood.mood)
        setMoodId(mood.id)
        setColor(mood.color)
      }
    } catch (error) {
      console.log('Error fetching mood from Firebase:', error)
    } finally {
      setLoading(false)
    }
  }
}
