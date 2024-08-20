import { collection, query, where, getDocs } from 'firebase/firestore'
import { startOfDay } from 'date-fns'
import { db } from '../lib/firebase'

interface CurrentMood {
  gradient: string
  color: string
  prompt: string
  mood: string
  id: string
}

/**
 * Fetches the current mood from Firebase based on the authenticated user.
 * Will update the state if document is found
 * @param isAuthenticated - Indicates if the user is authenticated.
 * @param user - The authenticated user object containing the user's UID.
 * @param setBackground - Function to set the background gradient based on the mood.
 * @param setPrompt - Function to set the prompt for the current mood.
 * @param setCurrentMood - Function to set the current mood.
 * @param setLoading - Function to set the loading state.
 * @param setMoodId - Function to set the ID of the current mood.
 * @param setColor - Function to set the color associated with the current mood.
 */
export const fetchMood = async (
  isAuthenticated: boolean,
  user: { uid: string } | null,
  setBackground: (gradient: string) => void,
  setPrompt: (prompt: string) => void,
  setCurrentMood: (currentMood: string) => void,
  setLoading: (loading: boolean) => void,
  setMoodId: (id: string) => void,
  setColor: (color: string) => void
) => {
  if (isAuthenticated && user) {
    // Set loading state to true while fetching data
    setLoading(true)
    try {
      // Reference to the 'moods' collection in Firestore
      const moodsRef = collection(db, 'moods')
      // Get the start of the current day
      const today = startOfDay(new Date())

      // Create a query to fetch moods for the authenticated user from today onwards
      const fbQuery = query(
        moodsRef,
        where('userId', '==', user.uid),
        where('timestamp', '>=', today)
      )

      // Execute the query
      const querySnapshot = await getDocs(fbQuery)

      if (!querySnapshot.empty) {
        // Get the first document from the query results
        const mood = querySnapshot.docs[0].data() as CurrentMood

        // Update the state with the fetched mood data
        setBackground(mood.gradient)
        setPrompt(mood.prompt)
        setCurrentMood(mood.mood) // Assuming 'mood.phrase' is the correct field
        setMoodId(mood.id) // Assuming 'mood.id' is the correct field
        setColor(mood.color)
      }
    } catch (error) {
      console.log('Error fetching mood from Firebase:', error)
    } finally {
      // Set loading state to false once data is fetched or if an error occurs
      setLoading(false)
    }
  }
}
