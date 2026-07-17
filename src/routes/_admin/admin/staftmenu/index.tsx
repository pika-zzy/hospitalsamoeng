import { DataTable, type DataTableColumn } from '@/components/data-table'
import { getIconColor } from '@/components/icon/colors'
import IconPicker from '@/components/icon/icon'
import { SummaryPageShell } from '@/components/summary-page-shell'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { StaffMenu, StaffMenuPayload } from '@/interface/staffmenu'
import { requestAPI } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ImageOff, Pencil, Plus, Trash2, X, icons } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/staftmenu/')({
  component: RouteComponent,
})

// typed as string เพื่อให้ผ่าน typed-route ของ TanStack (pattern เดียวกับหน้าบุคลากร)
const CREATE_PATH: string = '/admin/staftmenu/create'

// ไอคอนของเมนู 1 ตัว — ใช้ทั้งในตารางและในโมดัลแก้ไข
function MenuIcon({ icon, color, size = 18 }: { icon: string; color: string; size?: number }) {
  const c = getIconColor(color)
  const Icon = icon in icons ? icons[icon as keyof typeof icons] : null

  return (
    <div
      className={`shrink-0 rounded-lg flex items-center justify-center ${c.bgClass} ${c.textClass}`}
      style={{ width: size * 2, height: size * 2 }}
    >
      {Icon ? <Icon size={size} aria-hidden="true" /> : <ImageOff size={size} className="text-faint" />}
    </div>
  )
}

function RouteComponent() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<StaffMenu | null>(null)

  const { data: menus = [], isLoading } = useQuery<StaffMenu[]>({
    queryKey: ['menu'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<StaffMenu[]>({ method: 'GET', url: '/menu' })
      return resp.success ? resp.data ?? [] : []
    },
  })

  const deleteMenu = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/menu/${id}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'ลบไม่สำเร็จ')
        return
      }
      toast.success('ลบเมนูสำเร็จ')
      qc.invalidateQueries({ queryKey: ['menu'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const confirmDelete = (m: StaffMenu) => {
    if (window.confirm(`ลบเมนู "${m.menu_name}" ใช่ไหมครับ? เมนูนี้จะหายจากหน้าแรกทันที`)) {
      deleteMenu.mutate(m.id)
    }
  }

  const columns: DataTableColumn<StaffMenu>[] = [
    {
      key: 'menu_name',
      header: 'เมนู',
      render: (row) => (
        <div className="flex items-center gap-3">
          <MenuIcon icon={row.icon} color={row.color} />
          <span className="font-medium">{row.menu_name}</span>
        </div>
      ),
      searchValue: (row) => row.menu_name,
    },
    {
      key: 'description',
      header: 'รายละเอียด',
      render: (row) => <span className="text-muted">{row.description || '-'}</span>,
      searchValue: (row) => row.description,
    },
    {
      key: 'link',
      header: 'ลิงก์',
      render: (row) =>
        row.link ? (
          <span className="text-xs px-2 py-0.5 rounded-sm border border-line text-teal">{row.link}</span>
        ) : (
          // ลิงก์ว่าง = การ์ดหน้าแรกกดแล้วไม่ไปไหน — ทำให้เห็นชัดว่ายังไม่ได้ตั้งค่า
          <span className="text-xs text-danger">ยังไม่ได้ใส่ลิงก์</span>
        ),
      searchValue: (row) => row.link,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setEditing(row)}
            className="w-7 h-7 rounded-sm hover:bg-white flex items-center justify-center"
            aria-label="แก้ไข"
          >
            <Pencil className="w-3.5 h-3.5 text-muted" />
          </button>
          <button
            onClick={() => confirmDelete(row)}
            className="w-7 h-7 rounded-sm hover:bg-danger/10 flex items-center justify-center"
            aria-label="ลบ"
          >
            <Trash2 className="w-3.5 h-3.5 text-danger" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <SummaryPageShell
      crumbs={[{ label: 'ภาพรวมระบบ', to: '/admin/dashboard' }, { label: 'เมนูบริการเจ้าหน้าที่' }]}
      title="รายการเมนูบริการเจ้าหน้าที่"
      subtitle="เมนูที่แสดงในส่วน 'สำหรับเจ้าหน้าที่' บนหน้าแรก — แก้ไขหรือลบได้จากตารางด้านล่าง"
      action={
        <Link
          to={CREATE_PATH}
          className="flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal/90 text-white text-sm font-semibold rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่มเมนู
        </Link>
      }
    >
      <DataTable
        data={menus}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="ค้นหาชื่อเมนู / รายละเอียด / ลิงก์..."
        emptyLabel="ยังไม่มีเมนูบริการเจ้าหน้าที่"
        rowKey={(row) => row.id}
      />

      {editing && <EditMenuModal menu={editing} onClose={() => setEditing(null)} />}
    </SummaryPageShell>
  )
}

function EditMenuModal({ menu, onClose }: { menu: StaffMenu; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState<StaffMenuPayload>({
    menu_name: menu.menu_name,
    description: menu.description,
    link: menu.link,
    icon: menu.icon,
    color: menu.color,
  })

  const updateMenu = useMutation({
    // backend PUT /menu/:id เขียนทับทุกฟิลด์ — ต้องส่งครบทุกตัวเสมอ ไม่ใช่เฉพาะที่แก้
    mutationFn: (data: StaffMenuPayload) =>
      requestAPI({ method: 'PUT', url: `/menu/${menu.id}`, body: data }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'บันทึกไม่สำเร็จ')
        return
      }
      toast.success('แก้ไขเมนูสำเร็จ')
      qc.invalidateQueries({ queryKey: ['menu'] })
      onClose()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.menu_name.trim()) {
      toast.error('กรุณากรอกชื่อเมนู')
      return
    }
    updateMenu.mutate({
      ...form,
      menu_name: form.menu_name.trim(),
      description: form.description.trim(),
      link: form.link.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">แก้ไขเมนู</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-sm hover:bg-paper flex items-center justify-center" aria-label="ปิด">
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">ชื่อเมนู</Label>
            <input
              type="text"
              value={form.menu_name}
              onChange={(e) => setForm({ ...form, menu_name: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">รายละเอียด</Label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">ลิงก์</Label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="/maintenance หรือ https://..."
              className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">ไอคอน</Label>
            <div className="flex items-center gap-3 mb-3">
              <MenuIcon icon={form.icon} color={form.color} size={20} />
              <span className="text-xs text-faint">{form.icon || 'ยังไม่ได้เลือกไอคอน'}</span>
            </div>
            <div className="rounded-sm border border-line bg-paper/50 p-3">
              <IconPicker
                value={form.icon}
                onSelect={(icon) => setForm((f) => ({ ...f, icon }))}
                color={form.color}
                onColorSelect={(color) => setForm((f) => ({ ...f, color }))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-1/3 h-11 rounded-sm border-line text-muted hover:bg-paper font-medium"
              onClick={onClose}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={updateMenu.isPending}
              className="w-2/3 h-11 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors disabled:opacity-50"
            >
              {updateMenu.isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
