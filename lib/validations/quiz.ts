import { z } from 'zod'

export const submitQuizSchema = z.object({
  student_name: z.string().min(1, 'Nama siswa wajib diisi').max(100),
  answers: z.array(z.number().int().min(0).max(3)),
})

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>