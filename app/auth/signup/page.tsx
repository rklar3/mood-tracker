import React from 'react'
import SignUpForm from '@/app/components/signUpForm'
import Link from 'next/link'

const SignUp: React.FC = () => {
  return (
    <main className="mt-24 flex min-w-full flex-col items-center justify-center px-4">
      <section className="my-3 flex w-full max-w-lg flex-col gap-y-6 border px-3 py-12 md:px-8 lg:px-8">
        <p>Sign Up</p>
        <SignUpForm />
        <AlreadyHaveAnAccount />
      </section>
    </main>
  )
}

export default SignUp

const AlreadyHaveAnAccount: React.FC = () => {
  return (
    <main>
      <p className="text-center text-gray-700 dark:text-gray-300">
        Already have an account?{' '}
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
