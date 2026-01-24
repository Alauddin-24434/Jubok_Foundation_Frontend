import React from "react"
export default function CommonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">
      <div >
        {children}
      </div>
    </div>
  )
}
