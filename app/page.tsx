'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import names from '@/data/names.json'

const NAME_KEY = 'mcq_player_name'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    if (!window.localStorage.getItem(NAME_KEY)) {
      const picked = names[Math.floor(Math.random() * names.length)]
      window.localStorage.setItem(NAME_KEY, picked)
    }
    router.replace('/quiz?category=All&count=10')
  }, [router])

  return <p className="text-center text-gray-400">Loading quiz...</p>
}
