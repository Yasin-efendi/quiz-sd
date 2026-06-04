import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { verifyToken } from '@/lib/token'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Token tidak valid atau sudah kadaluarsa' },
        { status: 401 }
      )
    }

    const { data: questions, error: questionsError } = await supabase
      .from('meetings')
      .select(`
        title,
        questions (
          id,
          question_text,
          image_url,
          options,
          correct_answer,
          explanation
        )
      `)
      .eq('slug', payload.meeting_slug)
      .single()

    if (questionsError || !questions) {
      return NextResponse.json(
        { error: 'Data soal tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      student_name: payload.student_name,
      meeting_title: questions.title,
      score: payload.score,
      total_questions: payload.total_questions,
      answers: payload.answers,
      questions: questions.questions,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil hasil kuis' },
      { status: 500 }
    )
  }
}