"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from './context/authContext';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTheme } from './context/themeContext';
import React, { useState } from 'react';
import { moodMapping } from './lib/moodMap';





const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { setBackground, background } = useTheme();
  const [moodPhrase, setMoodPhrase] = useState('');
  const [moodCategory, setMoodCategory] = useState<string>('');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleMoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const moodPhrase = event.target.value.trim().toLowerCase();
    let gradient = 'linear-gradient(270deg, #3498db, #e91e63, #9b59b6)'; // Default gradient
    let matched = false;
  
    for (const [category, { words, color }] of Object.entries(moodMapping)) {
      if (words.map(word => word.toLowerCase()).includes(moodPhrase)) {
        gradient = color;
        matched = true;
        break;
      }
    }
  
    if (!matched) {
      // Handle case where no category matches
      console.log('No matching mood category found.');
    }
  
    setBackground(gradient);
    setMoodPhrase(moodPhrase); // Update the state with the input value
    setMoodCategory(moodCategory); // Update the state with the detected mood category
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Mood Phrase:', moodPhrase);
    console.log('Mood Category:', moodCategory);
    console.log('Background Gradient:', background);
  
    try {

    } catch (error) {
      console.error("Error fetching mood and colors from API:", error);
      // Fallback gradient in case of an error
      setBackground('linear-gradient(270deg, #3498db, #e91e63, #9b59b6)');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2" style={{ background: background }}>
      <div className="mb-8 text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          How are you feeling today {user?.displayName}?
        </h1>
        {isAuthenticated && (
          <form className="flex gap-4 mt-10" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="I feel happy today"
              className="max-w-lg flex-1"
              onChange={handleMoodChange}
              value={moodPhrase} // Controlled input
            />
            <Button type="submit" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Submit
            </Button>
          </form>
        )}
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          A way to track your emotions.
        </p>
        {!isAuthenticated && (
          <Button className="mt-10 animate-bounce">
            <Link prefetch href={'/auth/signin'}>
              Sign In
            </Link>
          </Button>
        )}
      </div>
    </main>
  );
}
