import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Category, Question } from '@/types'
import { POINT_TIERS } from '@/types'

export type GamePhase = 'setup' | 'playing'

export const useGameStore = defineStore('game', () => {
  const phase = ref<GamePhase>('setup')
  const categories = ref<Category[]>([])

  const totalCells = computed(() => categories.value.length * POINT_TIERS.length)
  const playedCells = computed(() =>
    categories.value.reduce((sum, cat) => sum + cat.questions.filter((q) => q.played).length, 0),
  )
  const allPlayed = computed(() => totalCells.value > 0 && playedCells.value === totalCells.value)

  function initCategories(categoryNames: string[], questions: Question[][], pointTiers?: number[]) {
    const tiers = pointTiers ?? [...POINT_TIERS]
    categories.value = categoryNames.map((name, catIdx) => ({
      name,
      questions: tiers.map((points, tierIdx) => ({
        categoryIndex: catIdx,
        tierIndex: tierIdx,
        points,
        question: questions[catIdx]?.[tierIdx] ?? {
          type: 'direct' as const,
          text: '',
          answer: '',
        },
        played: false,
      })),
    }))
  }

  function markPlayed(categoryIndex: number, tierIndex: number) {
    const cat = categories.value[categoryIndex]
    if (cat) {
      const cell = cat.questions[tierIndex]
      if (cell) {
        cell.played = true
      }
    }
  }

  function getCell(categoryIndex: number, tierIndex: number) {
    return categories.value[categoryIndex]?.questions[tierIndex] ?? null
  }

  function startGame() {
    phase.value = 'playing'
  }

  function resetGame() {
    phase.value = 'setup'
    categories.value = []
  }

  return {
    phase,
    categories,
    totalCells,
    playedCells,
    allPlayed,
    initCategories,
    markPlayed,
    getCell,
    startGame,
    resetGame,
  }
})
