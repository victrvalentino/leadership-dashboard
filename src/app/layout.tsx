import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'One Leadership Dashboard | People Experience Directorate',
  description: 'Workforce analytics and leadership intelligence dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">{children}</body>
    </html>
  )
}
