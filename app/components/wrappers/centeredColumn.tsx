import React from 'react'

interface CenteredColumnProps {
  children: React.ReactNode
}

const CenteredColumn: React.FC<CenteredColumnProps> = ({ children }) => (
  <div className="flex flex-col items-center p-2 pt-2 text-center">
    {children}
  </div>
)

export default CenteredColumn
