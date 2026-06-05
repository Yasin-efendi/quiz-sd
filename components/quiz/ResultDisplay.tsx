import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getScoreMessage } from '@/lib/utils'

interface Question {
  id: string
  question_text: string
  image_url?: string | null
  options: string[]
  correct_answer: number
  explanation?: string | null
}

interface ResultDisplayProps {
  studentName: string
  meetingTitle: string
  score: number
  totalQuestions: number
  answers: number[]
  questions: Question[]
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function ResultDisplay({
  studentName,
  meetingTitle,
  score,
  totalQuestions,
  answers,
  questions,
}: ResultDisplayProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const message = getScoreMessage(percentage)

  return (
    <div className="space-y-6">
      {/* Score card */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{message}</CardTitle>
          <p className="text-gray-500">{studentName}</p>
          <p className="text-sm text-gray-400">{meetingTitle}</p>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {percentage}
          </div>
          <p className="text-gray-500">
            {score} benar dari {totalQuestions} soal
          </p>
          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pembahasan */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Pembahasan</h2>
        {questions.map((question, index) => {
          const userAnswer = answers[index]
          const isCorrect = userAnswer === question.correct_answer

          return (
            <Card
              key={question.id}
              className={`border-l-4 ${
                isCorrect ? 'border-l-green-500' : 'border-l-red-500'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <Badge
                    variant={isCorrect ? 'default' : 'destructive'}
                    className="shrink-0 mt-0.5"
                  >
                    {isCorrect ? '✓ Benar' : '✗ Salah'}
                  </Badge>
                  <p className="text-sm font-medium">{question.question_text}</p>
                </div>
                {question.image_url && (
                  <img
                    src={question.image_url}
                    alt={`Gambar soal ${index + 1}`}
                    className="max-h-32 object-contain rounded mt-2"
                  />
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`px-3 py-2 rounded text-sm flex items-center gap-2
                      ${
                        optIndex === question.correct_answer
                          ? 'bg-green-50 text-green-700 font-medium'
                          : optIndex === userAnswer && !isCorrect
                          ? 'bg-red-50 text-red-700'
                          : 'text-gray-600'
                      }`}
                  >
                    <span className="font-medium">
                      {OPTION_LABELS[optIndex]}.
                    </span>
                    {option}
                    {optIndex === question.correct_answer && (
                      <span className="ml-auto text-green-600 text-xs">
                        ✓ Jawaban benar
                      </span>
                    )}
                    {optIndex === userAnswer && !isCorrect && (
                      <span className="ml-auto text-red-500 text-xs">
                        Jawaban kamu
                      </span>
                    )}
                  </div>
                ))}
                {question.explanation && (
                  <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-blue-700">
                    <span className="font-medium">Pembahasan: </span>
                    {question.explanation}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}