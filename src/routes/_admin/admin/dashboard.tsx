import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Users,
  FileText,
  Calendar,
  Megaphone,
  ChevronRight,
  Settings,
  ShieldCheck,
  ArrowUp,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { requestAPI } from '@/lib/api'
import type { NewsInfo } from '@/interface/newinfo'
import type { } from '@/interface/activity_info'
import type { System } from '@/interface/staff_info'
import type ActivityInfo from '@/interface/activity_info'

export const Route = createFileRoute('/_admin/admin/dashboard')({
  component: RouteComponent,
})

// ---------------------------------------------------------------------------
// Design tokens
// Civic / public-service identity: deep ink-navy + warm brass accent on a
// warm paper background. Distinct from the generic blue-card admin look —
// reads like an official register rather than a SaaS template.
// ---------------------------------------------------------------------------
const tokens = {
  ink: '#16233D',      // primary text / nav
  paper: '#F6F3EC',    // page background, warm paper
  brass: '#B8863F',    // accent — used sparingly
  teal: '#225C57',     // secondary accent
  line: '#E4DECF',     // hairline dividers
}

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

  const { data: staffData } = useQuery<System[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      const resp = await requestAPI<System[]>({ method: 'GET', url: '/staff' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const totalNews = newsData?.length || 0
  const totalActivities = activityData?.length || 0
  const totalStaff = staffData?.length || 0

  // NOTE: growth (% จากเดือนที่แล้ว) is not yet provided by the backend.
  // These are placeholder values only, clearly marked, until a real
  // "previous period" figure is available from the API.
  const stats = [
    {
      label: 'ข่าวทั้งหมด',
      sub: 'ข่าวเผยแพร่แล้ว',
      value: totalNews,
      growth: 12, // placeholder
      icon: FileText,
      accent: tokens.teal,
      to: '/admin/news/news/summary',
    },
    {
      label: 'กิจกรรมทั้งหมด',
      sub: 'กิจกรรมที่เผยแพร่แล้ว',
      value: totalActivities,
      growth: 8, // placeholder
      icon: Calendar,
      accent: tokens.brass,
      to: '/admin/activity/activity/summary',
    },
    {
      label: 'เจ้าหน้าที่ทั้งหมด',
      sub: 'บุคลากรในระบบ',
      value: totalStaff,
      growth: 3, // placeholder
      icon: Users,
      accent: '#6B5B95',
      to: '/admin/employee/staffservice/summary',
    },
  ]
/*
  const actions = [
    {
      to: '/admin/news',
      icon: Megaphone,
      title: 'เพิ่มข่าวประชาสัมพันธ์',
      desc: 'ประกาศข่าว จัดซื้อจัดจ้าง หรือแจ้งเตือนต่างๆ',
      cta: 'สร้างโพสต์ใหม่',
      mark: '01',
    },
    {
      to: '/admin/activity',
      icon: Calendar,
      title: 'เพิ่มกิจกรรมใหม่',
      desc: 'ลงรูปกิจกรรม ปฏิทินงาน หรือโครงการ',
      cta: 'สร้างกิจกรรม',
      mark: '02',
    },
    {
      to: '/admin/ITA',
      icon: ShieldCheck,
      title: 'เพิ่มงาน ITA',
      desc: 'เพิ่มงาน ITA เป็นไฟล์ .pdf',
      cta: 'ลงงาน ITA',
      mark: '03',
    },
    {
      to: '/admin/moit',
      icon: Settings,
      title: 'เพิ่มหัวข้อ MOIT',
      desc: 'เพิ่มหัวข้อย่อยของ MOIT',
      cta: 'เพิ่มหัวข้อ MOIT',
      mark: '04',
    },
    {
      to: '/admin/staffservice',
      icon: Users,
      title: 'เพิ่มเมนูสำหรับเจ้าหน้าที่',
      desc: 'เพิ่มเมนูสำหรับแสดงบนระบบบริการเจ้าหน้าที่',
      cta: 'เพิ่มเมนู',
      mark: '05',
    },
  ]
*/
  return (
    // NOTE: outer <div> with min-h-screen/header/logout removed — the page
    // is now rendered inside <AdminShell> (see routes/_admin/route.tsx),
    // which owns the sidebar + topbar shell. This file only renders its
    // own page content from here down.
    <div className="px-6 py-10 max-w-6xl mx-auto w-full" style={{ color: tokens.ink }}>
      {/* Title */}
      <div className="mb-10 flex items-baseline gap-4">
        <span className="text-5xl font-light" style={{ color: tokens.line }}>
          §
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ภาพรวมระบบ</h1>
          <p className="text-sm mt-1" style={{ color: '#5B6577' }}>
            จัดการข่าวสารและกิจกรรมทั้งหมดได้จากที่นี่
          </p>
        </div>
      </div>

      {/* Stats — icon-circle cards with growth indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group p-6 rounded-md border transition-colors"
            style={{ borderColor: tokens.line, backgroundColor: '#FFFFFF' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${s.accent}1A` }}
              >
                <s.icon className="w-5 h-5" style={{ color: s.accent }} />
              </div>
            </div>

            <p className="text-xs" style={{ color: '#8B93A1' }}>
              {s.label}
            </p>
            <p className="text-3xl font-semibold mt-1 tabular-nums">
              {isNaN(s.value) ? '0' : s.value}
            </p>

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs" style={{ color: '#8B93A1' }}>
                {s.sub}
              </p>
              <span
                className="flex items-center gap-0.5 text-xs font-medium"
                style={{ color: tokens.teal }}
              >
                <ArrowUp className="w-3 h-3" />
                {s.growth}%
              </span>
            </div>

            <div
              className="mt-3 flex items-center text-xs font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: s.accent }}
            >
              ดูทั้งหมด
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: tokens.line }} />
        <span className="text-xs uppercase tracking-[0.14em]" style={{ color: '#8B93A1' }}>
          เมนูจัดการ
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: tokens.line }} />
      </div>
{/*
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-10" style={{ backgroundColor: tokens.line }}>
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group p-6 flex flex-col justify-between min-h-42 transition-colors"
            style={{ backgroundColor: tokens.paper }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = tokens.paper)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-mono tracking-widest"
                  style={{ color: tokens.brass }}
                >
                  {a.mark}
                </span>
                <h3 className="text-base font-semibold">{a.title}</h3>
              </div>
              <a.icon
                className="w-5 h-5 transition-transform group-hover:-translate-y-0.5"
                style={{ color: tokens.ink }}
              />
            </div>
              <p className="text-sm mt-2" style={{ color: '#5B6577' }}>
                {a.desc}
              </p>
            <div
              className="mt-4 flex items-center text-sm font-medium gap-1"
              style={{ color: tokens.teal }}
            >
              {a.cta}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div> */}
    </div>
  )
}