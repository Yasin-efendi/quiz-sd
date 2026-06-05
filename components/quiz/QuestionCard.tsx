import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface Option {
  label: string
  text: string
}

interface QuestionCardProps {
  questionNumber: number
  totalQuestions: number
  questionText: string
  imageUrl?: string | null
  options: string[]
  selectedAnswer: number | null
  onSelectAnswer: (index: number) => void
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  imageUrl,
  options,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Soal {questionNumber} / {totalQuestions}
          </Badge>
        </div>
        <CardTitle className="text-base font-medium leading-relaxed mt-2">
          {questionText}
        </CardTitle>
        {imageUrl && (
          <div className="mt-3 flex justify-center">
            <img
              src={imageUrl}
              alt={`Gambar soal ${questionNumber}`}
              className="max-h-48 object-contain rounded-md border"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center gap-3
                ${
                  selectedAnswer === index
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${
                    selectedAnswer === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {OPTION_LABELS[index]}
              </span>
              <span>{option}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}