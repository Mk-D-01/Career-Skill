import { NextResponse } from 'next/server'
import { getLeaderboard, submitScore } from '@/lib/leaderboard'

export const dynamic = 'force-dynamic'

export async function GET() {
  const board = await getLeaderboard()
  return NextResponse.json(board)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const { name, score, total, category } = body ?? {}

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof score !== 'number' ||
    typeof total !== 'number' ||
    total <= 0 ||
    score < 0 ||
    score > total
  ) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  await submitScore({
    name: name.trim().slice(0, 40),
    score,
    total,
    category: typeof category === 'string' ? category.slice(0, 40) : 'Mixed',
    timestamp: Date.now(),
  })

  return NextResponse.json({ ok: true })
}
