import { toast } from '@/components/ui/use-toast'

/**
 * Displays a toast notification for a successful mood submission.
 */
export const notifySuccessfulSubmission = (): void => {
  toast({
    title: 'Success',
    description: 'Your mood has been submitted successfully.',
    variant: 'default',
  })
}

/**
 * Displays a toast notification for a mood submission error.
 */
export const notifySubmissionError = (): void => {
  toast({
    title: 'Error',
    description: 'There was an error submitting your mood. Please try again.',
    variant: 'destructive',
  })
}

/**
 * Displays a toast notification for a mood not found error.
 */
export const notifyMoodNotFound = (prompt: string): void => {
  toast({
    title: 'Mood not found',
    description: `Please add a mood key word in ${prompt}`,
    variant: 'destructive',
  })
}

/**
 * Displays a toast notification for a successful action.
 * @param title - The title of the notification.
 * @param description - The description of the notification.
 */
export const notifySuccess = (title: string, description: string): void => {
  toast({
    title,
    description,
    variant: 'default',
  })
}

/**
 * Displays a toast notification for an error.
 * @param title - The title of the notification.
 * @param description - The description of the notification.
 */
export const notifyError = (title: string, description: string): void => {
  toast({
    title,
    description,
    variant: 'destructive',
  })
}
