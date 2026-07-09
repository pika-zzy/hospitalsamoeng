import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { departments, positions } from '@/interface/employee'
import { requestAPI } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronDown, CloudUpload, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/personnel/create')({
  component: RouteComponent,
})

// typed as string เพื่อให้ผ่าน typed-route ของ TanStack
const LIST_PATH: string = '/admin/personnel'

function RouteComponent() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState({
    prefix: '',
    name: '',
    lastname: '',
    uid: '',
    role: '',
    position: '',
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

  const addPersonnel = useMutation({
    mutationFn: (data: typeof form) => {
      const body = new FormData()
      body.append('prefix', data.prefix)
      body.append('name', data.name)
      body.append('lastname', data.lastname)
      body.append('uid', data.uid)
      body.append('role', data.role)
      body.append('position', data.position)
      if (data.image) body.append('image', data.image)
      return requestAPI({ method: 'POST', url: '/personnel', body })
    },
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'บันทึกไม่สำเร็จ')
        return
      }
      toast.success('เพิ่มบุคลากรสำเร็จ')
      qc.invalidateQueries({ queryKey: ['personnel'] })
      navigate({ to: LIST_PATH })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.lastname.trim() || !form.role.trim() || !form.position.trim()) {
      toast.error('กรุณากรอกชื่อ นามสกุล ฝ่ายงาน และตำแหน่งให้ครบ')
      return
    }
    if (!/^\d+$/.test(form.uid.trim())) {
      toast.error('เลขประจำตัวต้องเป็นตัวเลข')
      return
    }
    addPersonnel.mutate(form)
  }

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto w-full text-ink">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">เพิ่มบุคลากร</h1>
        <p className="text-sm mt-1 text-muted">กรอกข้อมูลเพื่อเพิ่มบุคลากรใหม่เข้าระบบ</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-md border border-line bg-white p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">คำนำหน้า</Label>
            <input
              type="text"
              name="prefix"
              value={form.prefix}
              onChange={handleChange}
              placeholder="เช่น นพ. / นาง"
              className="w-full px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
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
              placeholder="เช่น 12345"
              className="w-full px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">ชื่อ</Label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="ชื่อ"
              className="w-full px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
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
              placeholder="นามสกุล"
              className="w-full px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">ฝ่ายงาน</Label>
            <div className="relative">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full appearance-none px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20 cursor-pointer"
              >
                <option value="">-- เลือกฝ่ายงาน --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
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
                className="w-full appearance-none px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20 cursor-pointer disabled:cursor-not-allowed disabled:bg-paper/50 disabled:text-faint"
              >
                <option value="">{form.role ? '-- เลือกตำแหน่ง --' : '-- เลือกฝ่ายงานก่อน --'}</option>
                {availablePositions.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-faint">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted">รูปภาพบุคลากร</Label>
          {form.image ? (
            <div className="relative w-40">
              <img
                src={URL.createObjectURL(form.image)}
                alt="ตัวอย่าง"
                className="w-40 h-40 rounded-sm object-cover border border-line"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-md"
                onClick={() => setForm({ ...form, image: null })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-line rounded-sm cursor-pointer bg-paper/50 hover:bg-paper hover:border-teal transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudUpload className="w-7 h-7 text-faint mb-2" strokeWidth={1.5} />
                <p className="text-sm text-muted">
                  <span className="font-semibold text-teal">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                </p>
                <p className="text-xs text-faint mt-1">PNG, JPG</p>
              </div>
              <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-1/3 h-12 rounded-sm border-line text-muted hover:bg-paper font-medium"
            onClick={() => window.history.back()}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={addPersonnel.isPending}
            className="w-2/3 h-12 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors disabled:opacity-50"
          >
            {addPersonnel.isPending ? 'กำลังบันทึก...' : 'บันทึกบุคลากร'}
          </Button>
        </div>
      </form>
    </div>
  )
}
