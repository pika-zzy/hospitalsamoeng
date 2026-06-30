import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Users,
  FileText,
  Calendar,
  ChevronRight,
 
  ArrowUp,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { requestAPI } from '@/lib/api'
import type { NewsInfo } from '@/interface/newinfo'
import type { SystemUser } from '@/interface/user'
import type ActivityInfo from '@/interface/activity_info'

export const Route = createFileRoute('/_admin/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: newsData } = useQuery<NewsInfo[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const resp = await requestAPI<NewsInfo[]>({ method: 'GET', url: '/news' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: activityData } = useQuery<ActivityInfo[]>({
    queryKey: ['activity'],
    queryFn: async () => {
      const resp = await requestAPI<ActivityInfo[]>({ method: 'GET', url: '/activities' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: usersData } = useQuery<SystemUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const resp = await requestAPI<SystemUser[]>({ method: 'GET', url: '/users' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const totalNews = newsData?.length || 0
  const totalActivities = activityData?.length || 0
  const totalUsers = usersData?.length || 0

  // NOTE: growth (% จากเดือนที่แล้ว) is not yet provided by the backend.
  // These are placeholder values only, clearly marked, until a real
  // "previous period" figure is available from the API.
  // accent carries Tailwind class names (not raw hex) so the cards stay on the
  // theme tokens defined in index.css.
  const stats = [
    {
      label: 'ข่าวทั้งหมด',
      sub: 'ข่าวเผยแพร่แล้ว',
      value: totalNews,
      growth: 12, // placeholder
      icon: FileText,
      accentText: 'text-teal',
      accentBg: 'bg-teal/10',
      to: '/admin/news/news/summary',
    },
    {
      label: 'กิจกรรมทั้งหมด',
      sub: 'กิจกรรมที่เผยแพร่แล้ว',
      value: totalActivities,
      growth: 8, // placeholder
      icon: Calendar,
      accentText: 'text-brass',
      accentBg: 'bg-brass/10',
      to: '/admin/activity/activity/summary',
    },
    {
      label: 'ผู้ใช้งานในระบบ',
      sub: 'บัญชีผู้ใช้ในระบบ',
      value: totalUsers,
      growth: 3, // placeholder
      icon: Users,
      accentText: 'text-violet',
      accentBg: 'bg-violet/10',
      to: '/admin/employee/staffservice/summary',
    },
  ]

  return (
    // NOTE: outer <div> with min-h-screen/header/logout removed — the page
    // is now rendered inside <AdminShell> (see routes/_admin/route.tsx),
    // which owns the sidebar + topbar shell. This file only renders its
    // own page content from here down.
    <div className="px-6 py-10 max-w-6xl mx-auto w-full text-ink">
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">ภาพรวมระบบ</h1>
        <p className="text-sm mt-1 text-muted">
          จัดการข่าวสารและกิจกรรมทั้งหมดได้จากที่นี่
        </p>
      </div>

      {/* Stats — icon-circle cards with growth indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group p-6 rounded-md border border-line bg-white transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${s.accentBg}`}>
                <s.icon className={`w-5 h-5 ${s.accentText}`} />
              </div>
            </div>

            <p className="text-xs text-faint">
              {s.label}
            </p>
            <p className="text-3xl font-semibold mt-1 tabular-nums">
              {isNaN(s.value) ? '0' : s.value}
            </p>

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-faint">
                {s.sub}
              </p>
              <span className="flex items-center gap-0.5 text-xs font-medium text-teal">
                <ArrowUp className="w-3 h-3" />
                {s.growth}%
              </span>
            </div>

            <div className={`mt-3 flex items-center text-xs font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${s.accentText}`}>
              ดูทั้งหมด
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}