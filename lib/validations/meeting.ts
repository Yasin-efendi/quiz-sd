import { z } from 'zod'

export const meetingSchema = z.object({
  subject_id: z.string().uuid('Subject ID tidak valid'),
  meeting_number: z.number().int().min(1),
  title: z.string().min(1, 'Judul wajib diisi').max(200),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda -'),
  description: z.string().optional(),
})

export type MeetingInput = z.infer<typeof meetingSchema>