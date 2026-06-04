import { z } from 'zod'

export const questionSchema = z.object({
  meeting_id: z.string().uuid('Meeting ID tidak valid'),
  question_text: z.string().min(1, 'Teks soal wajib diisi'),
  image_url: z.string().url('URL gambar tidak valid').optional().nullable(),
  options: z
    .array(z.string().min(1))
    .length(4, 'Harus ada tepat 4 pilihan jawaban'),
  correct_answer: z
    .number()
    .int()
    .min(0)
    .max(3, 'Jawaban benar harus antara 0-3'),
  explanation: z.string().optional().nullable(),
})

export type QuestionInput = z.infer<typeof questionSchema>