export interface UserInfo {
    username : string
    password : string
}
export type LoginData = {
  success: boolean
  message: string
  token: string
  user: {
    id: number
    name: string
    role: string
  }
}