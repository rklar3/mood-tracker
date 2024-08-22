import React from 'react'
import { TailwindSpinner } from '../lib/icons'

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-y-3">
      <TailwindSpinner />
      <h3 className="text-2xl font-medium">Loading...</h3>
    </main>
  )
}
