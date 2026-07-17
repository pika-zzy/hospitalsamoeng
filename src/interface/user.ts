// System user (ผู้ใช้งานในระบบ) returned by GET /users, GET /users/:id, POST /users.
// FIX: field is `username` (mirrors backend model.User json tag) — was `name`,
// which only exists in the login response's user object, not the /users endpoints.
export interface SystemUser {
  id: number
  username: string
  role: string
  is_active: boolean
}
