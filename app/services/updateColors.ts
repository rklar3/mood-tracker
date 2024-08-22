import {
  doc,
  collection,
  setDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { MoodMapping } from '../lib/moodMap'

/**
 * Updates the user's colors document in Firebase Firestore.
 * @param userId - The ID of the user.
 * @param colors - The colors data to be updated.
 */
export const updateColors = async (userId: string, colors: MoodMapping) => {
  const userColorsDocRef = doc(collection(db, 'colors'), userId)
  await setDoc(
    userColorsDocRef,
    {
      userId,
      moods: colors, // Save the updated colors under the 'moods' key
    },
    { merge: true }
  ) // Merge to update only specific fields
}

/**
 * Adds or updates color data for a specific user in Firebase.
 * @param userId - The ID of the user for whom colors are being added.
 * @param colors - The color data to be added.
 */
export const addColor = async (userId: string, colors: MoodMapping) => {
  try {
    const userColorsDocRef = doc(collection(db, 'colors'), userId)
    await setDoc(
      userColorsDocRef,
      {
        userId: userId,
        moods: colors,
      },
      { merge: true }
    )
  } catch (error) {
    console.error('Error saving colors to Firebase:', error)
  }
}

/**
 * Fetches color data for a specific user from Firebase.
 * @param userId - The ID of the user whose color data is being fetched.
 * @returns The color data if found, otherwise null.
 */
export const fetchColors = async (userId: string) => {
  try {
    const colorsRef = collection(db, 'colors')
    const fbQuery = query(colorsRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(fbQuery)

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data()
      return data.moods || {}
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching colors from Firebase:', error)
    throw new Error('Error fetching colors')
  }
}
