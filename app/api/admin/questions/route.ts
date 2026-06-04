import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { questionSchema } from '@/lib/validations/question'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const meetingId = searchParams.get('meeting_id')

    let query = supabaseAdmin
      .from('questions')
      .select(`
        *,
        meetings ( title )
      `)
      .order('created_at')

    if (meetingId) {
      query = query.eq('meeting_id', meetingId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Gagal mengambil data soal' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = questionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('questions')
      .insert(parsed.data)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Gagal menambah soal' },
      { status: 500 }
    )
  }
}