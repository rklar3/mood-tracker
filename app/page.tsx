'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-2"
      style={gradientStyle}
    >
      <div className="mb-8 text-center">

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      How are you feeling today?
      </h1>

     
        <p className="leading-7 [&:not(:first-child)]:mt-6">
        a way to track your emotions.
      </p>
        <Button className="mt-10 animate-bounce">
          <Link prefetch href={'/auth/signin'}>
            Sign In
          </Link>
        </Button>
      </div>

    </main>
  )
}

const gradientStyle = {
  background: 'linear-gradient(270deg, #3498db, #e91e63, #9b59b6, #3498db)',
  backgroundSize: '300% 300%',
  animation: 'gradientMove 10s ease infinite',
}
