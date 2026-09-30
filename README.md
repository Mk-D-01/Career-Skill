# MCQ Practice

A random-question MCQ practice quiz built from verbal-ability material (synonyms, antonyms,
root words, phrasal verbs, blood relations, seating arrangement). Every attempt pulls a fresh
random set of questions with shuffled options, and results feed a shared scoreboard.

## How it works

- **Question bank**: `data/questions.json`, a flat array of `{ id, category, question, options, answer }`.
- **Random selection**: `app/api/questions/route.ts` samples N random questions from the chosen
  category and shuffles each question's options server-side on every request.
- **Identity**: no sign-up. On first visit, the browser is assigned a random handle from the 500
  names in `data/names.json`, stored in `localStorage`. That handle is the player's scoreboard identity.
- **Scoreboard**: `app/api/score/route.ts` (`POST` to submit, `GET` to read) stores the *latest*
  score per handle. `app/leaderboard/page.tsx` renders it, sorted by percentage correct.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Persistent shared scoreboard (optional, still all inside Vercel)

By default the scoreboard is kept in an in-memory store scoped to the running serverless
instance — it works, but resets on redeploys or cold starts. To make it durable and shared
across every visitor, without deploying any separate backend to another host (like Render):

1. Deploy this project to Vercel (see below).
2. In the Vercel dashboard, open the project -> **Storage** tab -> **Create Database** ->
   choose **Upstash for Redis** (free tier). This provisions a managed Redis database and
   Vercel automatically injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into
   your project's environment variables.
3. Redeploy (Vercel does this automatically after linking the database). `lib/leaderboard.ts`
   detects the env vars and switches from in-memory storage to Redis automatically — no code
   changes needed.

Nothing runs outside Vercel: the "database" is a managed service you provision from the same
dashboard, not code you write and deploy elsewhere.

## Deploying to Vercel

```bash
npm install -g vercel   # if you don't have it
vercel
```

Or: push this folder to a GitHub repo and import it at https://vercel.com/new — Next.js is
auto-detected, no configuration needed. Add the Upstash env vars afterward if you want the
durable scoreboard (see above).

## Regenerating the question bank

`data/questions.json` was generated from the source PDFs/DOCX files in this folder (synonym and
antonym lists, root word lists, phrasal verb sheets, blood relations and seating arrangement
worksheets). Edit that file directly, or add more entries following the same shape, to grow or
correct the question pool.
