import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Check, ShieldCheck, Save } from 'lucide-react'
import { toast } from 'sonner'
import { SummaryPageShell } from '@/components/summary-page-shell'
import { NAV } from '@/components/layout/nav'

export const Route = createFileRoute('/_admin/admin/employee/usermanetmint')({
  component: RouteComponent,
})

interface Role {
  id: string
  name: string
}

// TODO(api): replace with useQuery → GET /roles. Shape assumed { id, name }.
const ROLES: Role[] = [
  { id: 'admin', name: 'ผู้ดูแลระบบ' },
  { id: 'editor', name: 'ผู้จัดการเนื้อหา' },
  { id: 'staff', name: 'เจ้าหน้าที่ทั่วไป' },
]

// Menus offered for permission come straight from the sidebar NAV. A menu's
// `to` is used as its stable key when talking to the backend.
const MENUS = NAV

function RouteComponent() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(ROLES[0]?.id ?? '')

  // roleId → set of menu keys (NAV.to) the role can access.
  // TODO(api): seed this from GET /roles/:id/permissions when a role is selected.
  const [permissions, setPermissions] = useState<Record<string, string[]>>({})

  const selectedRole = ROLES.find((r) => r.id === selectedRoleId)
  const allowed = permissions[selectedRoleId] ?? []

  const toggleMenu = (menuKey: string) => {
    setPermissions((prev) => {
      const current = prev[selectedRoleId] ?? []
      const next = current.includes(menuKey)
        ? current.filter((k) => k !== menuKey)
        : [...current, menuKey]
      return { ...prev, [selectedRoleId]: next }
    })
  }

  const handleSave = () => {
    // TODO(api): PUT /roles/:id/permissions  body: { menus: allowed }
    // wire as a useMutation (success/error toast + invalidate) once the
    // endpoint exists. For now this only confirms the local selection.
    toast.success(`บันทึกสิทธิ์ของ "${selectedRole?.name ?? ''}" แล้ว`)
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
              const count = permissions[role.id]?.length ?? 0
              return (
                <li key={role.id}>
                  <button
                    onClick={() => setSelectedRoleId(role.id)}
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
                    <span className="text-[11px] text-faint tabular-nums">{count} เมนู</span>
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
              </p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-sm bg-teal text-white font-semibold hover:bg-teal/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              บันทึกสิทธิ์
            </button>
          </div>

          <ul className="divide-y divide-line">
            {MENUS.map((menu) => {
              const checked = allowed.includes(menu.to)
              return (
                <li key={menu.to}>
                  <button
                    onClick={() => toggleMenu(menu.to)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-paper/60 transition-colors"
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
        </div>
      </div>
    </SummaryPageShell>
  )
}
