'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { useLoginUserMutation } from '@/redux/features/auth/authApi'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/features/auth/authSlice'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const [loginUser, { isLoading }] = useLoginUserMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await loginUser({ email, password }).unwrap()
      console.log(res.data)

      dispatch(setUser({user: res?.data?.user, accessToken: res?.data?.accessToken}))

      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.data?.message || 'Login failed')
    }
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Alhamdulillah</h1>
        <p className="text-foreground/60">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm mt-6">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-primary font-medium">
          Sign up
        </Link>
      </p>
    </Card>
  )
}
