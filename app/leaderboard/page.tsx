import { getLeaderboard, isUsingDurableStorage } from '@/lib/leaderboard'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const board = await getLeaderboard()
  const durable = isUsingDurableStorage()

  return (
    <main className="flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-brand-light">Scoreboard</h1>
        <p className="mt-2 text-sm text-gray-400">Latest score per player, best result first.</p>
        {!durable && (
          <p className="mt-2 text-xs text-yellow-400">
            No database configured — scores are stored in memory and will reset on redeploy or cold
            start. Add Upstash Redis env vars for a persistent shared scoreboard.
          </p>
        )}
      </header>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/10 text-sm text-gray-300">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Player</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">When</th>
            </tr>
          </thead>
          <tbody>
            {board.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No scores yet. Be the first to play!
                </td>
              </tr>
            )}
            {board.map((entry, i) => (
              <tr key={entry.name} className="border-t border-white/10">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2 font-medium">{entry.name}</td>
                <td className="px-4 py-2">
                  {entry.score} / {entry.total}
                </td>
                <td className="px-4 py-2 text-sm text-gray-400">{entry.category}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <a href="/" className="text-center text-sm text-brand-light underline">
        Back to quiz
      </a>
    </main>
  )
}
