import { describe, it, expect } from 'vitest'

describe('Validasi Input — Quiz', () => {
  it('menolak jika student_name kosong', async () => {
    const { submitQuizSchema } = await import('@/lib/validations/quiz')
    const result = submitQuizSchema.safeParse({
      student_name: '',
      answers: [0, 1, 2],
    })
    expect(result.success).toBe(false)
  })

  it('menolak jika answers bukan array angka', async () => {
    const { submitQuizSchema } = await import('@/lib/validations/quiz')
    const result = submitQuizSchema.safeParse({
      student_name: 'Budi',
      answers: ['a', 'b'],
    })
    expect(result.success).toBe(false)
  })

  it('menerima input yang valid', async () => {
    const { submitQuizSchema } = await import('@/lib/validations/quiz')
    const result = submitQuizSchema.safeParse({
      student_name: 'Budi',
      answers: [0, 1, 2, 3],
    })
    expect(result.success).toBe(true)
  })
})

describe('Validasi Input — Subject', () => {
  it('menolak slug dengan karakter tidak valid', async () => {
    const { subjectSchema } = await import('@/lib/validations/subject')
    const result = subjectSchema.safeParse({
      name: 'Matematika',
      slug: 'Matematika Kelas 3',
    })
    expect(result.success).toBe(false)
  })

  it('menerima input subject yang valid', async () => {
    const { subjectSchema } = await import('@/lib/validations/subject')
    const result = subjectSchema.safeParse({
      name: 'Matematika',
      slug: 'matematika',
    })
    expect(result.success).toBe(true)
  })
})

describe('Validasi Input — Question', () => {
  it('menolak jika options kurang dari 4', async () => {
    const { questionSchema } = await import('@/lib/validations/question')
    const result = questionSchema.safeParse({
      meeting_id: '00000000-0000-0000-0000-000000000001',
      question_text: 'Soal test',
      options: ['A', 'B', 'C'],
      correct_answer: 0,
    })
    expect(result.success).toBe(false)
  })

  it('menolak correct_answer di luar 0-3', async () => {
    const { questionSchema } = await import('@/lib/validations/question')
    const result = questionSchema.safeParse({
      meeting_id: '00000000-0000-0000-0000-000000000001',
      question_text: 'Soal test',
      options: ['A', 'B', 'C', 'D'],
      correct_answer: 5,
    })
    expect(result.success).toBe(false)
  })

  it('menerima input question yang valid', async () => {
    const { questionSchema } = await import('@/lib/validations/question')
    const result = questionSchema.safeParse({
      meeting_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      question_text: 'Berapa hasil 2 + 2?',
      options: ['3', '4', '5', '6'],
      correct_answer: 1,
    })
    expect(result.success).toBe(true)
  })
})