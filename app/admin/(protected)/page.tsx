import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabaseAdmin } from '@/lib/supabase/server'

async function getStats() {
  const [subjects, meetings, questions, attempts] = await Promise.all([
    supabaseAdmin.from('subjects').select('id', { count: 'exact' }),
    supabaseAdmin.from('meetings').select('id', { count: 'exact' }),
    supabaseAdmin.from('questions').select('id', { count: 'exact' }),
    supabaseAdmin.from('quiz_attempts').select('id', { count: 'exact' }),
  ])

  return {
    subjects: subjects.count ?? 0,
    meetings: meetings.count ?? 0,
    questions: questions.count ?? 0,
    attempts: attempts.count ?? 0,
  }
}

async function getRecentAttempts() {
  const { data } = await supabaseAdmin
    .from('quiz_attempts')
    .select('id, student_name, meeting_slug, score, total_questions, completed_at')
    .order('completed_at', { ascending: false })
    .limit(5)
  return data ?? []
}

export default async function AdminDashboard() {
  const [stats, recentAttempts] = await Promise.all([
    getStats(),
    getRecentAttempts(),
  ])

  const statCards = [
    { label: 'Total Pelajaran', value: stats.subjects, icon: '📚' },
    { label: 'Total Pertemuan', value: stats.meetings, icon: '📅' },
    { label: 'Total Soal', value: stats.questions, icon: '❓' },
    { label: 'Total Attempt', value: stats.attempts, icon: '✍️' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 font-normal">
                {stat.icon} {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent attempts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">5 Attempt Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttempts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
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
                    <th className="text-left py-2">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">
                        {attempt.student_name}
                      </td>
                      <td className="py-2 pr-4 text-gray-500">
                        {attempt.meeting_slug}
                      </td>
                      <td className="py-2 pr-4 text-center">
                        <span className="font-medium text-blue-600">
                          {attempt.score}/{attempt.total_questions}
                        </span>
                      </td>
                      <td className="py-2 text-gray-400">
                        {new Date(attempt.completed_at).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}