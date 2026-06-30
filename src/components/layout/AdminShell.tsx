import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import { LogOut, Bell } from 'lucide-react'
import type { ReactNode } from 'react'
import { clearToken } from '@/lib/auth'
import { NAV } from './nav'

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    clearToken()
    navigate({ to: '/admin/login', replace: true })
  }

  const currentSection = NAV.find((item) => location.pathname.startsWith(item.match))

  return (
    <div className="min-h-screen flex font-sans bg-paper text-ink">
      {/* ---------------------------------------------------------------- */}
      {/* Sidebar */}
      {/* ---------------------------------------------------------------- */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-line bg-paper">
        {/* Logo / org name */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-line">
          <div className="w-9 h-9 rounded-sm flex items-center justify-center bg-ink text-white font-bold text-sm shrink-0">
            รส
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-sm font-semibold tracking-tight truncate">โรงพยาบาลสะเมิง</p>
            <p className="text-[11px] uppercase tracking-[0.14em] truncate text-brass">
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
                    className={`relative flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-sm text-sm transition-colors ${
                      isActive ? 'text-ink bg-white font-semibold' : 'text-muted font-medium'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-teal" />
                    )}
                    <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-teal' : 'text-faint'}`} />
                    <span>{item.label}</span>
                  </Link>

                  {/* Sub-items reveal automatically when this section is active —
                      no separate expand/collapse click required. */}
                  {item.children && isActive && (
                    <ul className="mt-1 mb-1 ml-[29px] pl-3 space-y-0.5 border-l border-line">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.to
                        return (
                          <li key={child.to}>
                            <Link
                              to={child.to}
                              className={`block px-3 py-1.5 rounded-sm text-[13px] transition-colors ${
                                isChildActive ? 'text-teal font-semibold' : 'text-subtle font-normal'
                              }`}
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
        <div className="p-3 border-t border-line">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-muted transition-colors hover:bg-danger hover:text-white"
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
        <header className="sticky top-0 z-10 h-20 border-b border-line bg-paper/90 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="md:hidden font-semibold">โรงพยาบาลสะเมิง</div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted">
            {currentSection && (
              <>
                <currentSection.icon className="w-4 h-4 text-brass" />
                <span className="text-ink font-semibold">{currentSection.label}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              className="relative w-9 h-9 rounded-sm flex items-center justify-center text-muted transition-colors hover:bg-white"
              aria-label="การแจ้งเตือน"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brass" />
            </button>
            <div className="flex items-center gap-2.5 pl-2 border-l border-line">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-ink text-white text-xs font-semibold">
                A
              </div>
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-[11px] text-faint">
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