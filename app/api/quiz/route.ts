import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        id,
        name,
        slug,
        meetings (
          id,
          meeting_number,
          title,
          slug,
          description
        )
      `)
      .order('name')

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data' },
      { status: 500 }
    )
  }
}