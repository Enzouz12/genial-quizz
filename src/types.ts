export interface Player {
  id: string
  name: string
  score: number
  isActive: boolean
}

export interface DirectQuestion {
  type: 'direct'
  text: string
  answer: string
  imageUrl?: string
}

export interface GuessWord {
  word: string
  foundBy: string | null
}

export interface GuessTheMostQuestion {
  type: 'guess_the_most'
  text: string
  words: GuessWord[]
  imageUrl?: string
}

export type Question = DirectQuestion | GuessTheMostQuestion

export interface QuestionCell {
  categoryIndex: number
  tierIndex: number
  points: number
  question: Question
  played: boolean
}

export interface Category {
  name: string
  questions: QuestionCell[]
}

export const POINT_TIERS = [100, 200, 300, 500, 700, 1000] as const

export type PointTier = (typeof POINT_TIERS)[number]
