'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import names from '@/data/names.json'
import { CATEGORIES } from '@/lib/categories'

const NAME_KEY = 'mcq_player_name'

function getOrAssignName(): string {
  if (typeof window === 'undefined') return ''
  const existing = window.localStorage.getItem(NAME_KEY)
  if (existing) return existing
  const picked = names[Math.floor(Math.random() * names.length)]
  window.localStorage.setItem(NAME_KEY, picked)
  return picked
}

export default function HomePage() {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [category, setCategory] = useState<string>('All')
  const [count, setCount] = useState<number>(10)

  useEffect(() => {
    setName(getOrAssignName())
  }, [])

  function startQuiz() {
    const params = new URLSearchParams({ category, count: String(count) })
    router.push(`/quiz?${params.toString()}`)
  }

  return (
    <main className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-brand-light">MCQ Practice</h1>
        <p className="mt-2 text-sm text-gray-400">
          Random verbal-ability quiz drawn from synonyms, antonyms, root words, phrasal verbs, blood
          relations, and seating-arrangement material.
        </p>
      </header>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
        <p className="text-sm text-gray-400">Playing as</p>
        <p className="text-xl font-semibold">{name || '...'}</p>
        <p className="mt-1 text-xs text-gray-500">
          A random handle assigned to this browser — no sign-up needed.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-6">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Category</span>
          <select
            className="rounded border border-white/10 bg-[#1a1c33] px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Number of questions</span>
          <select
            className="rounded border border-white/10 bg-[#1a1c33] px-3 py-2"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={startQuiz}
          className="mt-2 rounded bg-brand px-4 py-3 font-semibold hover:bg-brand-dark"
        >
          Start Quiz
        </button>
      </section>

      <a href="/leaderboard" className="text-center text-sm text-brand-light underline">
        View Scoreboard
      </a>
    </main>
  )
}
