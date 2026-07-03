// Admin auth token helpers — single source of truth (แก้ที่เดียว ใช้ทั่วโปรเจค).
// Kept out of route.tsx so that file only exports components (React Fast Refresh
// requires it) and so AdminShell can reuse this without a circular import.
const AUTH_KEY = "admin_token"

export function getToken() {
  return localStorage.getItem(AUTH_KEY)
}

export function clearToken() {
  localStorage.removeItem(AUTH_KEY)
  document.cookie = `${AUTH_KEY}=; Max-Age=0; path=/`
}

export function isValidToken(token: string): boolean {
  try {
    // Must be a real JWT: decode and check the exp claim.
    const payload = JSON.parse(atob(token.split(".")[1]))
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now()
  } catch {
    // A token that fails to decode is invalid — no "non-empty string" fallback.
    return false
  }
}

// Current user's id from the JWT payload (backend Claims serializes as "UserID").
// Returns null when there is no valid token — callers must handle that case.
export function getUserId(): number | null {
  const token = getToken()
  if (!token || !isValidToken(token)) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return typeof payload.UserID === "number" ? payload.UserID : null
  } catch {
    return null
  }
}

// Current user's role ("admin" | "employee") from the JWT payload ("Role" claim).
export function getRole(): string | null {
  const token = getToken()
  if (!token || !isValidToken(token)) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return typeof payload.Role === "string" ? payload.Role : null
  } catch {
    return null
  }
}
