// components/AuthRedirectLink.tsx

import React from 'react'
import Link from 'next/link' // Ensure you're importing Link from Next.js

interface AuthRedirectLinkProps {
  text: string
  linkText: string
  href: string
}

const AuthRedirectLink: React.FC<AuthRedirectLinkProps> = ({
  text,
  linkText,
  href,
}) => {
  return (
    <p className="text-center text-gray-700 dark:text-gray-300">
      {text}
      <Link prefetch href={href} className="font-normal text-blue-600">
        {linkText}
      </Link>
    </p>
  )
}

export default AuthRedirectLink
