import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the current date in YYYY-MM-DD format.
 * @returns {string} The current date.
 */
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0]
}

/**
 * Formats a given date to YYYY-MM-DD format if it's valid.
 * @param {string} dateStr - The date string to format.
 * @returns {string} The formatted date or an empty string if the date is invalid.
 */
export const formatDate = (dateStr: Date | undefined) => {
  if (dateStr) {
    const parsedDate = new Date(dateStr)
    // Check if the parsed date is valid
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split('T')[0] // Converts to YYYY-MM-DD format
    }
  }
  return '' // Return an empty string if the date is invalid
}
