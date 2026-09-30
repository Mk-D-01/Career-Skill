export const CATEGORIES = [
  'All',
  'Synonyms',
  'Antonyms',
  'Phrasal Verbs',
  'Root Words',
  'Blood Relations',
  'Seating Arrangement',
] as const

export type Category = (typeof CATEGORIES)[number]
