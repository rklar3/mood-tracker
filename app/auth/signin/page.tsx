import React from 'react'
import SignInForm from '@/app/components/signInForm'
import Link from 'next/link'

const SignIn: React.FC = () => {
  return (
    <main className="mt-24 flex min-w-full flex-col items-center justify-center px-4">
      <section className="my-3 flex w-full max-w-lg flex-col gap-y-6 border px-3 py-12 md:px-8 lg:px-8">
        <p>Sign In</p>
        <SignInForm />
        <AlreadyHaveAnAccount />
      </section>
    </main>
  )
}

export default SignIn

const AlreadyHaveAnAccount: React.FC = () => {
  return (
    <main>
      <p className="text-center text-gray-700 dark:text-gray-300">
        {"Don't have an account? "}
        <Link
          prefetch
          href={'/auth/signup'}
          className="font-normal text-blue-600"
        >
          Sign Up
        </Link>
      </p>
    </main>
  )
}
