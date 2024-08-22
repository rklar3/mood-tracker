import React from 'react'

interface MainSectionProps {
  background: string
  children: React.ReactNode
}

const MainSection: React.FC<MainSectionProps> = ({ background, children }) => (
  <main className="flex min-h-screen flex-col p-2" style={{ background }}>
    {children}
  </main>
)

export default MainSection
