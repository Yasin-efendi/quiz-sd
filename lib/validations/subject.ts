import { z } from 'zod'

export const subjectSchema = z.object({
  name: z.string().min(1, 'Nama pelajaran wajib diisi').max(100),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda -'),
})

export type SubjectInput = z.infer<typeof subjectSchema>