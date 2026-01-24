'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useGetMeQuery } from '@/redux/features/auth/authApi'
import { IUser } from '@/redux/features/auth/authSlice'

/* =========================
   REQUIRED PROFILE FIELDS
========================= */
const REQUIRED_FIELDS: (keyof IUser)[] = [
  'name',
  'email',
  'phone',
  'address',
  'avatar',
]

/* =========================
   PROFILE COMPLETION LOGIC
========================= */
function calculateProfileCompletion(user: IUser | undefined) {
  if (!user) {
    return { percentage: 0, filled: 0, total: REQUIRED_FIELDS.length }
  }

  let filled = 0

  REQUIRED_FIELDS.forEach((field) => {
    const value = user[field]
    if (value !== null && value !== undefined && value !== '') {
      filled++
    }
  })

  const percentage = Math.round((filled / REQUIRED_FIELDS.length) * 100)

  return {
    percentage,
    filled,
    total: REQUIRED_FIELDS.length,
  }
}

export default function SettingsPage() {
  const { data, isLoading } = useGetMeQuery(undefined)

  const user: IUser | undefined = data

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  })

  /* =========================
     SET INITIAL DATA
  ========================= */
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        avatar: user.avatar ?? '',
      })
    }
  }, [user])

  const completion = useMemo(
    () => calculateProfileCompletion({ ...user, ...profile } as IUser),
    [user, profile],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // 🔥 এখানে API call দিবা (update profile)
    console.log('UPDATED PROFILE:', profile)
  }

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information
        </p>
      </div>

      {/* ================= PROFILE COMPLETION ================= */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Profile Completion</h3>
          <span className="text-sm font-medium">
            {completion.percentage}%
          </span>
        </div>

        <Progress value={completion.percentage} />

        <p className="text-xs text-muted-foreground">
          {completion.filled} of {completion.total} required fields completed
        </p>
      </Card>

      {/* ================= PROFILE FORM ================= */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">Personal Information</h3>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={profile.email}
              disabled
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Address</Label>
            <Input
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Avatar URL</Label>
            <Input
              name="avatar"
              value={profile.avatar}
              onChange={handleChange}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </Card>

      {/* ================= READ ONLY INFO ================= */}
      <Card className="p-6 space-y-3">
        <h3 className="text-lg font-semibold">Account Info</h3>

        <div className="text-sm space-y-1">
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
          <p>
            <strong>Status:</strong> {user?.status}
          </p>
          <p>
            <strong>Last Login:</strong>{' '}
            {user?.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : 'Never'}
          </p>
        </div>
      </Card>
    </div>
  )
}
