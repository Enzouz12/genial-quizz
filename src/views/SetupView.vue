<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useGameStore } from '@/stores/game'
import { defaultQuiz } from '@/config/defaultQuiz'
import type { QuizConfig } from '@/config/defaultQuiz'
import { POINT_TIERS } from '@/types'
import type { Question, DirectQuestion, GuessTheMostQuestion } from '@/types'

const router = useRouter()
const playerStore = usePlayerStore()
const gameStore = useGameStore()

// Players
const playerNames = ref<string[]>(['Julien', 'Andrija', 'Cédric'])

function addPlayerSlot() {
  if (playerNames.value.length < 6) {
    playerNames.value.push('')
  }
}

function removePlayerSlot(index: number) {
  if (playerNames.value.length > 2) {
    playerNames.value.splice(index, 1)
  }
}

// Point tiers
const pointTiers = ref<number[]>([...POINT_TIERS])

// Categories
const categoryNames = ref<string[]>([...defaultQuiz.categories])

// Questions: questions[catIndex][tierIndex]
const questions = reactive<Question[][]>(buildQuestionsFromConfig(defaultQuiz))

function buildQuestionsFromConfig(config: QuizConfig): Question[][] {
  return config.questions.map((cat) =>
    cat.map((q) => {
      if (q.type === 'guess_the_most') {
        return {
          type: 'guess_the_most' as const,
          text: q.text,
          words: q.words.map((w) => ({ word: w.word, foundBy: null })),
          imageUrl: q.imageUrl,
        }
      }
      return { type: 'direct' as const, text: q.text, answer: q.answer, imageUrl: q.imageUrl }
    }),
  )
}

// Active category tab for question editing
const activeCategoryTab = ref(0)

function setQuestionType(catIdx: number, tierIdx: number, type: 'direct' | 'guess_the_most') {
  const existing = questions[catIdx]![tierIdx]!
  if (type === 'direct') {
    questions[catIdx]![tierIdx] = {
      type: 'direct',
      text: existing.text,
      answer: '',
      imageUrl: existing.imageUrl,
    }
  } else {
    questions[catIdx]![tierIdx] = {
      type: 'guess_the_most',
      text: existing.text,
      words: [{ word: '', foundBy: null }],
      imageUrl: existing.imageUrl,
    }
  }
}

function addWord(catIdx: number, tierIdx: number) {
  const q = questions[catIdx]![tierIdx] as GuessTheMostQuestion
  q.words.push({ word: '', foundBy: null })
}

function removeWord(catIdx: number, tierIdx: number, wordIdx: number) {
  const q = questions[catIdx]![tierIdx] as GuessTheMostQuestion
  if (q.words.length > 1) {
    q.words.splice(wordIdx, 1)
  }
}

// Image handling
function handleImageFile(catIdx: number, tierIdx: number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    questions[catIdx]![tierIdx]!.imageUrl = reader.result as string
  }
  reader.readAsDataURL(file)
  input.value = ''
}

function removeImage(catIdx: number, tierIdx: number) {
  questions[catIdx]![tierIdx]!.imageUrl = undefined
}

// Export / Import
function exportQuiz() {
  const config: QuizConfig = {
    name: 'Genial Quizz Export',
    categories: [...categoryNames.value],
    pointTiers: [...pointTiers.value],
    questions: questions.map((cat) =>
      cat.map((q) => {
        if (q.type === 'guess_the_most') {
          return {
            type: 'guess_the_most' as const,
            text: q.text,
            words: q.words.map((w) => ({ word: w.word, foundBy: null })),
            imageUrl: q.imageUrl,
          }
        }
        return { type: 'direct' as const, text: q.text, answer: q.answer, imageUrl: q.imageUrl }
      }),
    ),
  }

  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'genial-quizz-export.json'
  a.click()
  URL.revokeObjectURL(url)
}

const importInput = ref<HTMLInputElement | null>(null)

function triggerImport() {
  importInput.value?.click()
}

function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const config = JSON.parse(reader.result as string) as QuizConfig
      if (!config.categories || !config.questions) {
        alert('Fichier invalide : categories ou questions manquantes.')
        return
      }
      categoryNames.value = [...config.categories]
      if (config.pointTiers) {
        pointTiers.value = [...config.pointTiers]
      }
      const built = buildQuestionsFromConfig(config)
      questions.splice(0, questions.length, ...built)
      activeCategoryTab.value = 0
    } catch {
      alert('Erreur lors de la lecture du fichier JSON.')
    }
  }
  reader.readAsText(file)
  input.value = ''
}

// Validation
function canStart(): boolean {
  const validPlayers = playerNames.value.filter((n) => n.trim().length > 0)
  if (validPlayers.length < 2) return false
  for (const name of categoryNames.value) {
    if (!name.trim()) return false
  }
  return true
}

