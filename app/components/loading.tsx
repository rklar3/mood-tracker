import React from 'react'
import { DEFAULT_BACKGROUND } from '../lib/utils'
import { TailwindSpinner } from '../lib/icons'

export default function Loading() {
  return (
    <main
      className="flex max-h-[89vh] min-h-[89vh] min-w-full flex-col items-center justify-center gap-y-3"
      style={{
        background: DEFAULT_BACKGROUND,
      }}
    >
      <TailwindSpinner />
      <h3 className="text-2xl font-medium">Loading...</h3>
    </main>
  )
}
