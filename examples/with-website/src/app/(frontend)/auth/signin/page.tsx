'use client'

import React from 'react'
import { signin } from 'payload-auth-plugin/client'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const signinFormSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string(),
})

const Page = () => {
  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { oauth, password } = signin({ name: 'app' })

  const handleGoogleSignin = async () => {
    await oauth('google')
  }
  const handleTwitchSignin = async () => {
    await oauth('twitch')
  }

  const handleSignin = async (value: z.infer<typeof signinFormSchema>) => {
    const res = await password({ email: value.email, password: value.password })
    if (res.isError) {
      toast.error(res.message)
    }
  }
  return (
    <div className="w-full min-h-screen h-full px-16 py-28">
      <div className="space-y-8 w-full max-w-[440px] mx-auto border border-white/40 rounded-xl overflow-hidden p-6">
        <div className="flex items-center justify-center pt-5">
          <h4 className="text-xl font-medium">Sign In</h4>
        </div>
        <div className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignin)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                      <Input placeholder="Enter your password" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
          <div className="flex items-center justify-end pt-4">
            <a href="/auth/forgot-password">Forgot Password?</a>
          </div>
        </div>
        <div className="w-full">
          <p className="text-md w-full text-center">OR</p>
        </div>
        <div className="space-y-4">
          <Button type="button" onClick={handleGoogleSignin} className="w-full">
            Continue with Google
          </Button>
          <Button type="button" onClick={handleTwitchSignin} className="w-full">
            Continue with Twitch
          </Button>
        </div>
        <div className="flex items-center justify-center pt-5">
          <a href="/auth/signup">Create Account</a>
        </div>
      </div>
    </div>
  )
}

export default Page
