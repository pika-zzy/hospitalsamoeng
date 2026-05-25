import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import type { LoginData, UserInfo } from '@/interface/login'
import { requestAPI, type IAPIResponse } from '@/lib/api'

export const Route = createFileRoute('/_admin/admin/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const loginadmin = useMutation<IAPIResponse<LoginData>, Error, UserInfo>({
    mutationFn: async (data: UserInfo) => {
      return requestAPI({
        url: "/login",
        method: "POST",
        body: data,
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    loginadmin.mutate(formData, {
      onSuccess: (res) => {
        if (!res.success || !res.data) return
        localStorage.setItem("admin_token", res.data.token)
        navigate({ to: "/admin/dashboard", replace: true })
      },
      onError: (err) => {
        console.error("login error", err)
      },
    })
  }

  return (
    <div className="min-h-screen bg-white flex">

      {/* Left — decorative panel (desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-emerald-600 flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/40" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-emerald-700/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full border border-emerald-500/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-85 h-85 rounded-full border border-emerald-500/20" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">โรงพยาบาลสะเมิง</h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            ระบบจัดการข้อมูลภายใน<br />สำหรับเจ้าหน้าที่โรงพยาบาลเท่านั้น
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
            <p className="text-sm text-gray-400 mt-1">กรอกข้อมูลเพื่อเข้าใช้งานระบบหลังบ้าน</p>
          </div>

          {/* Error */}
          {loginadmin.isError && (
            <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-100
                            text-red-600 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">ชื่อผู้ใช้งาน</label>
              <input
                type="text"
                name="username"
                required
                placeholder="กรอกชื่อผู้ใช้"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
                <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-xl
                             bg-gray-50 focus:bg-white focus:border-emerald-500
                             focus:ring-2 focus:ring-emerald-500/20 outline-none
                             transition-all placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              จำการเข้าสู่ระบบ
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginadmin.isPending}
              className={`w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm
                         font-semibold rounded-xl shadow-sm hover:shadow-md
                         transition-all duration-200 flex items-center justify-center gap-2
                         ${loginadmin.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loginadmin.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  กำลังตรวจสอบ...
                </>
              ) : 'เข้าสู่ระบบ'}
            </button>

          </form>

          <p className="text-center text-xs text-gray-300 mt-8">
            &copy; 2568 โรงพยาบาลสะเมิง
          </p>

        </div>
      </div>
    </div>
  )
}