import { describe, it, expect } from 'vitest'

// Set env dulu sebelum import
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-vitest-testing-only'

describe('Token JWT', () => {
  it('createToken menghasilkan string token', async () => {
    const { createToken } = await import('@/lib/token')
    const payload = {
      meeting_slug: 'bahasa-inggris-ujian-1',
      student_name: 'Test Siswa',
      answers: [0, 1, 2],
      score: 2,
      total_questions: 3,
      attempt_id: 'test-id-123',
    }
    const token = createToken(payload)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(10)
  })

  it('verifyToken berhasil decode token yang valid', async () => {
    const { createToken, verifyToken } = await import('@/lib/token')
    const payload = {
      meeting_slug: 'bahasa-inggris-ujian-1',
      student_name: 'Test Siswa',
      answers: [0, 1, 2],
      score: 2,
      total_questions: 3,
      attempt_id: 'test-id-123',
    }
    const token = createToken(payload)
    const decoded = verifyToken(token)

    expect(decoded).not.toBeNull()
    expect(decoded?.student_name).toBe('Test Siswa')
    expect(decoded?.score).toBe(2)
    expect(decoded?.meeting_slug).toBe('bahasa-inggris-ujian-1')
  })

  it('verifyToken mengembalikan null untuk token tidak valid', async () => {
    const { verifyToken } = await import('@/lib/token')
    const result = verifyToken('token-palsu-tidak-valid')
    expect(result).toBeNull()
  })

  it('verifyToken mengembalikan null untuk token kosong', async () => {
    const { verifyToken } = await import('@/lib/token')
    const result = verifyToken('')
    expect(result).toBeNull()
  })
})