'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useSignUpUserMutation } from '@/redux/features/auth/authApi'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/features/auth/authSlice'

export default function SignupPage() {
  const router = useRouter()
  const [signUpUser, { isLoading }] = useSignUpUserMutation()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
     const res= await signUpUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap()

      dispatch(setUser({user: res?.data?.user, accessToken: res?.data?.accessToken}))

      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      setError(err?.data?.message || 'Signup failed')
    }
  }

  if (success) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Account Created</h2>
        <p className="text-foreground/60">
          Redirecting to login...
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Join Alhamdulillah</h1>
        <p className="text-foreground/60">Create your account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Name" onChange={handleChange} />
        <Input name="email" placeholder="Email" onChange={handleChange} />
        <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <Button className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary font-medium">
          Sign in
        </Link>
      </p>
    </Card>
  )
}
