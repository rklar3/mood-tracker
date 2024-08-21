import { Button } from '@/components/ui/button' // Adjust the import according to your file structure
import Link from 'next/link'

export const SignInButton = () => {
  return (
    <Button className="mt-10 animate-bounce">
      <Link href="/auth/signin"> Sign In</Link>
    </Button>
  )
}

