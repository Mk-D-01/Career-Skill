import { Redis } from '@upstash/redis'

export type ScoreEntry = {
  name: string
  score: number
  total: number
  category: string
  timestamp: number
}

const LEADERBOARD_KEY = 'mcq:leaderboard'

// Cold-start-scoped fallback so the app still works with zero config.
// Resets on redeploy/new serverless instance — configure Upstash env vars for durable, shared scores.
const memoryStore: Map<string, ScoreEntry> = (globalThis as any).__mcqMemoryStore ?? new Map()
;(globalThis as any).__mcqMemoryStore = memoryStore

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export async function submitScore(entry: ScoreEntry): Promise<void> {
  const redis = getRedis()
  if (redis) {
    await redis.hset(LEADERBOARD_KEY, { [entry.name]: JSON.stringify(entry) })
    return
  }
  memoryStore.set(entry.name, entry)
}

export async function getLeaderboard(limit = 50): Promise<ScoreEntry[]> {
  const redis = getRedis()
  let entries: ScoreEntry[] = []

  if (redis) {
    const all = await redis.hgetall<Record<string, unknown>>(LEADERBOARD_KEY)
    if (all) {
      entries = Object.values(all).map((v) =>
        typeof v === 'string' ? (JSON.parse(v) as ScoreEntry) : (v as ScoreEntry)
      )
    }
  } else {
    entries = Array.from(memoryStore.values())
  }

  return entries
    .sort((a, b) => b.score / b.total - a.score / a.total || b.timestamp - a.timestamp)
    .slice(0, limit)
}

export function isUsingDurableStorage(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}
