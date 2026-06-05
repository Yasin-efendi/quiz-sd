'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface Subject {
  id: string
  name: string
}

interface Meeting {
  id: string
  subject_id: string
  meeting_number: number
  title: string
  slug: string
  description: string | null
  subjects: { name: string }
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Meeting | null>(null)
  const [form, setForm] = useState({
    subject_id: '',
    meeting_number: 1,
    title: '',
    slug: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadData() {
    const [mRes, sRes] = await Promise.all([
      fetch('/api/admin/meetings'),
      fetch('/api/admin/subjects'),
    ])
    const [mJson, sJson] = await Promise.all([mRes.json(), sRes.json()])
    setMeetings(mJson.data ?? [])
    setSubjects(sJson.data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  function openAdd() {
    setEditTarget(null)
    setForm({ subject_id: '', meeting_number: 1, title: '', slug: '', description: '' })
    setError('')
    setDialogOpen(true)
  }

  function openEdit(meeting: Meeting) {
    setEditTarget(meeting)
    setForm({
      subject_id: meeting.subject_id,
      meeting_number: meeting.meeting_number,
      title: meeting.title,
      slug: meeting.slug,
      description: meeting.description ?? '',
    })
    setError('')
    setDialogOpen(true)
  }

  function handleTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: !editTarget
        ? value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
        : f.slug,
    }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const url = editTarget
      ? `/api/admin/meetings/${editTarget.id}`
      : '/api/admin/meetings'
    const method = editTarget ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        meeting_number: Number(form.meeting_number),
      }),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Gagal menyimpan')
      setSaving(false)
      return
    }

    setDialogOpen(false)
    loadData()
    setSaving(false)
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus pertemuan "${title}"?`)) return
    await fetch(`/api/admin/meetings/${id}`, { method: 'DELETE' })
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manajemen Pertemuan</h1>
        <Button onClick={openAdd}>+ Tambah Pertemuan</Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Memuat...</p>
          ) : meetings.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Belum ada pertemuan</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-2 pr-4">Pelajaran</th>
                  <th className="text-left py-2 pr-4">No</th>
                  <th className="text-left py-2 pr-4">Judul</th>
                  <th className="text-left py-2 pr-4">Slug</th>
                  <th className="text-right py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((meeting) => (
                  <tr key={meeting.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 text-gray-500">
                      {meeting.subjects?.name}
                    </td>
                    <td className="py-3 pr-4">{meeting.meeting_number}</td>
                    <td className="py-3 pr-4 font-medium">{meeting.title}</td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">
                      {meeting.slug}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(meeting)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(meeting.id, meeting.title)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTarget ? 'Edit Pertemuan' : 'Tambah Pertemuan'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>Pelajaran</Label>
              <Select
                value={form.subject_id}
                onValueChange={(v) => setForm((f) => ({ ...f, subject_id: v ?? '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Nomor Pertemuan</Label>
              <Input
                type="number"
                min={1}
                value={form.meeting_number}
                onChange={(e) =>
                  setForm((f) => ({ ...f, meeting_number: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Judul</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="contoh: Ujian Sekolah - Latihan 2"
              />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="contoh: bahasa-inggris-ujian-2"
              />
            </div>
            <div className="space-y-1">
              <Label>Deskripsi (opsional)</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Deskripsi singkat pertemuan ini"
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}