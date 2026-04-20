import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Player } from '@/types'

export const usePlayerStore = defineStore('player', () => {
  const players = ref<Player[]>([])

  const activePlayer = computed(() => players.value.find((p) => p.isActive) ?? null)

  function addPlayer(name: string) {
    if (players.value.length >= 6) return
    players.value.push({
      id: crypto.randomUUID(),
      name,
      score: 0,
      isActive: false,
    })
  }

  function removePlayer(id: string) {
    players.value = players.value.filter((p) => p.id !== id)
  }

  function updateScore(id: string, amount: number) {
    const player = players.value.find((p) => p.id === id)
    if (player) {
      player.score += amount
    }
  }

  function setActive(id: string) {
    players.value.forEach((p) => {
      p.isActive = p.id === id
    })
  }

  function clearActive() {
    players.value.forEach((p) => {
      p.isActive = false
    })
  }

  function setPlayers(newPlayers: { name: string }[]) {
    players.value = newPlayers.map((p) => ({
      id: crypto.randomUUID(),
      name: p.name,
      score: 0,
      isActive: false,
    }))
  }

  return {
    players,
    activePlayer,
    addPlayer,
    removePlayer,
    updateScore,
    setActive,
    clearActive,
    setPlayers,
  }
})
