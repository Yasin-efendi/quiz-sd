'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Subject {
  id: string
  name: string
  slug: string
  created_at: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Subject | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadSubjects() {
    const res = await fetch('/api/admin/subjects')
    const json = await res.json()
    setSubjects(json.data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadSubjects() }, [])

  function openAdd() {
    setEditTarget(null)
    setName('')
    setSlug('')
    setError('')
    setDialogOpen(true)
  }

  function openEdit(subject: Subject) {
    setEditTarget(subject)
    setName(subject.name)
    setSlug(subject.slug)
    setError('')
    setDialogOpen(true)
  }

  function handleNameChange(value: string) {
    setName(value)
    if (!editTarget) {
      setSlug(
        value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      )
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const url = editTarget
      ? `/api/admin/subjects/${editTarget.id}`
      : '/api/admin/subjects'
    const method = editTarget ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    })
    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Gagal menyimpan')
      setSaving(false)
      return
    }

    setDialogOpen(false)
    loadSubjects()
    setSaving(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus pelajaran "${name}"? Semua pertemuan dan soal di dalamnya akan ikut terhapus.`)) return
    await fetch(`/api/admin/subjects/${id}`, { method: 'DELETE' })
    loadSubjects()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manajemen Pelajaran</h1>
        <Button onClick={openAdd}>+ Tambah Pelajaran</Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-center text-gray-400 py-8">Memuat...</p>
          ) : subjects.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Belum ada pelajaran
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-2 pr-4">Nama</th>
                  <th className="text-left py-2 pr-4">Slug</th>
                  <th className="text-right py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{subject.name}</td>
                    <td className="py-3 pr-4 text-gray-500">{subject.slug}</td>
                    <td className="py-3 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(subject)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(subject.id, subject.name)}
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
              {editTarget ? 'Edit Pelajaran' : 'Tambah Pelajaran'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>Nama Pelajaran</Label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="contoh: Bahasa Indonesia"
              />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="contoh: bahasa-indonesia"
              />
              <p className="text-xs text-gray-400">
                Huruf kecil, angka, dan tanda - saja
              </p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
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