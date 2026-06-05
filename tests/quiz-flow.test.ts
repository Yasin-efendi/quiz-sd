import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Alur Kuis', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('calculateScore menghitung skor dengan benar', async () => {
    const { calculateScore } = await import('@/lib/utils')
    const answers = [0, 1, 2, 3, 0]
    const correct = [0, 1, 2, 3, 0]
    expect(calculateScore(answers, correct)).toBe(5)
  })

  it('calculateScore menghitung skor sebagian benar', async () => {
    const { calculateScore } = await import('@/lib/utils')
    const answers = [0, 1, 2, 3, 1]
    const correct = [0, 1, 2, 3, 0]
    expect(calculateScore(answers, correct)).toBe(4)
  })

  it('calculateScore mengembalikan 0 jika semua salah', async () => {
    const { calculateScore } = await import('@/lib/utils')
    const answers = [1, 2, 3, 0]
    const correct = [0, 1, 2, 3]
    expect(calculateScore(answers, correct)).toBe(0)
  })

  it('getScoreMessage mengembalikan pesan yang tepat', async () => {
    const { getScoreMessage } = await import('@/lib/utils')
    expect(getScoreMessage(100)).toBe('Luar Biasa! 🌟')
    expect(getScoreMessage(85)).toBe('Hebat! 👍')
    expect(getScoreMessage(75)).toBe('Bagus! 💪')
    expect(getScoreMessage(65)).toBe('Cukup Baik 📚')
    expect(getScoreMessage(50)).toBe('Tetap Semangat! 🎯')
  })

  it('generateSlug menghasilkan slug yang benar', async () => {
    const { generateSlug } = await import('@/lib/utils')
    expect(generateSlug('Bahasa Inggris')).toBe('bahasa-inggris')
    expect(generateSlug('Ujian Sekolah - Latihan 1')).toBe('ujian-sekolah-latihan-1')
  })
})