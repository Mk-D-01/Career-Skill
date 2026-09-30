import { NextResponse } from 'next/server'
import questions from '@/data/questions.json'

export const dynamic = 'force-dynamic'

type Question = {
  id: string
  category: string
  question: string
  options: string[]
  answer: number
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')
  const count = Math.max(1, Math.min(50, Number(url.searchParams.get('count')) || 10))

  const bank = questions as Question[]
  const pool = category && category !== 'All' ? bank.filter((q) => q.category === category) : bank

  const picked = shuffle(pool)
    .slice(0, count)
    .map((q) => {
      const indexed = q.options.map((opt, i) => ({ opt, correct: i === q.answer }))
      const shuffledOptions = shuffle(indexed)
      return {
        id: q.id,
        category: q.category,
        question: q.question,
        options: shuffledOptions.map((o) => o.opt),
        answer: shuffledOptions.findIndex((o) => o.correct),
      }
    })

  return NextResponse.json(picked)
}
