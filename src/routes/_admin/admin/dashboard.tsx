import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Users,
  FileText,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { requestAPI } from '@/lib/api'
import type { NewsInfo } from '@/interface/newinfo'
import type { SystemUser } from '@/interface/user'
import type ActivityInfo from '@/interface/activity_info'

export const Route = createFileRoute('/_admin/admin/dashboard')({
  component: RouteComponent,
})

// format วันที่เป็นภาษาไทย (มี guard กรณี date ว่าง/ไม่ valid) — เหมือนหน้า summary
function formatThaiDate(value: string): string {
  if (!value) return '-'
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : d.toLocaleDateString('th-TH')
}

function RouteComponent() {
  const { data: newsData, isLoading: loadingNews } = useQuery<NewsInfo[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const resp = await requestAPI<NewsInfo[]>({ method: 'GET', url: '/news' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const { data: activityData, isLoading: loadingActivity } = useQuery<ActivityInfo[]>({
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

  // 5 รายการล่าสุด — sort ตามวันที่ (ข่าว: date, กิจกรรม: start_date) จากใหม่ไปเก่า
  const recentNews = [...(newsData ?? [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
  const recentActivities = [...(activityData ?? [])]
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    .slice(0, 5)

  // NOTE: accent carries Tailwind class names (not raw hex) so the cards stay
  // on the theme tokens defined in index.css.
  const stats = [
    {
      label: 'ข่าวทั้งหมด',
      sub: 'ข่าวเผยแพร่แล้ว',
      value: totalNews,
      icon: FileText,
      accentText: 'text-teal',
      accentBg: 'bg-teal/10',
      to: '/admin/news/news/summary',
    },
    {
      label: 'กิจกรรมทั้งหมด',
      sub: 'กิจกรรมที่เผยแพร่แล้ว',
      value: totalActivities,
      icon: Calendar,
      accentText: 'text-brass',
      accentBg: 'bg-brass/10',
      to: '/admin/activity/activity/summary',
    },
    {
      label: 'ผู้ใช้งานในระบบ',
      sub: 'บัญชีผู้ใช้ในระบบ',
      value: totalUsers,
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

            <p className="text-xs text-faint mt-2">
              {s.sub}
            </p>

            <div className={`mt-3 flex items-center text-xs font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${s.accentText}`}>
              ดูทั้งหมด
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent lists — ข่าว/กิจกรรมล่าสุด 5 รายการ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ข่าวล่าสุด */}
        <section className="rounded-md border border-line bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal" />
              ข่าวล่าสุด
            </h2>
            <Link
              to="/admin/news/news/summary"
              className="text-xs font-medium text-teal flex items-center gap-0.5 hover:underline"
            >
              ดูทั้งหมด
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingNews ? (
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="h-9 rounded-sm bg-line/60 animate-pulse" />
              ))}
            </ul>
          ) : recentNews.length === 0 ? (
            <p className="text-xs text-faint py-6 text-center">ยังไม่มีข่าวในระบบ</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentNews.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-sm truncate">{n.title}</span>
                  <span className="text-xs text-faint tabular-nums shrink-0">
                    {formatThaiDate(n.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* กิจกรรมล่าสุด */}
        <section className="rounded-md border border-line bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brass" />
              กิจกรรมล่าสุด
            </h2>
            <Link
              to="/admin/activity/activity/summary"
              className="text-xs font-medium text-brass flex items-center gap-0.5 hover:underline"
            >
              ดูทั้งหมด
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingActivity ? (
            <ul className="space-y-3">
              {[1, 2, 3].map((i) => (
                <li key={i} className="h-9 rounded-sm bg-line/60 animate-pulse" />
              ))}
            </ul>
          ) : recentActivities.length === 0 ? (
            <p className="text-xs text-faint py-6 text-center">ยังไม่มีกิจกรรมในระบบ</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentActivities.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-sm truncate">{a.title}</span>
                  <span className="text-xs text-faint tabular-nums shrink-0">
                    {formatThaiDate(a.start_date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}