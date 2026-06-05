'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  id: string
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Hapus soal ini?')) return
    await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete}>
      Hapus
    </Button>
  )
}