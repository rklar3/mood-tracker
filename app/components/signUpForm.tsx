// SignUpForm.tsx
'use client';
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { useAuth } from "../context/authContext";
import { auth, db } from "../lib/firebase";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function SignUpForm() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.name
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: data.name,
        email: data.email,
        // emailVerified: user.emailVerified,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      });

      setUser({
        uid: user.uid,
        displayName: data.name,
        email: data.email,
        // emailVerified: user.emailVerified,
        emailVerified: true
      });
      setIsAuthenticated(true);

      toast({
        title: "Account created successfully",
        description: "You can now use your new account.",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating user:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        {submitting ? (
          <Button disabled className="mt-6">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
          </Button>
        ) : (
          <Button type="submit" className="mt-6" variant={"default"}>
            Sign Up
          </Button>
        )}    
      </form>
    </Form>
  );
}
