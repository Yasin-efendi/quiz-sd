'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Meeting {
  id: string
  title: string
}

export default function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [form, setForm] = useState({
    meeting_id: '',
    question_text: '',
    image_url: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [questionId, setQuestionId] = useState('')

  useEffect(() => {
    params.then(({ id }) => {
      setQuestionId(id)
      Promise.all([
        fetch('/api/admin/meetings').then((r) => r.json()),
        fetch(`/api/admin/questions?meeting_id=all`).then((r) => r.json()),
      ]).then(([mData, qData]) => {
        setMeetings(mData.data ?? [])
        const question = (qData.data ?? []).find((q: any) => q.id === id)
        if (question) {
          setForm({
            meeting_id: question.meeting_id,
            question_text: question.question_text,
            image_url: question.image_url ?? '',
            options: question.options,
            correct_answer: question.correct_answer,
            explanation: question.explanation ?? '',
          })
        }
        setLoading(false)
      })
    })
  }, [params])

  function handleOptionChange(index: number, value: string) {
    const newOptions = [...form.options]
    newOptions[index] = value
    setForm((f) => ({ ...f, options: newOptions }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')

    const res = await fetch(`/api/admin/questions/${questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        image_url: form.image_url || null,
        explanation: form.explanation || null,
        correct_answer: Number(form.correct_answer),
      }),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Gagal menyimpan')
      setSaving(false)
      return
    }

    router.push('/admin/questions')
  }

  const OPTION_LABELS = ['A', 'B', 'C', 'D']

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">Memuat soal...</div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>←</Button>
        <h1 className="text-2xl font-bold">Edit Soal</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail Soal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Pertemuan</Label>
            <Select
              value={form.meeting_id}
              onValueChange={(v) => setForm((f) => ({ ...f, meeting_id: v ?? '' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih pertemuan" />
              </SelectTrigger>
              <SelectContent>
                {meetings.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Teks Soal</Label>
            <Textarea
              value={form.question_text}
              onChange={(e) =>
                setForm((f) => ({ ...f, question_text: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label>URL Gambar (opsional)</Label>
            <Input
              value={form.image_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, image_url: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Pilihan Jawaban</Label>
            {form.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-6 text-sm font-medium text-gray-500">
                  {OPTION_LABELS[index]}
                </span>
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <Label>Jawaban Benar</Label>
            <Select
              value={String(form.correct_answer)}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, correct_answer: Number(v) }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPTION_LABELS.map((label, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {label} — {form.options[index] || `Pilihan ${label}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Pembahasan (opsional)</Label>
            <Textarea
              value={form.explanation}
              onChange={(e) =>
                setForm((f) => ({ ...f, explanation: e.target.value }))
              }
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}