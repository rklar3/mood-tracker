// components/CenteredLayout.tsx

import React, { ReactNode } from 'react'

interface CenteredLayoutProps {
  children: ReactNode
  title: string
  background?: string
  className?: string
}

const AuthCard: React.FC<CenteredLayoutProps> = ({
  children,
  title,
  background = 'DEFAULT_BACKGROUND', // Default background
  className = '',
}) => {
  return (
    <main
      className={`mt-0 flex min-h-screen flex-col items-center justify-center px-4 ${className}`}
      style={{ background }}
    >
      <div className="my-3 flex w-full max-w-lg flex-col items-center justify-center gap-y-6 bg-primary px-3 py-12 shadow-lg md:px-8 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary lg:text-3xl">
          {title}
        </h1>
        {children}
      </div>
    </main>
  )
}

export default AuthCard
