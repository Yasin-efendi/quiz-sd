import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ResultDisplay from '@/components/quiz/ResultDisplay'

async function getResult(token: string) {
  const res = await fetch(
    `http://localhost:3000/api/result/${token}`,
    { cache: 'no-store' }
  )
  if (!res.ok) return null
  const json = await res.json()
  if (json.error) return null
  return json
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const result = await getResult(token)

  if (!result) return notFound()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <ResultDisplay
        studentName={result.student_name}
        meetingTitle={result.meeting_title}
        score={result.score}
        totalQuestions={result.total_questions}
        answers={result.answers}
        questions={result.questions}
      />
      <div className="text-center">
        <Link href="/">
          <Button variant="outline">← Kembali ke Daftar Kuis</Button>
        </Link>
      </div>
    </main>
  )
}