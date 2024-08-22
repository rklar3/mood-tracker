'use client'

import React from 'react'
import Link from 'next/link'
import { Toggle } from '@/components/ui/toggle'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useTheme } from '../context/themeContext'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useAuth } from '../context/authContext'
import { SettingsIcon, LogOutIcon } from 'lucide-react'
import { DEFAULT_BACKGROUND } from '../lib/constant'

const Navbar: React.FC = () => {
  const { theme, toggleTheme, background, setBackground } = useTheme()
  const { isAuthenticated, logout } = useAuth()

  return (
    <header
      className={`flex h-16 w-full items-center justify-between overflow-x-auto px-4 md:px-6`}
      style={{ background: background }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold text-primary"
      >
        <span>Mood Tracker</span>
      </Link>
      <div className="flex items-center gap-2">
        <Toggle
          onClick={() => toggleTheme()}
          className="rounded-full bg-primary bg-secondary p-2 transition-colors"
        >
          {theme === 'light' ? (
            <SunIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <MoonIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </Toggle>
        {/* if user is logged in allow them out log out */}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SettingsIcon className="h-5 w-5" />
                <span className="sr-only">Open settings menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-primary">
                <Link
                  href="/color"
                  className="text-m flex items-center gap-2 font-semibold"
                >
                  <span onClick={() => setBackground(DEFAULT_BACKGROUND)}>
                    Color Picker
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Link href="/auth/signin" className="flex items-center gap-2">
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

export default Navbar
