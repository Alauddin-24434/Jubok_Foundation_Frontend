'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, LogOut, Home, FolderOpen, Users, CreditCard, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Overview' },
    { href: '/dashboard/projects', icon: FolderOpen, label: 'Projects' },
    { href: '/dashboard/members', icon: Users, label: 'Members' },
    { href: '/dashboard/payments', icon: CreditCard, label: 'Payments' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed md:static top-0 left-0 h-screen ${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-primary-foreground transition-all duration-300 z-40 flex flex-col`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-primary/20">
          {sidebarOpen && (
            <h1 className="font-bold text-lg">Alhamdulillah</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-primary/80 rounded-lg transition"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/80 transition text-sm font-medium"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/80 transition text-sm font-medium"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="h-16 bg-card border-b border-border flex items-center px-6">
          <div className="flex items-center gap-4 ml-auto">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">U</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed md:hidden inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
