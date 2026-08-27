import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { requestAPI } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// เพิ่ม "หน้าเนื้อหา" ใหม่ 1 หน้า — หน้าจะไปโผล่ที่ /about/<slug> และในเมนู
// "เกี่ยวกับเรา" บนเว็บให้เอง (ดู src/lib/use-navbar-list.ts)
//
// แยกเป็นหน้าของตัวเองตามแบบเดียวกับ personnel/create · ITA/create · staftmenu/create
// เพื่อให้ sidebar มีเมนูย่อย "รายการ / เพิ่ม" เหมือนหมวดอื่นทั้งหมด
export const Route = createFileRoute('/_admin/admin/content/create')({
  component: RouteComponent,
})

// typed as string เพื่อให้ผ่าน typed-route ของ TanStack
const LIST_PATH: string = '/admin/content'

/** เดา slug จากชื่อ — backend รับแค่ ascii ชื่อไทยจึงเดาให้ไม่ได้
 *  (ปล่อยช่องว่างไว้ให้คนกรอกเอง ดีกว่าใส่ค่ามั่ว ๆ ที่ลบไม่ได้ทีหลัง) */
function slugHint(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function RouteComponent() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState({ title: '', slug: '', description: '' })
  // จำไว้ว่าคนแก้ slug เองหรือยัง — แก้เองแล้วห้ามให้การพิมพ์ชื่อไปทับ
  const [slugTouched, setSlugTouched] = useState(false)

  const create = useMutation({
    mutationFn: () =>
      requestAPI({
        method: 'POST',
        url: '/content/sections',
        body: {
          slug: form.slug.trim(),
          title: form.title.trim(),
          description: form.description.trim(),
          // ต่อท้ายเสมอ — ลำดับปรับทีหลังได้ ไม่ต้องให้กรอกตั้งแต่ตอนสร้าง
          sort_order: 99,
        },
      }),
    onSuccess: (resp) => {
      if (!resp.success) {
        // เคสหลัก: slug ซ้ำ หรือ slug ไม่มีตัวอักษรอังกฤษเลย — โชว์ข้อความจาก backend ตรง ๆ
        toast.error(resp.message || 'เพิ่มหน้าไม่สำเร็จ')
        return
      }
      toast.success('เพิ่มหน้าสำเร็จ')
      // ล้างคิวเดียวกับที่เมนูหน้าเว็บใช้ ผู้ใช้จะได้เห็นหน้าใหม่ในเมนูทันที
      qc.invalidateQueries({ queryKey: ['content-sections'] })
      navigate({ to: LIST_PATH })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('กรุณากรอกชื่อหน้าและที่อยู่หน้าให้ครบ')
      return
    }
    create.mutate()
  }

  return (
    <div className="text-ink mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">เพิ่มหน้าเนื้อหา</h1>
        <p className="text-muted mt-1 text-sm">
          สร้างหน้าใหม่ใต้เมนู "เกี่ยวกับเรา" — สร้างเสร็จแล้วค่อยไปเพิ่มหัวข้อและแนบเอกสารในหน้ารายการ
        </p>
      </div>

      <div className="border-line bg-paper/50 mb-6 flex gap-2.5 rounded-md border p-4">
        <Info className="text-teal mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-muted text-xs leading-relaxed">
          หน้าใหม่จะไปอยู่ในเมนู <span className="text-ink font-semibold">"เกี่ยวกับเรา"</span>{' '}
          บนเว็บให้เอง ไม่ต้องแจ้งใครเพิ่ม
          <br />
          ใช้สำหรับกลุ่มเอกสารที่มีหลายหัวข้อ เช่น ชมรมจริยธรรม — ถ้าเป็นประกาศชิ้นเดียวควรลงเป็น
          <span className="text-ink font-semibold"> ข่าว</span> แทน
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-line space-y-6 rounded-md border bg-white p-6 sm:p-8"
      >
        <div className="space-y-2">
          <Label className="text-muted text-sm font-medium">ชื่อหน้า</Label>
          <input
            type="text"
            autoFocus
            value={form.title}
            onChange={(e) => {
              const title = e.target.value
              setForm((f) => ({
                ...f,
                title,
                slug: slugTouched ? f.slug : slugHint(title),
              }))
            }}
            required
            placeholder="เช่น แนวทางปฏิบัติป้องกันการติดเชื้อ"
            className="border-line text-ink focus:border-teal focus:ring-teal/20 w-full rounded-sm border bg-white px-4 py-2.5 outline-none transition-colors focus:ring-2"
          />
          <p className="text-faint text-xs">ชื่อที่แสดงบนหัวหน้าเว็บและในเมนู</p>
        </div>

        <div className="space-y-2">
          <Label className="text-muted text-sm font-medium">ที่อยู่หน้า (ภาษาอังกฤษ)</Label>
          <div className="flex items-center gap-1.5">
            <span className="text-faint shrink-0 text-sm">/about/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setForm((f) => ({ ...f, slug: e.target.value }))
              }}
              required
              placeholder="infection-control"
              className="border-line text-ink focus:border-teal focus:ring-teal/20 min-w-0 flex-1 rounded-sm border bg-white px-4 py-2.5 outline-none transition-colors focus:ring-2"
            />
          </div>
          <p className="text-faint text-xs">
            ใช้ได้เฉพาะ a-z 0-9 และขีด ·{' '}
            <span className="text-ink font-semibold">ตั้งแล้วแก้ไม่ได้</span>{' '}
            เพราะเป็นลิงก์ที่คนบันทึกหรือส่งต่อกันไปแล้ว
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-muted text-sm font-medium">คำอธิบายใต้ชื่อหน้า (ไม่บังคับ)</Label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="อธิบายสั้น ๆ ว่าหน้านี้รวบรวมเอกสารอะไร"
            className="border-line text-ink focus:border-teal focus:ring-teal/20 w-full rounded-sm border bg-white px-4 py-2.5 outline-none transition-colors focus:ring-2"
          />
        </div>

        <div className="border-line flex gap-3 border-t pt-2">
          <Button
            type="submit"
            disabled={create.isPending}
            className="bg-teal h-10 rounded-sm text-white disabled:opacity-40"
          >
            {create.isPending ? 'กำลังบันทึก...' : 'เพิ่มหน้า'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: LIST_PATH })}
            className="border-line text-muted hover:bg-paper h-10 rounded-sm"
          >
            ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  )
}
