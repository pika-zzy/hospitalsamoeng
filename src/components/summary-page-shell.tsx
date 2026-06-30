import { Link } from '@tanstack/react-router'
import { ChevronRight, LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

const tokens = {
  ink: '#16233D',
  paper: '#F6F3EC',
  brass: '#B8863F',
  line: '#E4DECF',
  muted: '#5B6577',
}

interface Crumb {
  label: string
  to?: string
}

interface SummaryPageShellProps {
  crumbs: Crumb[]
  title: string
  subtitle: string
  mark?: string
  children: React.ReactNode
}

export function SummaryPageShell({ crumbs, title, subtitle, mark = '§', children }: SummaryPageShellProps) {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate({ to: '/admin/login', replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: tokens.paper, color: tokens.ink }}>
      {/* Header — identical to dashboard */}
      <header
        className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{ borderColor: tokens.line, backgroundColor: `${tokens.paper}E6` }}
      >
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: tokens.ink }}
            >
              A
            </div>
            <div className="leading-tight">
              <p className="text-base font-semibold tracking-tight">Admin Portal</p>
              <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: tokens.brass }}>
                ระบบจัดการภายใน
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm hidden sm:inline" style={{ color: tokens.muted }}>
              สวัสดี, Admin
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-sm border transition-colors hover:text-white"
              style={{ borderColor: tokens.line }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A3382F')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ color: tokens.muted }}>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: tokens.line }} />}
              {c.to ? (
                <Link to={c.to} className="hover:underline" style={{ color: i === crumbs.length - 1 ? tokens.ink : tokens.muted }}>
                  {c.label}
                </Link>
              ) : (
                <span style={{ color: tokens.ink, fontWeight: 500 }}>{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Title */}
        <div className="mb-8 flex items-baseline gap-4">
          <span className="text-5xl font-light" style={{ color: tokens.line }}>
            {mark}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm mt-1" style={{ color: tokens.muted }}>
              {subtitle}
            </p>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
