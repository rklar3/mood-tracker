import React from 'react'
import SignUpForm from '@/app/components/signUpForm'
import Link from 'next/link'
import { DEFAULT_BACKGROUND } from '@/app/lib/utils'

const SignUp: React.FC = () => {
  return (
    <main
      className="mt-0 flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: DEFAULT_BACKGROUND }}
    >
      <div className="my-3 flex w-full max-w-lg flex-col items-center justify-center gap-y-6 border bg-secondary px-3 py-12 shadow-lg md:px-8 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-3xl">
          Sign Up
        </h1>
        <SignUpForm />
        <AlreadyHaveAnAccount />
      </div>
    </main>
  )
}

export default SignUp

const AlreadyHaveAnAccount: React.FC = () => {
  return (
    <main>
      <p className="text-center text-gray-700 dark:text-gray-300">
        {' Already have an account? '}
        <Link
          prefetch
          href={'/auth/signin'}
          className="font-normal text-blue-600"
        >
          Login
        </Link>
      </p>
    </main>
  )
}
