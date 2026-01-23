'use client'

import React from "react"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+880 1234567890',
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const [notification, setNotification] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  const saveProfile = () => {
    setSaveMessage('Profile updated successfully!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const changePassword = () => {
    if (passwords.new !== passwords.confirm) {
      setNotification('Passwords do not match!')
      return
    }
    setSaveMessage('Password changed successfully!')
    setPasswords({ current: '', new: '', confirm: '' })
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/60 mt-1">Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex gap-3 items-center">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
          <p className="text-sm text-primary">{saveMessage}</p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="mt-1.5"
                />
              </div>

              <Button onClick={saveProfile} className="w-full">
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h3>
            <p className="text-foreground/60 text-sm mb-4">
              Deleting your account is permanent and cannot be undone.
            </p>
            <Button variant="outline" className="border-destructive text-destructive hover:text-destructive bg-transparent">
              Delete Account
            </Button>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Change Password</h3>

            <div className="space-y-6">
              <div>
                <Label htmlFor="current" className="text-sm">Current Password</Label>
                <Input
                  id="current"
                  name="current"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="new" className="text-sm">New Password</Label>
                <Input
                  id="new"
                  name="new"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="confirm" className="text-sm">Confirm Password</Label>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="mt-1.5"
                />
              </div>

              {notification && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{notification}</p>
                </div>
              )}

              <Button onClick={changePassword} className="w-full">
                Change Password
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Login Sessions</h3>
            <div className="space-y-3">
              {[
                { device: 'Chrome on Windows', location: 'Dhaka, BD', lastActive: '2 hours ago' },
                { device: 'Safari on iPhone', location: 'Dhaka, BD', lastActive: '1 day ago' },
              ].map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{session.device}</p>
                    <p className="text-xs text-foreground/60">{session.location}</p>
                    <p className="text-xs text-foreground/50">Last active: {session.lastActive}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>

            <div className="space-y-4">
              {[
                { id: 1, title: 'Project Updates', desc: 'Get notified about project milestones and updates' },
                { id: 2, title: 'Payment Alerts', desc: 'Receive notifications for payment status changes' },
                { id: 3, title: 'Member Requests', desc: 'Be notified when users request to join projects' },
                { id: 4, title: 'New Opportunities', desc: 'Get alerts about new investment opportunities' },
              ].map((pref) => (
                <div key={pref.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{pref.title}</p>
                    <p className="text-sm text-foreground/60 mt-1">{pref.desc}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">Email</Button>
                    <Button variant="outline" size="sm">SMS</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
