import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
//import { AdminShell } from "@/components/layout/AdminShell"

// ── Token helper (แก้ที่เดียว ใช้ทั่วโปรเจค) ──────
const AUTH_KEY = "admin_token"

export function getToken() {
  return localStorage.getItem(AUTH_KEY)
}

export function clearToken() {
  localStorage.removeItem(AUTH_KEY)
  document.cookie = `${AUTH_KEY}=; Max-Age=0; path=/`
}

// ── Route ─────────────────────────────────────────
export const Route = createFileRoute("/_admin")({
  beforeLoad: ({ location }) => {
    const token = getToken()
    const isLoginPage = location.pathname === "/admin/login"

    // ไม่มี token → ไป login
    if (!token && !isLoginPage) {
      throw redirect({ to: "/admin/login", replace: true })
    }

    // มี token + validate → ไป dashboard
    if (token && isLoginPage) {
      if (!isValidToken(token)) {
        // token หมดอายุ → เคลียร์แล้วอยู่ที่ login
        clearToken()
        return
      }
      throw redirect({ to: "/admin/dashboard", replace: true })
    }
  },

  component: AdminLayout,
})

// ── Layout ────────────────────────────────────────
function AdminLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}

// ── Token validator ───────────────────────────────
function isValidToken(token: string): boolean {
  try {
    // ถ้าใช้ JWT: decode แล้วเช็ค exp
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    // ถ้าไม่ใช่ JWT (เป็น plain token) → เช็คแค่ว่าไม่ว่าง
    return token.length > 0
  }
}