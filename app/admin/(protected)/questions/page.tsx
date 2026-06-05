import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabaseAdmin } from '@/lib/supabase/server'
import DeleteButton from '@/components/admin/DeleteButton'

async function getQuestions() {
  const { data } = await supabaseAdmin
    .from('questions')
    .select('*, meetings(title)')
    .order('created_at')
  return data ?? []
}

export default async function QuestionsPage() {
  const questions = await getQuestions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bank Soal</h1>
        <Link href="/admin/questions/add">
          <Button>+ Tambah Soal</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-4">
          {questions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Belum ada soal</p>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <span className="text-gray-400 text-sm w-6 shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {question.question_text}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {question.meetings?.title}
                    </Badge>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/admin/questions/edit/${question.id}`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <DeleteButton id={question.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}