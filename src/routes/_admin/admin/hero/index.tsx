import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { HeroSlide } from '@/interface/hero'
import { requestAPI } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CloudUpload, ImageOff, Info, Pencil, Trash2, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/hero/')({
  component: RouteComponent,
})

const API_URL = import.meta.env.VITE_API_URL

function RouteComponent() {
  const qc = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [orderInput, setOrderInput] = useState('')
  const [editingText, setEditingText] = useState<HeroSlide | null>(null)

  const { data: slides = [], isLoading } = useQuery<HeroSlide[]>({
    queryKey: ['hero'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<HeroSlide[]>({ method: 'GET', url: '/hero' })
      return resp.success ? resp.data : []
    },
  })

  const addSlide = useMutation({
    mutationFn: (data: { file: File; order: string }) => {
      const form = new FormData()
      form.append('image', data.file)
      // ไม่กรอกลำดับ = ปล่อยให้ backend ต่อท้ายให้เอง (max + 1)
      if (data.order.trim()) form.append('order', data.order.trim())
      return requestAPI({ method: 'POST', url: '/hero', body: form })
    },
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'เพิ่มรูปไม่สำเร็จ')
        return
      }
      toast.success('เพิ่มรูปสไลด์สำเร็จ')
      setSelectedFile(null)
      setOrderInput('')
      qc.invalidateQueries({ queryKey: ['hero'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const updateOrder = useMutation({
    mutationFn: (data: { id: number; order: number }) =>
      requestAPI({ method: 'PUT', url: `/hero/${data.id}`, body: { order: data.order } }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'แก้ลำดับไม่สำเร็จ')
        return
      }
      toast.success('แก้ลำดับสำเร็จ')
      qc.invalidateQueries({ queryKey: ['hero'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const deleteSlide = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/hero/${id}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        // เคสหลักคือ backend กันลบรูปสุดท้าย (400) — โชว์ข้อความจาก backend ตรง ๆ
        toast.error(resp.message || 'ลบรูปไม่สำเร็จ')
        return
      }
      toast.success('ลบรูปสไลด์สำเร็จ')
      qc.invalidateQueries({ queryKey: ['hero'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('อัปโหลดได้เฉพาะไฟล์รูปภาพ (.jpg/.jpeg/.png)')
      return
    }
    setSelectedFile(file)
  }

  // ต้องเหลืออย่างน้อย 1 รูปเสมอ (backend บังคับด้วย — ตรงนี้แค่ปิดปุ่มให้ UX ชัด)
  const isLastSlide = slides.length <= 1

  const previewSrc = selectedFile ? URL.createObjectURL(selectedFile) : ''

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto w-full text-ink">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">จัดการรูปสไลด์หน้าแรก</h1>
        <p className="text-sm mt-1 text-muted">
          รูปพื้นหลังส่วนหัวของหน้าแรก ถ้ามีมากกว่า 1 รูป หน้าเว็บจะเลื่อนสไลด์อัตโนมัติ
        </p>
      </div>

      {/* กติกาการลบ — บอกล่วงหน้าดีกว่าให้ไปเจอ error ตอนกดลบ */}
      <div className="mb-6 flex gap-2.5 rounded-md border border-line bg-paper/50 p-4">
        <Info className="w-4 h-4 text-teal shrink-0 mt-0.5" />
        <p className="text-xs text-muted leading-relaxed">
          เมื่อมีรูปในระบบแล้ว <span className="font-semibold text-ink">ต้องเหลืออย่างน้อย 1 รูปเสมอ</span> —
          ลบรูปสุดท้ายไม่ได้ (ถ้ายังไม่มีรูปเลย หน้าแรกจะแสดงเป็นพื้นหลังสีทึบ)
          <br />
          ลำดับยิ่งน้อยยิ่งแสดงก่อน
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted text-center py-16">กำลังโหลด...</p>
      ) : (
        <div className="space-y-6">
          {/* รายการรูปปัจจุบัน */}
          <div className="rounded-md border border-line bg-white p-6 space-y-4">
            <Label className="text-sm font-semibold text-ink">
              รูปสไลด์ปัจจุบัน ({slides.length} รูป)
            </Label>

            {slides.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-40 rounded-sm border border-dashed border-line bg-paper/50 text-faint">
                <ImageOff className="w-7 h-7 mb-2" strokeWidth={1.5} />
                <p className="text-sm">ยังไม่มีรูปสไลด์ — หน้าแรกแสดงพื้นหลังสีทึบ</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {slides.map((slide) => (
                  <li
                    key={slide.ID}
                    className="flex items-center gap-4 rounded-sm border border-line bg-paper/40 p-3"
                  >
                    <img
                      src={`${API_URL}${slide.image_url}`}
                      alt={`สไลด์ลำดับ ${slide.order}`}
                      className="w-32 h-20 object-cover rounded-sm border border-line shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <Label className="text-xs text-muted">ลำดับ</Label>
                      <input
                        type="number"
                        defaultValue={slide.order}
                        disabled={updateOrder.isPending}
                        // บันทึกตอน blur — ไม่ต้องมีปุ่ม save ต่อแถว
                        onBlur={(e) => {
                          const next = Number(e.target.value)
                          if (Number.isNaN(next) || next === slide.order) return
                          updateOrder.mutate({ id: slide.ID, order: next })
                        }}
                        className="mt-1 w-24 px-3 py-1.5 rounded-sm border border-line bg-white text-sm text-ink
                                   outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 disabled:opacity-50"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingText(slide)}
                      className="rounded-sm h-9 shrink-0 gap-1.5 border-line text-muted hover:bg-paper"
                    >
                      <Pencil className="h-3.5 w-3.5" /> ข้อความ
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      title={isLastSlide ? 'ลบรูปสุดท้ายไม่ได้ ต้องเหลืออย่างน้อย 1 รูป' : 'ลบรูปนี้'}
                      disabled={isLastSlide || deleteSlide.isPending}
                      onClick={() => {
                        if (window.confirm('ลบรูปสไลด์นี้ใช่ไหมครับ?')) deleteSlide.mutate(slide.ID)
                      }}
                      className="rounded-sm h-9 w-9 shrink-0 disabled:opacity-40 bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* เพิ่มรูปใหม่ */}
          <div className="rounded-md border border-line bg-white p-6 space-y-4">
            <div>
              <Label className="text-sm font-semibold text-ink">เพิ่มรูปสไลด์ใหม่</Label>
              <p className="text-xs text-muted mt-1">รองรับไฟล์ .jpg .jpeg .png</p>
            </div>

            {previewSrc && (
              <div className="relative w-full rounded-sm overflow-hidden border border-line bg-paper">
                <img src={previewSrc} alt="ตัวอย่างรูปที่เลือก" className="w-full max-h-80 object-contain mx-auto" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 rounded-full h-8 w-8 shadow-md"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">ลำดับ (ไม่กรอก = ต่อท้ายรูปสุดท้าย)</Label>
              <input
                type="number"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="เช่น 1"
                className="w-32 px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none
                           focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 h-11 rounded-sm border-2 border-dashed border-line cursor-pointer bg-paper/50 hover:bg-paper hover:border-teal transition-colors text-sm text-muted">
                <CloudUpload className="w-5 h-5 text-faint" strokeWidth={1.5} />
                <span>
                  <span className="font-semibold text-teal">เลือกรูปภาพ</span> เพื่อเพิ่มสไลด์
                </span>
                <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
              </label>

              <Button
                type="button"
                disabled={!selectedFile || addSlide.isPending}
                className="h-11 px-6 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors disabled:opacity-50"
                onClick={() => selectedFile && addSlide.mutate({ file: selectedFile, order: orderInput })}
              >
                {addSlide.isPending ? 'กำลังบันทึก...' : 'เพิ่มรูปสไลด์'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingText && (
        <HeroTextModal slide={editingText} onClose={() => setEditingText(null)} />
      )}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-muted">{label}</Label>
      {children}
    </div>
  )
}

// Modal แก้ข้อความ overlay ของสไลด์ (per-slide) + สวิตช์เปิด/ปิดข้อความ
function HeroTextModal({ slide, onClose }: { slide: HeroSlide; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    badge: slide.badge,
    title: slide.title,
    subtitle: slide.subtitle,
    button_text: slide.button_text,
    button_link: slide.button_link,
    show_text: slide.show_text,
  })

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const save = useMutation({
    mutationFn: (data: typeof form) =>
      requestAPI({ method: 'PUT', url: `/hero/${slide.ID}`, body: data }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'บันทึกไม่สำเร็จ')
        return
      }
      toast.success('บันทึกข้อความสไลด์แล้ว')
      qc.invalidateQueries({ queryKey: ['hero'] })
      onClose()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">แก้ข้อความสไลด์</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-sm hover:bg-paper flex items-center justify-center" aria-label="ปิด">
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        {/* สวิตช์เปิด/ปิดข้อความทั้งก้อน */}
        <div className="flex items-center justify-between rounded-sm border border-line bg-paper/40 px-4 py-3 mb-5">
          <div>
            <p className="text-sm font-medium text-ink">แสดงข้อความบนสไลด์นี้</p>
            <p className="text-xs text-muted">ปิด = โชว์แค่รูปเปล่า ไม่มีข้อความ</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.show_text}
            onClick={() => set('show_text', !form.show_text)}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.show_text ? 'bg-teal' : 'bg-line'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.show_text ? 'translate-x-5' : ''}`}
            />
          </button>
        </div>

        {/* ช่องข้อความ — จางลงเมื่อปิดการแสดงข้อความ */}
        <div className={`space-y-4 ${form.show_text ? '' : 'opacity-50 pointer-events-none'}`}>
          <Field label="ป้ายด้านบน (badge)">
            <input value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="เช่น โรงพยาบาลชุมชน อ.สะเมิง" className={inputCls} />
          </Field>
          <Field label="หัวข้อใหญ่ (Enter เพื่อขึ้นบรรทัดใหม่)">
            <textarea value={form.title} onChange={(e) => set('title', e.target.value)} rows={2} className={`${inputCls} resize-none`} />
          </Field>
          <Field label="คำโปรย (Enter เพื่อขึ้นบรรทัดใหม่)">
            <textarea value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} rows={3} className={`${inputCls} resize-none`} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="ข้อความปุ่ม">
              <input value={form.button_text} onChange={(e) => set('button_text', e.target.value)} placeholder="เช่น ติดต่อเรา" className={inputCls} />
            </Field>
            <Field label="ลิงก์ปุ่ม (path ในเว็บ)">
              <input value={form.button_link} onChange={(e) => set('button_link', e.target.value)} placeholder="เช่น /about/contact" className={inputCls} />
            </Field>
          </div>
          <p className="text-xs text-muted">เว้นช่องไหนว่าง = ไม่แสดงส่วนนั้น (เช่น ไม่กรอกข้อความปุ่ม = ไม่มีปุ่ม)</p>
        </div>

        <div className="flex gap-3 pt-6">
          <Button type="button" variant="outline" className="w-1/3 h-11 rounded-sm border-line text-muted hover:bg-paper font-medium" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            type="button"
            disabled={save.isPending}
            onClick={() => save.mutate(form)}
            className="w-2/3 h-11 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors disabled:opacity-50"
          >
            {save.isPending ? 'กำลังบันทึก...' : 'บันทึกข้อความ'}
          </Button>
        </div>
      </div>
    </div>
  )
}
