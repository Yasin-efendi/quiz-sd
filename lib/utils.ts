import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getScoreMessage(percentage: number): string {
  if (percentage >= 90) return 'Luar Biasa! 🌟'
  if (percentage >= 80) return 'Hebat! 👍'
  if (percentage >= 70) return 'Bagus! 💪'
  if (percentage >= 60) return 'Cukup Baik 📚'
  return 'Tetap Semangat! 🎯'
}

export function calculateScore(
  answers: number[],
  correctAnswers: number[]
): number {
  return answers.reduce((score, answer, index) => {
    return answer === correctAnswers[index] ? score + 1 : score
  }, 0)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}