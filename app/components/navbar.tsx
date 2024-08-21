// components/Navbar.tsx

'use client'

import Link from 'next/link'
import { Toggle } from '@/components/ui/toggle'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useTheme } from '../context/themeContext'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useAuth } from '../context/authContext'
import { JSX, SVGProps, useEffect } from 'react'

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, background, setBackground } = useTheme()
  const { isAuthenticated, logout } = useAuth()

  // Example gradient update
  useEffect(() => {
    setBackground('linear-gradient(270deg, #3498db, #e91e63, #9b59b6, #3498db)')
  }, [setBackground])

  return (
    <header
      className={`flex h-16 w-full items-center justify-between bg-background px-4 md:px-6`}
      style={{ background: background }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold"
        prefetch={false}
      >
        <span>Mood Tracker</span>
      </Link>
      <div className="flex items-center gap-2">
        <Toggle
          onClick={() => toggleDarkMode()}
          aria-label="Toggle dark mode"
          className={`rounded-full bg-primary bg-secondary p-2 transition-colors`}
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <MoonIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </Toggle>
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SettingsIcon className="h-5 w-5" />
                <span className="sr-only">Open settings menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  prefetch={false}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span onClick={() => logout()}>Logout</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

function LogOutIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
