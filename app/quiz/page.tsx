'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CATEGORIES } from '@/lib/categories'

const NAME_KEY = 'mcq_player_name'

type Question = {
  id: string
  category: string
  question: string
  options: string[]
  answer: number
}

function QuizInner() {
  const params = useSearchParams()
  const router = useRouter()

  const [category, setCategory] = useState(params.get('category') || 'All')
  const [count, setCount] = useState(Number(params.get('count')) || 10)

  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setQuestions(null)
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setSubmitted(false)
    fetch(`/api/questions?category=${encodeURIComponent(category)}&count=${count}`)
      .then((res) => res.json())
      .then(setQuestions)
  }, [category, count])

  useEffect(() => {
    if (!finished || submitted || !questions) return
    const name = window.localStorage.getItem(NAME_KEY)
    if (!name) return
    setSubmitted(true)
    fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score, total: questions.length, category }),
    }).catch(() => {})
  }, [finished, submitted, questions, score, category])

  function restart() {
    setQuestions(null)
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setSubmitted(false)
    fetch(`/api/questions?category=${encodeURIComponent(category)}&count=${count}`)
      .then((res) => res.json())
      .then(setQuestions)
  }

  const topBar = (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <div className="flex flex-wrap gap-2">
        <select
          className="rounded border border-white/10 bg-[#1a1c33] px-2 py-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-white/10 bg-[#1a1c33] px-2 py-1"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map((n) => (
            <option key={n} value={n}>
              {n} questions
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => router.push('/leaderboard')} className="text-brand-light underline">
        Scoreboard
      </button>
    </div>
  )

  if (!questions) {
    return (
      <div className="flex flex-col gap-6">
        {topBar}
        <p className="text-center text-gray-400">Loading questions...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {topBar}
        <p className="text-center text-gray-400">No questions available for this category yet.</p>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="flex flex-col gap-6">
        {topBar}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold">Quiz complete</h2>
          <p className="text-4xl font-bold text-brand-light">
            {score} / {questions.length}
          </p>
          <p className="text-gray-400">{pct}% correct</p>
          <div className="mt-4 flex gap-3">
            <button onClick={restart} className="rounded bg-brand px-4 py-2 font-semibold">
              Play again
            </button>
            <button onClick={() => router.push('/leaderboard')} className="rounded bg-white/10 px-4 py-2">
              View Scoreboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[index]

  function choose(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (i === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (!questions || index + 1 >= questions.length) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {topBar}

      <div className="flex justify-between text-sm text-gray-400">
        <span>{q.category}</span>
        <span>
          Question {index + 1} / {questions.length}
        </span>
      </div>

      <h2 className="text-xl font-semibold">{q.question}</h2>

      <div className="flex flex-col gap-3">
        {q.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = selected !== null && i === q.answer
          const isWrongSelected = isSelected && i !== q.answer
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`rounded border px-4 py-3 text-left transition ${
                isCorrect
                  ? 'border-green-500 bg-green-500/20'
                  : isWrongSelected
                    ? 'border-red-500 bg-red-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <button
        onClick={next}
        disabled={selected === null}
        className="rounded bg-brand px-4 py-3 font-semibold disabled:opacity-40"
      >
        {index + 1 >= questions.length ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400">Loading...</p>}>
      <QuizInner />
    </Suspense>
  )
}
