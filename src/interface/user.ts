// System user (ผู้ใช้งานในระบบ) returned by GET /users.
// Shape mirrors the `user` object in LoginData (see login.ts): id, name, role.
// NOTE: `is_active` is assumed to be the boolean status flag from the backend.
// If the API uses a different field (e.g. `status: string`), update here.
export interface SystemUser {
  id: number
  name: string
  role: string
  is_active: boolean
}
