import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MCQ Practice',
  description: 'Randomized MCQ practice quizzes with a shared scoreboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>
      </body>
    </html>
  )
}
