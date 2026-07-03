import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Check, ShieldCheck, Save, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { requestAPI } from '@/lib/api'
import { SummaryPageShell } from '@/components/summary-page-shell'
import { NAV } from '@/components/layout/nav'

export const Route = createFileRoute('/_admin/admin/employee/usermanetmint')({
  component: RouteComponent,
})

// FIX: role ตรงกับของจริงใน backend (User.Role) — เดิม mock เป็น admin/editor/staff
// ซึ่ง editor/staff ไม่มีอยู่ในระบบ
const ROLES = [
  { id: 'admin', name: 'ผู้ดูแลระบบ', locked: true }, // admin เห็นทุกเมนูเสมอ แก้ไม่ได้
  { id: 'employee', name: 'เจ้าหน้าที่', locked: false },
] as const

// Menus offered for permission come straight from the sidebar NAV. A menu's
// `to` is used as its stable key when talking to the backend.
const MENUS = NAV

function RouteComponent() {
  const qc = useQueryClient()
  const [selectedRoleId, setSelectedRoleId] = useState<string>('employee')
  // การแก้ไขที่ยังไม่บันทึก — null = ยังไม่แตะ ให้แสดงตามค่าจาก API
  const [edits, setEdits] = useState<string[] | null>(null)

  const selectedRole = ROLES.find((r) => r.id === selectedRoleId)
  const isLocked = selectedRole?.locked ?? false

  const { data: savedMenus, isLoading } = useQuery<string[]>({
    queryKey: ['role-permissions', selectedRoleId],
    enabled: !isLocked, // admin ไม่ต้องดึง — เห็นหมดเสมอ
    queryFn: async () => {
      const resp = await requestAPI<string[]>({
        method: 'GET',
        url: `/roles/${selectedRoleId}/permissions`,
      })
      return resp.success ? resp.data : []
    },
  })

  // NOTE: ยังไม่เคยตั้งค่า (ไม่มี record) → ตีความว่าเห็นทุกเมนู ให้ตรงกับ
  // พฤติกรรม sidebar ใน AdminShell — derive จาก query ตรง ๆ ไม่ seed ผ่าน effect
  const baseline =
    savedMenus === undefined
      ? null
      : savedMenus.length === 0
        ? MENUS.map((m) => m.to)
        : savedMenus
  const allowed = edits ?? baseline ?? []

  const savePermissions = useMutation({
    mutationFn: async (menus: string[]) => {
      const resp = await requestAPI<string[]>({
        method: 'PUT',
        url: `/roles/${selectedRoleId}/permissions`,
        body: { menus },
      })
      if (!resp.success) throw new Error(resp.message)
      return resp.data
    },
    onSuccess: () => {
      toast.success(`บันทึกสิทธิ์ของ "${selectedRole?.name ?? ''}" แล้ว`)
      setEdits(null) // กลับไปแสดงตามค่าที่บันทึกแล้ว
      qc.invalidateQueries({ queryKey: ['role-permissions', selectedRoleId] })
    },
    onError: (e: Error) => toast.error(e.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const toggleMenu = (menuKey: string) => {
    if (isLocked) return
    const current = edits ?? baseline ?? []
    setEdits(
      current.includes(menuKey) ? current.filter((k) => k !== menuKey) : [...current, menuKey],
    )
  }

  return (
    <SummaryPageShell
      crumbs={[
        { label: 'ภาพรวมระบบ', to: '/admin/dashboard' },
        { label: 'จัดการสิทธิ์ผู้ใช้งาน' },
      ]}
      title="จัดการสิทธิ์การใช้งาน"
      subtitle="กำหนดว่าแต่ละบทบาท (Role) เข้าถึงเมนูใดในระบบหลังบ้านได้บ้าง"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: roles ── */}
        <div className="rounded-md border border-line bg-white overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="text-sm font-semibold">บทบาทผู้ใช้งาน</h2>
            <p className="text-xs text-muted mt-0.5">เลือกบทบาทเพื่อกำหนดสิทธิ์</p>
          </div>
          <ul>
            {ROLES.map((role) => {
              const isSelected = role.id === selectedRoleId
              return (
                <li key={role.id}>
                  <button
                    onClick={() => {
                      setSelectedRoleId(role.id)
                      setEdits(null) // ทิ้งการแก้ไขค้างของ role ก่อนหน้า
                    }}
                    className={`w-full flex items-center justify-between px-5 py-3.5 text-left border-l-2 transition-colors ${
                      isSelected
                        ? 'border-teal bg-paper text-ink font-semibold'
                        : 'border-transparent text-muted hover:bg-paper/60'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className={`w-4 h-4 ${isSelected ? 'text-teal' : 'text-faint'}`} />
                      {role.name}
                    </span>
                    {role.locked ? (
                      <span className="flex items-center gap-1 text-[11px] text-faint">
                        <Lock className="w-3 h-3" />
                        ทุกเมนู
                      </span>
                    ) : (
                      <span className="text-[11px] text-faint tabular-nums">
                        {isSelected ? `${allowed.length} เมนู` : ''}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ── Right: dashboard menus ── */}
        <div className="lg:col-span-2 rounded-md border border-line bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">เมนูที่เข้าถึงได้</h2>
              <p className="text-xs text-muted mt-0.5">
                บทบาท: <span className="text-ink font-medium">{selectedRole?.name ?? '-'}</span>
                {isLocked && <span className="text-faint"> — เห็นทุกเมนูเสมอ แก้ไขไม่ได้</span>}
              </p>
            </div>
            {!isLocked && (
              <button
                onClick={() => savePermissions.mutate(allowed)}
                disabled={savePermissions.isPending || isLoading}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-sm bg-teal text-white font-semibold hover:bg-teal/90 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {savePermissions.isPending ? 'กำลังบันทึก...' : 'บันทึกสิทธิ์'}
              </button>
            )}
          </div>

          {isLoading && !isLocked ? (
            <p className="px-5 py-10 text-center text-sm text-faint">กำลังโหลดข้อมูล...</p>
          ) : (
            <ul className="divide-y divide-line">
              {MENUS.map((menu) => {
                const checked = isLocked || allowed.includes(menu.to)
                return (
                  <li key={menu.to}>
                    <button
                      onClick={() => toggleMenu(menu.to)}
                      disabled={isLocked}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                        isLocked ? 'cursor-not-allowed opacity-70' : 'hover:bg-paper/60'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                          checked ? 'bg-teal border-teal text-white' : 'border-line bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </span>
                      <menu.icon className={`w-4 h-4 shrink-0 ${checked ? 'text-teal' : 'text-faint'}`} />
                      <span className={`text-sm ${checked ? 'text-ink font-medium' : 'text-muted'}`}>
                        {menu.label}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </SummaryPageShell>
  )
}
