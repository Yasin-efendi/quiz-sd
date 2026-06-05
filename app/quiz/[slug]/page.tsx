'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import QuestionCard from '@/components/quiz/QuestionCard'
import QuizNavigation from '@/components/quiz/QuizNavigation'

interface Question {
  id: string
  question_text: string
  image_url?: string | null
  options: string[]
}

interface Meeting {
  id: string
  title: string
  slug: string
  description: string | null
}

type PageState = 'name-input' | 'quiz' | 'submitting'

export default function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [pageState, setPageState] = useState<PageState>('name-input')
  const [studentName, setStudentName] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug)
      fetch(`/api/quiz/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error)
          } else {
            setMeeting(data.meeting)
            setQuestions(data.questions)
            setAnswers(new Array(data.questions.length).fill(null))
          }
          setLoading(false)
        })
        .catch(() => {
          setError('Gagal memuat soal')
          setLoading(false)
        })
    })
  }, [params])

  function handleStartQuiz(e: React.FormEvent) {
    e.preventDefault()
    if (!studentName.trim()) return
    setPageState('quiz')
  }

  function handleSelectAnswer(index: number) {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = index
    setAnswers(newAnswers)
  }

  async function handleSubmit() {
    setPageState('submitting')
    try {
      const res = await fetch(`/api/quiz/${slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName,
          answers: answers.map((a) => a ?? 0),
        }),
      })
      const data = await res.json()
      if (data.token) {
        router.push(`/result/${data.token}`)
      } else {
        setError(data.error ?? 'Gagal mengirim jawaban')
        setPageState('quiz')
      }
    } catch {
      setError('Gagal mengirim jawaban')
      setPageState('quiz')
    }
  }

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Memuat soal...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </main>
    )
  }

  // Halaman input nama
  if (pageState === 'name-input') {
    return (
      <main className="max-w-md mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{meeting?.title}</CardTitle>
            {meeting?.description && (
              <p className="text-sm text-gray-500 text-center">
                {meeting.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartQuiz} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama kamu"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-gray-500 text-center">
                {questions.length} soal • Jawab semua soal sebelum mengumpulkan
              </div>
              <Button type="submit" className="w-full">
                Mulai Kuis →
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  }

  // Halaman kuis
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <div className="text-center">
        <h1 className="text-lg font-semibold">{meeting?.title}</h1>
        <p className="text-sm text-gray-500">Halo, {studentName}!</p>
      </div>

      <QuestionCard
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        questionText={questions[currentIndex].question_text}
        imageUrl={questions[currentIndex].image_url}
        options={questions[currentIndex].options}
        selectedAnswer={answers[currentIndex]}
        onSelectAnswer={handleSelectAnswer}
      />

      <QuizNavigation
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        answers={answers}
        onPrev={() => setCurrentIndex((i) => i - 1)}
        onNext={() => setCurrentIndex((i) => i + 1)}
        onSubmit={handleSubmit}
        isSubmitting={pageState === 'submitting'}
      />
    </main>
  )
}