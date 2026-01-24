'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const [saveMessage, setSaveMessage] = useState('')

  const handleSave = () => {
    setSaveMessage('Settings saved successfully!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-foreground/60 mt-1">Configure platform-wide settings</p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex gap-3 items-center">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
          <p className="text-sm text-primary">{saveMessage}</p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Platform Information</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="platform-name" className="text-sm">Platform Name</Label>
                <Input
                  id="platform-name"
                  defaultValue="Alhamdulillah Foundation"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="platform-url" className="text-sm">Platform URL</Label>
                <Input
                  id="platform-url"
                  defaultValue="https://alhamdulillah.com"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="support-email" className="text-sm">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  defaultValue="support@alhamdulillah.com"
                  className="mt-1.5"
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Project Settings</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="min-amount" className="text-sm">Minimum Investment Amount (৳)</Label>
                <Input
                  id="min-amount"
                  type="number"
                  defaultValue="5000"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="max-amount" className="text-sm">Maximum Investment Amount (৳)</Label>
                <Input
                  id="max-amount"
                  type="number"
                  defaultValue="1000000"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="approval-required" className="text-sm">Require Admin Approval for New Projects</Label>
                <div className="mt-2 flex gap-3">
                  <Button variant="outline">Enabled</Button>
                  <Button>Disabled</Button>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">SSLCommerz Configuration</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="store-id" className="text-sm">Store ID</Label>
                <Input
                  id="store-id"
                  placeholder="Enter your SSL Store ID"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="store-password" className="text-sm">Store Password</Label>
                <Input
                  id="store-password"
                  type="password"
                  placeholder="Enter your SSL Store Password"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="is-live" className="text-sm">Environment</Label>
                <div className="mt-2 flex gap-3">
                  <Button variant="outline">Development</Button>
                  <Button>Production</Button>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Payment Methods</h3>
            <div className="space-y-3">
              {[
                { name: 'bKash', enabled: true },
                { name: 'Nagad', enabled: true },
                { name: 'Bank Transfer', enabled: true },
                { name: 'Card Payment', enabled: true },
              ].map((method, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <span className="font-medium text-foreground">{method.name}</span>
                  <Button variant={method.enabled ? 'default' : 'outline'} size="sm">
                    {method.enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">SMTP Configuration</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="smtp-host" className="text-sm">SMTP Host</Label>
                <Input
                  id="smtp-host"
                  placeholder="smtp.gmail.com"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="smtp-port" className="text-sm">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  defaultValue="587"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="smtp-username" className="text-sm">SMTP Username</Label>
                <Input
                  id="smtp-username"
                  placeholder="your-email@gmail.com"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="smtp-password" className="text-sm">SMTP Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  placeholder="Your app password"
                  className="mt-1.5"
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Email Templates</h3>
            <Button variant="outline" className="w-full bg-transparent">
              Manage Templates
            </Button>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Database Backup</h3>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <p className="font-medium text-foreground">Last Backup</p>
                <p className="text-sm text-foreground/60 mt-1">2024-01-25 at 14:30 UTC</p>
                <p className="text-xs text-foreground/50 mt-2">Size: 125 MB</p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  Backup Now
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Restore
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Automatic Backups</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="backup-frequency" className="text-sm">Backup Frequency</Label>
                <select
                  id="backup-frequency"
                  defaultValue="daily"
                  className="w-full mt-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <Label htmlFor="backup-retention" className="text-sm">Retention Days</Label>
                <Input
                  id="backup-retention"
                  type="number"
                  defaultValue="30"
                  className="mt-1.5"
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
