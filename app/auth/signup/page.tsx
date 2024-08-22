import React from 'react'
import AuthCard from '@/app/components/auth/authCard'
import AuthRedirectLink from '@/app/components/auth/authRedirectLink'
import SignUpForm from '@/app/components/auth/signUpForm'

const SignUp: React.FC = () => {
  return (
    <AuthCard title="Sign Up">
      <SignUpForm />
      <AuthRedirectLink
        text="Already have an account? "
        linkText="Sign In"
        href="/auth/signin"
      />
    </AuthCard>
  )
}

export default SignUp
