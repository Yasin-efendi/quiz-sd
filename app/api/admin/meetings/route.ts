import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { meetingSchema } from '@/lib/validations/meeting'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('meetings')
      .select(`
        *,
        subjects ( name )
      `)
      .order('meeting_number')

    if (error) throw error

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Gagal mengambil data pertemuan' },
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
    const parsed = meetingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('meetings')
      .insert(parsed.data)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Gagal menambah pertemuan' },
      { status: 500 }
    )
  }
}