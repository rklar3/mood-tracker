import React from 'react'

interface MoodSubmissionMessageProps {
  mainText: string
  secondaryText?: string
  subText?: string
}

const MoodMessage: React.FC<MoodSubmissionMessageProps> = ({
  mainText,
  secondaryText,
  subText,
}) => (
  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
    {mainText}
    {secondaryText && <span className="text-secondary">{secondaryText}</span>}
    {subText}
  </h1>
)

export default MoodMessage
