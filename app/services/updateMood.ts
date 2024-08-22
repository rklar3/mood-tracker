import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export const updateMood = async (
  moodId: string,
  prompt: string,
  gradientFound: string,
  moodFound: string,
  colorFound: string,
  timestamp: Date
) => {
  const moodDocRef = doc(db, 'moods', moodId)

  await updateDoc(moodDocRef, {
    prompt,
    gradient: gradientFound,
    mood: moodFound,
    color: colorFound,
    timestamp,
  })
}

export const addMood = async (
  userId: string,
  moodId: string,
  prompt: string,
  gradientFound: string,
  moodFound: string,
  colorFound: string,
  timestamp: Date
) => {
  const moodDocRef = doc(db, 'moods', moodId)

  await setDoc(moodDocRef, {
    userId,
    prompt: prompt,
    gradient: gradientFound,
    mood: moodFound,
    color: colorFound,
    timestamp: timestamp,
    id: moodId,
  })
}