function startGame() {
  if (!canStart()) return

  const validPlayers = playerNames.value
    .filter((n) => n.trim().length > 0)
    .map((name) => ({ name: name.trim() }))

  playerStore.setPlayers(validPlayers)
  gameStore.initCategories(
    categoryNames.value.map((n) => n.trim()),
    questions,
    pointTiers.value,
  )
  gameStore.startGame()
  router.push('/board')
}
</script>

<template>
  <div class="setup-page">
    <header class="setup-header">
      <h1>GENIAL QUIZZ</h1>
      <p class="subtitle">Configurez votre partie</p>
      <div class="toolbar">
        <button class="btn btn-toolbar" @click="exportQuiz">Exporter le quiz</button>
        <button class="btn btn-toolbar" @click="triggerImport">Importer un quiz</button>
        <input
          ref="importInput"
          type="file"
          accept=".json"
          class="hidden-input"
          @change="handleImport"
        />
      </div>
    </header>

    <!-- Players Section -->
    <section class="setup-section">
      <h2>Joueurs</h2>
      <div class="players-grid">
        <div v-for="(_, index) in playerNames" :key="index" class="player-input-row">
          <span class="player-number">{{ index + 1 }}</span>
          <input
            v-model="playerNames[index]"
            type="text"
            :placeholder="`Joueur ${index + 1}`"
            class="input"
          />
          <button
            v-if="playerNames.length > 2"
            class="btn-icon btn-remove"
            @click="removePlayerSlot(index)"
          >
            &times;
          </button>
        </div>
      </div>
      <button v-if="playerNames.length < 6" class="btn btn-secondary" @click="addPlayerSlot">
        + Ajouter un joueur
      </button>
    </section>

    <!-- Categories Section -->
    <section class="setup-section">
      <h2>Categories</h2>
      <div class="categories-grid">
        <div v-for="(_, index) in categoryNames" :key="index" class="category-input-row">
          <span class="category-number">{{ index + 1 }}</span>
          <input
            v-model="categoryNames[index]"
            type="text"
            :placeholder="`Categorie ${index + 1}`"
            class="input"
          />
        </div>
      </div>
    </section>

    <!-- Questions Section -->
    <section class="setup-section">
      <h2>Questions</h2>
      <div class="category-tabs">
        <button
          v-for="(cat, idx) in categoryNames"
          :key="idx"
          class="tab"
          :class="{ active: activeCategoryTab === idx }"
          @click="activeCategoryTab = idx"
        >
          {{ cat || `Cat ${idx + 1}` }}
        </button>
      </div>

      <div class="questions-list">
        <div v-for="(tier, tierIdx) in pointTiers" :key="tierIdx" class="question-card">
          <div class="question-header">
            <div class="points-badge-edit">
              <input
                v-model.number="pointTiers[tierIdx]"
                type="number"
                min="0"
                step="50"
                class="points-input"
              />
              <span class="points-suffix">pts</span>
            </div>
            <select
              :value="questions[activeCategoryTab]![tierIdx]!.type"
              class="type-select"
              @change="
                setQuestionType(
                  activeCategoryTab,
                  tierIdx,
                  ($event.target as HTMLSelectElement).value as 'direct' | 'guess_the_most',
                )
              "
            >
              <option value="direct">Direct</option>
              <option value="guess_the_most">Guess the Most</option>
            </select>
          </div>

          <input
            v-model="questions[activeCategoryTab]![tierIdx]!.text"
            type="text"
            placeholder="Question..."
            class="input input-full"
          />

          <!-- Direct type -->
          <template v-if="questions[activeCategoryTab]![tierIdx]!.type === 'direct'">
            <input
              v-model="(questions[activeCategoryTab]![tierIdx] as DirectQuestion).answer"
              type="text"
              placeholder="Reponse..."
              class="input input-full"
            />
          </template>

          <!-- Guess the most type -->
          <template v-else>
            <div class="words-section">
              <div
                v-for="(word, wIdx) in (
                  questions[activeCategoryTab]![tierIdx] as GuessTheMostQuestion
                ).words"
                :key="wIdx"
                class="word-row"
              >
                <input
                  v-model="word.word"
                  type="text"
                  :placeholder="`Mot ${wIdx + 1}`"
                  class="input"
                />
                <button
                  v-if="
                    (questions[activeCategoryTab]![tierIdx] as GuessTheMostQuestion).words.length >
                    1
                  "
                  class="btn-icon btn-remove-small"
                  @click="removeWord(activeCategoryTab, tierIdx, wIdx)"
                >
                  &times;
                </button>
              </div>
              <button
                class="btn btn-small btn-secondary"
                @click="addWord(activeCategoryTab, tierIdx)"
              >
                + Mot
              </button>
            </div>
          </template>

          <!-- Image section -->
          <div class="image-section">
            <div class="image-label">Image (optionnel)</div>
            <div class="image-controls">
              <input
                :value="
                  questions[activeCategoryTab]![tierIdx]!.imageUrl?.startsWith('data:')
                    ? ''
                    : (questions[activeCategoryTab]![tierIdx]!.imageUrl ?? '')
                "
                type="text"
                placeholder="URL de l'image..."
                class="input image-url-input"
                @input="
                  questions[activeCategoryTab]![tierIdx]!.imageUrl =
                    ($event.target as HTMLInputElement).value || undefined
                "
              />
              <label class="btn btn-small btn-secondary btn-upload">
                Fichier
                <input
                  type="file"
                  accept="image/*"
                  class="hidden-input"
                  @change="handleImageFile(activeCategoryTab, tierIdx, $event)"
                />
              </label>
              <button
                v-if="questions[activeCategoryTab]![tierIdx]!.imageUrl"
                class="btn-icon btn-remove-small"
                @click="removeImage(activeCategoryTab, tierIdx)"
              >
                &times;
              </button>
            </div>
            <div v-if="questions[activeCategoryTab]![tierIdx]!.imageUrl" class="image-preview">
              <img :src="questions[activeCategoryTab]![tierIdx]!.imageUrl" alt="Preview" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Start Button -->
    <div class="start-section">
      <button class="btn btn-start" :disabled="!canStart()" @click="startGame">
        Lancer la partie !
      </button>
    </div>
  </div>
