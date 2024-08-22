import React from 'react'
import AuthCard from '@/app/components/auth/authCard'
import AuthRedirectLink from '@/app/components/auth/authRedirectLink'
import SignInForm from '@/app/components/auth/signInForm'

const SignIn: React.FC = () => {
  return (
    <AuthCard title="Sign Up">
      <SignInForm />
      <AuthRedirectLink
        text="Don't have an account? "
        linkText="Sign Up"
        href="/auth/signup"
      />
    </AuthCard>
  )
}

export default SignIn
