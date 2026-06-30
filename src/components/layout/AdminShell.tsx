import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  ShieldCheck,
  ListTree,
  Users,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react'
import type { ReactNode } from 'react'

// Avoid importing from route.tsx to prevent a circular import
// (route.tsx renders AdminShell). Mirrors clearToken() in route.tsx —
// if that logic changes, update both places.
const AUTH_KEY = 'admin_token'
function clearToken() {
  localStorage.removeItem(AUTH_KEY)
  document.cookie = `${AUTH_KEY}=; Max-Age=0; path=/`
}

// ---------------------------------------------------------------------------
// Design tokens — shared with dashboard.tsx. Keep these in sync, or better,
// move both to a single `lib/tokens.ts` later.
// ---------------------------------------------------------------------------
export const tokens = {
  ink: '#16233D',
  paper: '#F6F3EC',
  brass: '#B8863F',
  teal: '#225C57',
  line: '#E4DECF',
}

export type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  to: string
  match: string // prefix used to decide "active" state
  children?: { label: string; to: string }[]
}

export const NAV: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/admin/dashboard',
    match: '/admin/dashboard',
  },
  {
    label: 'ข่าวประชาสัมพันธ์',
    icon: Megaphone,
    to: '/admin/news/news/summary',
    match: '/admin/news',
    children: [
      { label: 'รายการข่าว', to: '/admin/news/news/summary' },
      { label: 'เพิ่มข่าว', to: '/admin/news' },
    ],
  },
  {
    label: 'กิจกรรม',
    icon: Calendar,
    to: '/admin/activity/activity/summary',
    match: '/admin/activity',
    children: [
      { label: 'รายการกิจกรรม', to: '/admin/activity/activity/summary' },
      { label: 'เพิ่มกิจกรรม', to: '/admin/activity' },
    ],
  },
  {
    label: 'ITA',
    icon: ShieldCheck,
    to: '/admin/ITA',
    match: '/',
    children: [
      { label: 'รายการเอกสาร', to: '/admin/ITA' },
      { label: 'ปีงบประมาณ', to: '' },
    ],
  },
  {
    label: 'บุคลากร',
    icon: Users,
    to: '/admin/dashboard',
    match: '/',
    children: [
      { label: 'รายชื่อบุคลากร', to: '' },
      { label: 'เพิ่มบุคลากร', to: '' },
    ],
  },
  {
    label: 'ตั้งค่าระบบ',
    icon: Settings,
    to: '/admin/employee/staffservice/summary',
    match: '/admin/employee/usermanetmint',
    children: [
      { label: 'ข้อมูลผู้ใช้งาน', to: '/admin/employee/staffservice/summary' },
      { label: 'จัดการสิทธิ์ผู้ใช้งาน', to: '/admin/employee/usermanetmint' },
    ],
  },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    clearToken()
    navigate({ to: '/admin/login', replace: true })
  }

  const currentSection = NAV.find((item) => location.pathname.startsWith(item.match))

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: tokens.paper, color: tokens.ink }}>
      {/* ---------------------------------------------------------------- */}
      {/* Sidebar */}
      {/* ---------------------------------------------------------------- */}
      <aside
        className="hidden md:flex md:flex-col w-64 shrink-0 border-r"
        style={{ borderColor: tokens.line, backgroundColor: tokens.paper }}
      >
        {/* Logo / org name */}
        <div className="h-20 flex items-center gap-3 px-6 border-b" style={{ borderColor: tokens.line }}>
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: tokens.ink }}
          >
            รส
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-sm font-semibold tracking-tight truncate">โรงพยาบาลสะเมิง</p>
            <p className="text-[11px] uppercase tracking-[0.14em] truncate" style={{ color: tokens.brass }}>
              ระบบจัดการภายใน
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const isActive = location.pathname.startsWith(item.match)

              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="relative flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-sm text-sm transition-colors"
                    style={{
                      color: isActive ? tokens.ink : '#5B6577',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                        style={{ backgroundColor: tokens.teal }}
                      />
                    )}
                    <item.icon
                      className="w-[18px] h-[18px] shrink-0"
                      style={{ color: isActive ? tokens.teal : '#8B93A1' }}
                    />
                    <span>{item.label}</span>
                  </Link>

                  {/* Sub-items reveal automatically when this section is active —
                      no separate expand/collapse click required. */}
                  {item.children && isActive && (
                    <ul className="mt-1 mb-1 ml-[29px] pl-3 space-y-0.5 border-l" style={{ borderColor: tokens.line }}>
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.to
                        return (
                          <li key={child.to}>
                            <Link
                              to={child.to}
                              className="block px-3 py-1.5 rounded-sm text-[13px] transition-colors"
                              style={{
                                color: isChildActive ? tokens.teal : '#7A8294',
                                fontWeight: isChildActive ? 600 : 400,
                              }}
                            >
                              {child.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout, pinned bottom */}
        <div className="p-3 border-t" style={{ borderColor: tokens.line }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors hover:text-white"
            style={{ color: '#5B6577' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A3382F')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut className="w-4.5 h-4.5" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Main column: topbar + page content */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-10 h-20 border-b backdrop-blur-sm flex items-center justify-between px-6"
          style={{ borderColor: tokens.line, backgroundColor: `${tokens.paper}E6` }}
        >
          <div className="md:hidden font-semibold">โรงพยาบาลสะเมิง</div>
          <div className="hidden md:flex items-center gap-2 text-sm" style={{ color: '#5B6577' }}>
            {currentSection && (
              <>
                <currentSection.icon className="w-4 h-4" style={{ color: tokens.brass }} />
                <span style={{ color: tokens.ink, fontWeight: 600 }}>{currentSection.label}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              className="relative w-9 h-9 rounded-sm flex items-center justify-center transition-colors"
              style={{ color: '#5B6577' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label="การแจ้งเตือน"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: tokens.brass }}
              />
            </button>
            <div className="flex items-center gap-2.5 pl-2 border-l" style={{ borderColor: tokens.line }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: tokens.ink }}
              >
                A
              </div>
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-[11px]" style={{ color: '#8B93A1' }}>
                  ผู้ดูแลระบบ
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}