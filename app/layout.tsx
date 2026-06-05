import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quiz SD',
  description: 'Aplikasi kuis pembelajaran untuk Sekolah Dasar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}