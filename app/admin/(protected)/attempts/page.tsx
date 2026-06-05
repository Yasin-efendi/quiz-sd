import { Card, CardContent } from '@/components/ui/card'
import { supabaseAdmin } from '@/lib/supabase/server'

async function getAttempts() {
  const { data } = await supabaseAdmin
    .from('quiz_attempts')
    .select('*')
    .order('completed_at', { ascending: false })
  return data ?? []
}

export default async function AttemptsPage() {
  const attempts = await getAttempts()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Riwayat Attempt</h1>

      <Card>
        <CardContent className="pt-4">
          {attempts.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Belum ada attempt
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="text-left py-2 pr-4">Nama Siswa</th>
                    <th className="text-left py-2 pr-4">Pertemuan</th>
                    <th className="text-center py-2 pr-4">Skor</th>
                    <th className="text-center py-2 pr-4">Nilai</th>
                    <th className="text-left py-2">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => {
                    const percentage = Math.round(
                      (attempt.score / attempt.total_questions) * 100
                    )
                    return (
                      <tr key={attempt.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium">
                          {attempt.student_name}
                        </td>
                        <td className="py-3 pr-4 text-gray-500">
                          {attempt.meeting_slug}
                        </td>
                        <td className="py-3 pr-4 text-center">
                          {attempt.score}/{attempt.total_questions}
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span
                            className={`font-medium ${
                              percentage >= 70
                                ? 'text-green-600'
                                : 'text-red-500'
                            }`}
                          >
                            {percentage}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400">
                          {new Date(attempt.completed_at).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}