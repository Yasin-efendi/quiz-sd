import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { subjectSchema } from '@/lib/validations/subject'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = subjectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('subjects')
      .update(parsed.data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Gagal mengubah pelajaran' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { error } = await supabaseAdmin
      .from('subjects')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Pelajaran berhasil dihapus' })
  } catch {
    return NextResponse.json(
      { error: 'Gagal menghapus pelajaran' },
      { status: 500 }
    )
  }
}