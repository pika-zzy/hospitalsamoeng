import { DataTable, type DataTableColumn } from '@/components/data-table'
import { SummaryPageShell } from '@/components/summary-page-shell'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { departments, positions } from '@/interface/employee'
import { requestAPI } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronDown, CloudUpload, Pencil, Plus, Trash2, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/personnel/')({
  component: RouteComponent,
})

interface Personnel {
  id: number
  prefix: string
  name: string
  lastname: string
  uid: number
  role: string
  position: string
  img_url: string
}

const API_URL = import.meta.env.VITE_API_URL
// typed as string เพื่อให้ผ่าน typed-route ของ TanStack (pattern เดียวกับ sidebar NAV)
const CREATE_PATH: string = '/admin/personnel/create'

function RouteComponent() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Personnel | null>(null)

  const { data: personnel = [], isLoading } = useQuery<Personnel[]>({
    queryKey: ['personnel'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<Personnel[]>({ method: 'GET', url: '/personnel' })
      return resp.success ? resp.data ?? [] : []
    },
  })

  const deletePersonnel = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/personnel/${id}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'ลบไม่สำเร็จ')
        return
      }
      toast.success('ลบบุคลากรสำเร็จ')
      qc.invalidateQueries({ queryKey: ['personnel'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const confirmDelete = (p: Personnel) => {
    if (window.confirm(`ลบ "${p.prefix}${p.name} ${p.lastname}" ใช่ไหมครับ?`)) {
      deletePersonnel.mutate(p.id)
    }
  }

  const columns: DataTableColumn<Personnel>[] = [
    {
      key: 'name',
      header: 'บุคลากร',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.img_url ? (
            <img
              src={`${API_URL}${row.img_url}`}
              alt={row.name}
              className="w-9 h-9 rounded-full object-cover border border-line shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-paper border border-line flex items-center justify-center shrink-0 text-faint">
              <UserRound className="w-4 h-4" strokeWidth={1.5} />
            </div>
          )}
          <span className="font-medium">
            {row.prefix}
            {row.name} {row.lastname}
          </span>
        </div>
      ),
      searchValue: (row) => `${row.prefix}${row.name} ${row.lastname}`,
    },
    {
      key: 'role',
      header: 'ฝ่ายงาน',
      render: (row) => (
        <span className="text-xs px-2 py-0.5 rounded-sm border border-line text-teal">{row.role || '-'}</span>
      ),
      searchValue: (row) => row.role,
    },
    {
      key: 'position',
      header: 'ตำแหน่ง',
      render: (row) => <span className="text-muted">{row.position || '-'}</span>,
      searchValue: (row) => row.position,
    },
    {
      key: 'uid',
      header: 'รหัส',
      render: (row) => String(row.uid),
      searchValue: (row) => String(row.uid),
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
      crumbs={[{ label: 'ภาพรวมระบบ', to: '/admin/dashboard' }, { label: 'จัดการบุคลากร' }]}
      title="รายการบุคลากร"
      subtitle="บุคลากรทั้งหมดของโรงพยาบาลสะเมิง ค้นหาและจัดการได้จากตารางด้านล่าง"
    >
      <div className="flex justify-end mb-4">
        <Link
          to={CREATE_PATH}
          className="flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal/90 text-white text-sm font-semibold rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่มบุคลากร
        </Link>
      </div>

      <DataTable
        data={personnel}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="ค้นหาชื่อ / ตำแหน่ง / รหัส..."
        emptyLabel="ยังไม่มีข้อมูลบุคลากร"
        rowKey={(row) => row.id}
      />

      {editing && <EditPersonnelModal personnel={editing} onClose={() => setEditing(null)} />}
    </SummaryPageShell>
  )
}

function EditPersonnelModal({ personnel, onClose }: { personnel: Personnel; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    prefix: personnel.prefix,
    name: personnel.name,
    lastname: personnel.lastname,
    uid: String(personnel.uid),
    role: personnel.role,
    position: personnel.position,
    image: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // เปลี่ยนฝ่ายงาน → ล้างตำแหน่งเดิม (ตำแหน่งเป็นลูกของฝ่ายงาน อาจไม่อยู่ใต้ฝ่ายงานใหม่)
    if (name === 'role') {
      setForm({ ...form, role: value, position: '' })
      return
    }
    setForm({ ...form, [name]: value })
  }

  // ตำแหน่งที่เลือกได้ = ตำแหน่งที่อยู่ใต้ฝ่ายงานที่เลือก (role เก็บเป็นชื่อ dept)
  const selectedDept = departments.find((d) => d.name === form.role)
  const availablePositions = selectedDept ? positions.filter((p) => p.deptId === selectedDept.id) : []

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('อัปโหลดได้เฉพาะไฟล์รูปภาพ (.jpg/.jpeg/.png)')
      return
    }
    setForm({ ...form, image: file })
  }

  const updatePersonnel = useMutation({
    mutationFn: (data: typeof form) => {
      const body = new FormData()
      body.append('prefix', data.prefix)
      body.append('name', data.name)
      body.append('lastname', data.lastname)
      body.append('uid', data.uid)
      body.append('role', data.role)
      body.append('position', data.position)
      if (data.image) body.append('image', data.image)
      return requestAPI({ method: 'PUT', url: `/personnel/${personnel.id}`, body })
    },
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'บันทึกไม่สำเร็จ')
        return
      }
      toast.success('แก้ไขบุคลากรสำเร็จ')
      qc.invalidateQueries({ queryKey: ['personnel'] })
      onClose()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.lastname.trim() || !form.role.trim() || !form.position.trim()) {
      toast.error('กรุณากรอกชื่อ นามสกุล ฝ่ายงาน และเลือกตำแหน่งให้ครบ')
      return
    }
    if (!/^\d+$/.test(form.uid.trim())) {
      toast.error('เลขประจำตัวต้องเป็นตัวเลข')
      return
    }
    updatePersonnel.mutate(form)
  }

  // แสดง preview: รูปใหม่ที่เลือก > รูปเดิมจาก server
  const previewSrc = form.image
    ? URL.createObjectURL(form.image)
    : personnel.img_url
      ? `${API_URL}${personnel.img_url}`
      : ''

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">แก้ไขบุคลากร</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-sm hover:bg-paper flex items-center justify-center" aria-label="ปิด">
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">คำนำหน้า</Label>
              <input
                type="text"
                name="prefix"
                value={form.prefix}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-muted">เลขประจำตัว</Label>
              <input
                type="text"
                inputMode="numeric"
                name="uid"
                value={form.uid}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">ชื่อ</Label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">นามสกุล</Label>
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">ฝ่ายงาน</Label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 cursor-pointer"
                >
                  <option value="">-- เลือกฝ่ายงาน --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                  {/* กันเคส role เดิมไม่อยู่ใน list (เช่นข้อมูลเก่าที่กรอกอิสระ) ให้ยังเลือกค้างไว้ได้ */}
                  {form.role && !departments.some((d) => d.name === form.role) && (
                    <option value={form.role}>{form.role} (เดิม)</option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-faint">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">ตำแหน่ง</Label>
              <div className="relative">
                <select
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                  disabled={!form.role}
                  className="w-full appearance-none px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 cursor-pointer disabled:cursor-not-allowed disabled:bg-paper/50 disabled:text-faint"
                >
                  <option value="">{form.role ? '-- เลือกตำแหน่ง --' : '-- เลือกฝ่ายงานก่อน --'}</option>
                  {availablePositions.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  {/* กันเคส position เดิมไม่อยู่ใน list ใต้ฝ่ายงานนี้ (ข้อมูลเก่า) ให้ยังเลือกค้างไว้ได้ */}
                  {form.position && !availablePositions.some((p) => p.name === form.position) && (
                    <option value={form.position}>{form.position} (เดิม)</option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-faint">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">รูปภาพ</Label>
            <div className="flex items-center gap-4">
              {previewSrc ? (
                <img src={previewSrc} alt="ตัวอย่าง" className="w-20 h-20 rounded-sm object-cover border border-line shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-sm bg-paper border border-line flex items-center justify-center shrink-0 text-faint">
                  <UserRound className="w-8 h-8" strokeWidth={1.5} />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center gap-2 h-11 rounded-sm border-2 border-dashed border-line cursor-pointer bg-paper/50 hover:bg-paper hover:border-teal transition-colors text-sm text-muted">
                <CloudUpload className="w-5 h-5 text-faint" strokeWidth={1.5} />
                <span>
                  <span className="font-semibold text-teal">เลือกรูปใหม่</span> (ไม่เลือก = ใช้รูปเดิม)
                </span>
                <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleImageChange} />
              </label>
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
              disabled={updatePersonnel.isPending}
              className="w-2/3 h-11 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors disabled:opacity-50"
            >
              {updatePersonnel.isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