</template>

<style scoped>
.setup-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}

.setup-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.setup-header h1 {
  font-size: 3rem;
  color: var(--color-navy);
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 var(--color-primary);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.toolbar {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-toolbar {
  background: var(--color-navy);
  color: var(--color-primary);
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-toolbar:hover {
  opacity: 0.85;
}

.hidden-input {
  display: none;
}

.setup-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-warm);
  border: 2px solid var(--color-primary-dark);
}

.setup-section h2 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--color-navy);
}

.input {
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--color-primary-dark);
}

.input-full {
  width: 100%;
  margin-top: 0.5rem;
}

/* Players */
.players-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.player-input-row,
.category-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.player-input-row .input,
.category-input-row .input {
  flex: 1;
}

.player-number,
.category-number {
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: var(--color-navy);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.btn-remove {
  background: var(--color-red);
  color: white;
}

.btn-remove:hover {
  background: #c0313d;
}

.btn-remove-small {
  width: 26px;
  height: 26px;
  font-size: 1rem;
  background: var(--color-red);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Categories */
.categories-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

/* Tabs */
.category-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tab {
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-pill);
  background: var(--color-bg-dark);
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.tab:hover {
  background: var(--color-primary);
}

.tab.active {
  background: var(--color-primary);
  color: var(--color-navy);
  border-color: var(--color-amber);
}

/* Question cards */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-card {
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.points-badge-edit {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--color-primary);
  border-radius: var(--radius-pill);
  padding: 0.15rem 0.6rem 0.15rem 0.3rem;
}

.points-input {
  width: 60px;
  border: none;
  background: transparent;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-navy);
  text-align: center;
  padding: 0;
}

.points-input:focus {
  outline: none;
}

.points-input::-webkit-outer-spin-button,
.points-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.points-input[type='number'] {
  -moz-appearance: textfield;
}

.points-suffix {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--color-navy);
  opacity: 0.7;
}

.type-select {
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.3rem 0.5rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  background: white;
  color: var(--color-text);
}

.words-section {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.word-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.word-row .input {
  flex: 1;
}

/* Image section */
.image-section {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.image-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-light);
  margin-bottom: 0.35rem;
}

.image-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.image-url-input {
  flex: 1;
}

.btn-upload {
  cursor: pointer;
  flex-shrink: 0;
}

.image-preview {
  margin-top: 0.5rem;
}

.image-preview img {
  max-width: 200px;
  max-height: 120px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-border);
  object-fit: cover;
}

/* Buttons */
.btn {
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--color-bg-dark);
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-primary);
  border-color: var(--color-amber);
}

.btn-small {
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
}

/* Start */
.start-section {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.btn-start {
  background: linear-gradient(135deg, var(--color-primary), var(--color-amber));
  color: var(--color-navy);
  font-family: var(--font-display);
  font-size: 1.5rem;
  padding: 1rem 3rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-gold-lg);
  transition: all 0.3s;
  letter-spacing: 1px;
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255, 193, 7, 0.5);
}

.btn-start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
