import type { Question } from '@/types'

export interface QuizConfig {
  name: string
  categories: string[]
  questions: Question[][]
  pointTiers?: number[]
}

export const defaultQuiz: QuizConfig = {
  name: 'Genial Quizz - Default',
  categories: ['MIM', 'Discord', 'Poorly Explained', 'Léger, Ouaté, Lourd', 'Messe basse', 'Cassé'],
  questions: [
    [
      {
        type: 'direct',
        text: 'Dans quel conte un loup souffle sur des maisons ?',
        answer: 'Les Trois Petits Cochons',
      },
      { type: 'direct', text: 'Qui dort pendant 100 ans ?', answer: 'La Belle au Bois Dormant' },
      {
        type: 'direct',
        text: 'Quel personnage perd sa pantoufle de verre ?',
        answer: 'Cendrillon',
      },
      {
        type: 'direct',
        text: 'Qui mange la grand-mere dans un conte celebre ?',
        answer: 'Le Loup (Le Petit Chaperon Rouge)',
      },
      {
        type: 'direct',
        text: 'Quel heros grimpe avec un haricot magique ?',
        answer: 'Jack (Jack et le Haricot Magique)',
      },
      { type: 'direct', text: 'Quel pantin en bois voit son nez grandir ?', answer: 'Pinocchio' },
    ],

    [
      {
        type: 'direct',
        text: 'Je suis le plus grand mammifere marin. Qui suis-je ?',
        answer: 'La Baleine Bleue',
      },
      { type: 'direct', text: "J'ai peint la Joconde. Qui suis-je ?", answer: 'Leonard de Vinci' },
      {
        type: 'direct',
        text: 'Je suis le plus haut sommet du monde. Qui suis-je ?',
        answer: "L'Everest",
      },
      {
        type: 'direct',
        text: 'J\'ai ecrit "Les Miserables". Qui suis-je ?',
        answer: 'Victor Hugo',
      },
      {
        type: 'direct',
        text: 'Je suis la planete la plus proche du soleil. Qui suis-je ?',
        answer: 'Mercure',
      },
      {
        type: 'direct',
        text: "J'ai decouvert la penicilline. Qui suis-je ?",
        answer: 'Alexander Fleming',
      },
    ],

    [
      { type: 'direct', text: 'Un rond chaud qui brule dans le ciel', answer: 'Le Soleil' },
      {
        type: 'direct',
        text: "De l'eau qui tombe du ciel quand il est triste",
        answer: 'La Pluie',
      },
      {
        type: 'direct',
        text: "Un rectangle lumineux qui montre des gens qui n'existent pas",
        answer: 'La Television',
      },
      {
        type: 'direct',
        text: 'Des feuilles collees ensemble avec des mots dessus',
        answer: 'Un Livre',
      },
      { type: 'direct', text: 'Un truc froid et blanc qui tombe en hiver', answer: 'La Neige' },
      {
        type: 'direct',
        text: 'Une boite en metal qui avance toute seule sur la route',
        answer: 'Une Voiture',
      },
    ],

    [
      { type: 'direct', text: 'Quelle est la capitale du Japon ?', answer: 'Tokyo' },
      { type: 'direct', text: 'Combien de continents y a-t-il ?', answer: '7' },
      {
        type: 'direct',
        text: "En quelle annee l'homme a-t-il marche sur la Lune ?",
        answer: '1969',
      },
      {
        type: 'direct',
        text: 'Quel est l\'element chimique symbolise par "O" ?',
        answer: 'Oxygene',
      },
      { type: 'direct', text: 'Quel fleuve traverse Paris ?', answer: 'La Seine' },
      {
        type: 'direct',
        text: 'Qui a ecrit la theorie de la relativite ?',
        answer: 'Albert Einstein',
      },
    ],

    [
      {
        type: 'direct',
        text: "La Grande Muraille de Chine est visible depuis l'espace. Vrai ou Faux ?",
        answer: 'Faux',
      },
      {
        type: 'direct',
        text: 'Les dauphins dorment avec un oeil ouvert. Vrai ou Faux ?',
        answer: 'Vrai',
      },
      { type: 'direct', text: 'La banane est une herbe. Vrai ou Faux ?', answer: 'Vrai' },
      {
        type: 'direct',
        text: 'Napoleon etait tres petit. Vrai ou Faux ?',
        answer: 'Faux (il mesurait 1m69, taille moyenne)',
      },
      { type: 'direct', text: 'Le miel ne perime jamais. Vrai ou Faux ?', answer: 'Vrai' },
      {
        type: 'direct',
        text: 'Les humains utilisent seulement 10% de leur cerveau. Vrai ou Faux ?',
        answer: 'Faux',
      },
    ],

    [
      {
        type: 'guess_the_most',
        text: "Citez le plus de pays d'Europe possible",
        words: [
          { word: 'France', foundBy: null },
          { word: 'Allemagne', foundBy: null },
          { word: 'Espagne', foundBy: null },
          { word: 'Italie', foundBy: null },
          { word: 'Portugal', foundBy: null },
          { word: 'Belgique', foundBy: null },
          { word: 'Suisse', foundBy: null },
          { word: 'Pays-Bas', foundBy: null },
        ],
      },
      {
        type: 'guess_the_most',
        text: 'Citez le plus de fruits possible',
        words: [
          { word: 'Pomme', foundBy: null },
          { word: 'Banane', foundBy: null },
          { word: 'Orange', foundBy: null },
          { word: 'Fraise', foundBy: null },
          { word: 'Cerise', foundBy: null },
          { word: 'Raisin', foundBy: null },
        ],
      },
      {
        type: 'guess_the_most',
        text: 'Citez le plus de superheros possible',
        words: [
          { word: 'Superman', foundBy: null },
          { word: 'Batman', foundBy: null },
          { word: 'Spider-Man', foundBy: null },
          { word: 'Iron Man', foundBy: null },
          { word: 'Wonder Woman', foundBy: null },
        ],
      },
      {
        type: 'direct',
        text: "Defi: Chanter le refrain d'une chanson celebre",
        answer: 'Le juge decide !',
      },
      {
        type: 'direct',
        text: 'Defi: Mimer un animal et faire deviner les autres',
        answer: 'Le juge decide !',
      },
      {
        type: 'guess_the_most',
        text: 'Citez le plus de capitales du monde possible',
        words: [
          { word: 'Paris', foundBy: null },
          { word: 'Londres', foundBy: null },
          { word: 'Berlin', foundBy: null },
          { word: 'Tokyo', foundBy: null },
          { word: 'Washington', foundBy: null },
          { word: 'Madrid', foundBy: null },
          { word: 'Rome', foundBy: null },
          { word: 'Pekin', foundBy: null },
        ],
      },
    ],
  ],
}
