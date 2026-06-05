import { Button } from '@/components/ui/button'

interface QuizNavigationProps {
  currentIndex: number
  totalQuestions: number
  answers: (number | null)[]
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export default function QuizNavigation({
  currentIndex,
  totalQuestions,
  answers,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting,
}: QuizNavigationProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalQuestions - 1
  const answeredCount = answers.filter((a) => a !== null).length
  const allAnswered = answeredCount === totalQuestions

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex flex-wrap gap-2 justify-center">
        {answers.map((answer, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
              ${
                index === currentIndex
                  ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                  : answer !== null
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500">
        {answeredCount} dari {totalQuestions} soal dijawab
      </p>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirst}
          className="flex-1"
        >
          ← Sebelumnya
        </Button>

        {isLast ? (
          <Button
            onClick={onSubmit}
            disabled={!allAnswered || isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Mengirim...' : 'Kumpulkan Jawaban'}
          </Button>
        ) : (
          <Button onClick={onNext} className="flex-1">
            Selanjutnya →
          </Button>
        )}
      </div>

      {isLast && !allAnswered && (
        <p className="text-center text-sm text-red-500">
          Jawab semua soal sebelum mengumpulkan
        </p>
      )}
    </div>
  )
}