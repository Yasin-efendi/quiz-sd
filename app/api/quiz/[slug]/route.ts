import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('id, title, slug, description')
      .eq('slug', slug)
      .single()

    if (meetingError || !meeting) {
      return NextResponse.json(
        { error: 'Pertemuan tidak ditemukan' },
        { status: 404 }
      )
    }

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, question_text, image_url, options')
      .eq('meeting_id', meeting.id)
      .order('created_at')

    if (questionsError) throw questionsError

    return NextResponse.json({ meeting, questions })
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil soal' },
      { status: 500 }
    )
  }
}