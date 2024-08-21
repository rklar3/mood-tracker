import { toast } from '@/components/ui/use-toast'
import { startOfDay } from 'date-fns'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export const handleMoodSubmit = async (
  event: React.FormEvent,
  user: { uid: unknown },
  setMoodCategory: (arg0: { phrase: any; category: any; color: any }) => void,
  background: any
) => {
  event.preventDefault()

  try {
    const moodsRef = collection(db, 'moods')
    const today = startOfDay(new Date())
    const q = query(
      moodsRef,
      where('userId', '==', user?.uid),
      where('timestamp', '>=', today)
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const existingMood = querySnapshot.docs[0].data()
      console.log('Existing Mood:', existingMood)

      setMoodCategory({
        phrase: existingMood.moodPhrase,
        category: existingMood.moodCategory,
        color: existingMood.backgroundGradient,
      })

      toast({
        title: 'Error',
        description: `You've already submitted your mood today: ${existingMood.moodCategory}`,
        variant: 'destructive',
      })

      return
    }

    await addDoc(collection(db, 'moods'), {
      userId: user?.uid,
      moodPhrase: event.target,
      moodCategory: event.target,
      backgroundGradient: background,
      timestamp: new Date(),
    })

    console.log('Mood submitted successfully')
  } catch (error) {
    console.error('Error submitting mood to Firebase:', error)
  }
}
