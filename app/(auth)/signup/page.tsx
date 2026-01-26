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
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
      }).unwrap()

      dispatch(setUser({user: res?.data?.user, accessToken: res?.data?.accessToken}))

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err: any) {
      setError(err?.data?.message || 'Application failed')
    }
  }

  if (success) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
        <p className="text-foreground/60 mb-4">
          Your membership account has been created.
        </p>
        <p className="text-sm text-foreground/50">
          Redirecting to your dashboard...
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Membership Application</h1>
        <p className="text-foreground/60">
          Join the Alhamdulillah Foundation community.
        </p>
        <div className="mt-4 p-3 bg-primary/5 rounded-lg text-xs text-left space-y-1 border border-primary/10">
           <p className="font-semibold text-primary">📝 Process:</p>
           <p>1. Fill out this application form.</p>
           <p>2. Activate your membership by paying the monthly due.</p>
           <p>3. Gain access to exclusive projects and voting rights.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input name="name" placeholder="John Doe" onChange={handleChange} required />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input name="email" type="email" placeholder="john@example.com" onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input name="phone" placeholder="+880 1XXX..." onChange={handleChange} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Present Address</Label>
          <Input name="address" placeholder="House, Road, Area, City" onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Password</Label>
            <Input name="password" type="password" placeholder="******" onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="******"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <Button className="w-full h-11 text-base mt-2" disabled={isLoading}>
          {isLoading ? 'Submitting Application...' : 'Submit Application'}
        </Button>
      </form>

      <p className="text-center text-sm mt-6">
        Already a member?{' '}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Log in here
        </Link>
      </p>
    </Card>
  )
}
