import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  to?: string
}

interface SummaryPageShellProps {
  crumbs: Crumb[]
  title: string
  subtitle: string
  children: React.ReactNode
  /** Optional action rendered on the same line as the title (e.g. a create button) */
  action?: React.ReactNode
}

// Renders inside <AdminShell> (sidebar + topbar), so it only owns the page
// content — breadcrumbs, title, and children. It must NOT render its own
// header/logout, which would duplicate the AdminShell chrome.
export function SummaryPageShell({ crumbs, title, subtitle, children, action }: SummaryPageShellProps) {
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto w-full text-ink">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs mb-6 text-muted">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3 text-line" />}
            {c.to ? (
              <Link to={c.to} className={`hover:underline ${i === crumbs.length - 1 ? 'text-ink' : 'text-muted'}`}>
                {c.label}
              </Link>
            ) : (
              <span className="text-ink font-medium">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Title */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm mt-1 text-muted">
            {subtitle}
          </p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {children}
    </div>
  )
}
