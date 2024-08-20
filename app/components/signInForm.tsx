'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/authContext'
import { auth } from '../lib/firebase'

// Define schema for form validation
const FormSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
})

// Define the shape of form data
type FormData = z.infer<typeof FormSchema>

const SignInForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { setUser, setIsAuthenticated } = useAuth()

  // Initialize the form with validation schema
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSubmitting(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      const user = userCredential.user

      // Check if the email is verified
      if (!user.emailVerified) {
        toast({
          title: 'Email not verified',
          description: 'Please verify your email before logging in.',
          variant: 'destructive',
        })
        setSubmitting(false)
        return
      }

      // Update authentication context
      setUser({
        uid: user.uid,
        displayName: user.displayName ?? '',
        email: user.email ?? '',
        emailVerified: true,
      })
      setIsAuthenticated(true)

      toast({
        title: 'Logged in successfully',
        description: 'Welcome back!',
      })

      // Redirect to home page or another route
      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      })
      console.error('Error logging in:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-6"
          // variant={submitting ? 'default' : 'primary'}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
            </>
          ) : (
            'Log In'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm
