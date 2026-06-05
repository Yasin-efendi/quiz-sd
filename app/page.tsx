import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Meeting {
  id: string
  meeting_number: number
  title: string
  slug: string
  description: string | null
}

interface Subject {
  id: string
  name: string
  slug: string
  meetings: Meeting[]
}

async function getSubjects(): Promise<Subject[]> {
  const res = await fetch('http://localhost:3000/api/quiz', {
    cache: 'no-store',
  })
  if (!res.ok) return []
  const json = await res.json()
  return json.data ?? []
}

export default async function Home() {
  const subjects = await getSubjects()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quiz SD</h1>
        <p className="text-gray-500 mt-2">
          Pilih pelajaran dan mulai berlatih soal
        </p>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-gray-400">
            Belum ada pelajaran tersedia
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  📚 {subject.name}
                  <Badge variant="outline">
                    {subject.meetings.length} pertemuan
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subject.meetings.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    Belum ada pertemuan
                  </p>
                ) : (
                  <Accordion defaultValue={[]}>
                    {subject.meetings.map((meeting) => (
                      <AccordionItem
                        key={meeting.id}
                        value={meeting.id}
                      >
                        <AccordionTrigger className="text-sm">
                          Pertemuan {meeting.meeting_number} —{' '}
                          {meeting.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-1">
                            {meeting.description && (
                              <p className="text-sm text-gray-500">
                                {meeting.description}
                              </p>
                            )}
                            <Link href={`/quiz/${meeting.slug}`}>
                              <Button size="sm" className="w-full">
                                Mulai Kuis →
                              </Button>
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}