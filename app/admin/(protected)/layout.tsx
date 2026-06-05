import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-gray-800">
            🎓 Quiz SD — Admin
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/admin/subjects" className="text-gray-600 hover:text-gray-900">Pelajaran</Link>
            <Link href="/admin/meetings" className="text-gray-600 hover:text-gray-900">Pertemuan</Link>
            <Link href="/admin/questions" className="text-gray-600 hover:text-gray-900">Bank Soal</Link>
            <Link href="/admin/attempts" className="text-gray-600 hover:text-gray-900">Riwayat</Link>
          </div>
        </div>
        <Link href="/api/auth/signout">
          <Button variant="outline" size="sm">Logout</Button>
        </Link>
      </nav>
      <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    </div>
  )
}