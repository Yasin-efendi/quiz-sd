import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { submitQuizSchema } from '@/lib/validations/quiz'
import { createToken } from '@/lib/token'
import { calculateScore } from '@/lib/utils'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const parsed = submitQuizSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { student_name, answers } = parsed.data

    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('id, slug')
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
      .select('correct_answer')
      .eq('meeting_id', meeting.id)
      .order('created_at')

    if (questionsError || !questions) throw questionsError

    const correctAnswers = questions.map((q) => q.correct_answer)
    const score = calculateScore(answers, correctAnswers)

    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from('quiz_attempts')
      .insert({
        student_name,
        meeting_slug: slug,
        score,
        total_questions: questions.length,
        answers,
      })
      .select('id')
      .single()

    if (attemptError || !attempt) throw attemptError

    const token = createToken({
      meeting_slug: slug,
      student_name,
      answers,
      score,
      total_questions: questions.length,
      attempt_id: attempt.id,
    })

    await supabaseAdmin
      .from('quiz_attempts')
      .update({ token })
      .eq('id', attempt.id)

    return NextResponse.json({ token })
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menyimpan jawaban' },
      { status: 500 }
    )
  }
}