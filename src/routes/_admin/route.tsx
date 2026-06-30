import { Outlet, createFileRoute, redirect, useLocation } from "@tanstack/react-router"
import { AdminShell } from "@/components/layout/AdminShell"
import { getToken, clearToken, isValidToken } from "@/lib/auth"

// ── Route ─────────────────────────────────────────
export const Route = createFileRoute("/_admin")({
  beforeLoad: ({ location }) => {
    const token = getToken()
    const isLoginPage = location.pathname === "/admin/login"
    // FIX: validate the token on every protected route, not just on the login
    // page. Previously a protected page only checked that *a* token existed, so
    // an expired or non-JWT token still granted full admin access.
    const isAuthed = token !== null && isValidToken(token)

    // เข้าหน้า protected โดยไม่มี token ที่ใช้ได้ → เคลียร์ token ค้าง แล้วไป login
    if (!isAuthed && !isLoginPage) {
      if (token) clearToken()
      throw redirect({ to: "/admin/login", replace: true })
    }

    // ล็อกอินอยู่แล้วแต่ยังอยู่หน้า login → เด้งไป dashboard
    if (isAuthed && isLoginPage) {
      throw redirect({ to: "/admin/dashboard", replace: true })
    }
  },

  component: AdminLayout,
})

// ── Layout ────────────────────────────────────────
function AdminLayout() {
  const location = useLocation()
  const isLoginPage = location.pathname === "/admin/login"

  if (isLoginPage) {
    return <Outlet />
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}