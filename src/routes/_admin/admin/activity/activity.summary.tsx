import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, X, CloudUpload, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { requestAPI } from '@/lib/api'
import type ActivityInfo from '@/interface/activity_info'
import { MAX_ACTIVITY_IMAGES } from '@/interface/activity_info'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { SummaryPageShell } from '@/components/summary-page-shell'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_admin/admin/activity/activity/summary')({
  component: ActivitySummaryPage,
})

// typed as string เพื่อให้ผ่าน typed-route ของ TanStack (pattern เดียวกับหน้าข่าว/บุคลากร)
const CREATE_PATH: string = '/admin/activity'
const API_URL = import.meta.env.VITE_API_URL

const formatDate = (d: string) => {
  if (!d) return '-'
  const date = new Date(d)
  return isNaN(date.getTime()) ? d : date.toLocaleDateString('th-TH')
}

function ActivitySummaryPage() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<ActivityInfo | null>(null)

  const { data, isLoading } = useQuery<ActivityInfo[]>({
    queryKey: ['activity'],
    queryFn: async () => {
      const resp = await requestAPI<ActivityInfo[]>({ method: 'GET', url: '/activities' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  // เรียงตามวันที่เริ่มล่าสุด (ใหม่→เก่า) ก่อนส่งเข้า DataTable
  const activities = useMemo(() => {
    const list = data ?? []
    return [...list].sort(
      (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
    )
  }, [data])

  const deleteActivity = useMutation({
    mutationFn: (id: string) => requestAPI({ method: 'DELETE', url: `/activities/${id}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'ลบไม่สำเร็จ')
        return
      }
      toast.success('ลบกิจกรรมสำเร็จ')
      qc.invalidateQueries({ queryKey: ['activity'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const confirmDelete = (a: ActivityInfo) => {
    if (window.confirm(`ลบกิจกรรม "${a.title}" ใช่ไหมครับ?`)) deleteActivity.mutate(a.id)
  }

  const columns: DataTableColumn<ActivityInfo>[] = [
    {
      key: 'title',
      header: 'ชื่อกิจกรรม',
      render: (row) => row.title,
      searchValue: (row) => row.title,
    },
    {
      key: 'start_date',
      header: 'วันที่เริ่ม',
      render: (row) => formatDate(row.start_date),
    },
    {
      key: 'end_date',
      header: 'วันที่สิ้นสุด',
      render: (row) => formatDate(row.end_date),
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
            disabled={deleteActivity.isPending}
            className="w-7 h-7 rounded-sm hover:bg-danger/10 flex items-center justify-center disabled:opacity-50"
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
      crumbs={[
        { label: 'ภาพรวมระบบ', to: '/admin/dashboard' },
        { label: 'กิจกรรม' },
      ]}
      title="กิจกรรมทั้งหมด"
      subtitle="รายการกิจกรรมทั้งหมดในระบบ ค้นหาและจัดการได้จากตารางด้านล่าง"
      action={
        <Link
          to={CREATE_PATH}
          className="flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal/90 text-white text-sm font-semibold rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่มกิจกรรม
        </Link>
      }
    >
      <DataTable
        data={activities}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="ค้นหากิจกรรม..."
        emptyLabel="ยังไม่มีกิจกรรมในระบบ"
        rowKey={(row) => row.id}
      />

      {editing && <ActivityEditModal activity={editing} onClose={() => setEditing(null)} />}
    </SummaryPageShell>
  )
}

function ActivityEditModal({ activity, onClose }: { activity: ActivityInfo; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    title: activity.title,
    description: activity.description,
    startDate: activity.start_date,
    endDate: activity.end_date,
    image: null as File | null,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('อัปโหลดได้เฉพาะไฟล์รูปภาพ (.jpg/.jpeg/.png)')
      return
    }
    setForm({ ...form, image: file })
  }

  // ── อัลบั้มรูป ────────────────────────────────────────────────────────────
  // ดึงรายตัวเองเพราะ prop `activity` เป็น snapshot ของแถวใน list ตอนกดแก้ไข
  // เพิ่ม/ลบรูปแล้วมันไม่อัปเดตตาม — query นี้ทำให้อัลบั้มบนจอตรงกับของจริงเสมอ
  const { data: fresh } = useQuery<ActivityInfo>({
    queryKey: ['activity', activity.id],
    queryFn: async () => {
      const resp = await requestAPI<ActivityInfo>({ method: 'GET', url: `/activities/${activity.id}` })
      if (!resp.success) throw new Error('โหลดข้อมูลกิจกรรมไม่สำเร็จ')
      return resp.data
    },
    initialData: activity,
  })

  const album = fresh?.images ?? []
  const usedSlots = (fresh?.img_url ? 1 : 0) + album.length
  const slotsLeft = MAX_ACTIVITY_IMAGES - usedSlots

  const refreshAlbum = () => {
    qc.invalidateQueries({ queryKey: ['activity'] })
    qc.invalidateQueries({ queryKey: ['activity', activity.id] })
  }

  const addImages = useMutation({
    mutationFn: (files: File[]) => {
      const body = new FormData()
      for (const f of files) body.append('images', f)
      return requestAPI({ method: 'POST', url: `/activities/${activity.id}/images`, body })
    },
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'เพิ่มรูปไม่สำเร็จ')
        return
      }
      toast.success('เพิ่มรูปสำเร็จ')
      refreshAlbum()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const removeImage = useMutation({
    mutationFn: (imageId: number) =>
      requestAPI({ method: 'DELETE', url: `/activities/${activity.id}/images/${imageId}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'ลบรูปไม่สำเร็จ')
        return
      }
      toast.success('ลบรูปสำเร็จ')
      refreshAlbum()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = '' // เคลียร์ input ให้เลือกไฟล์เดิมซ้ำได้ถ้าพลาด
    if (!files.length) return
    if (files.some((f) => !['image/jpeg', 'image/png'].includes(f.type))) {
      toast.error('อัปโหลดได้เฉพาะไฟล์รูปภาพ (.jpg/.jpeg/.png)')
      return
    }
    // เช็คโควตาตั้งแต่ฝั่งนี้ ผู้ใช้จะได้รู้ก่อนรออัปโหลดจนเสร็จแล้วโดนปฏิเสธ
    // (backend เป็นคนบังคับจริง และปฏิเสธทั้งชุดถ้าเกิน)
    if (files.length > slotsLeft) {
      toast.error(`เพิ่มได้อีกไม่เกิน ${slotsLeft} รูป (เพดาน ${MAX_ACTIVITY_IMAGES} รูปต่อกิจกรรม นับรวมรูปปกแล้ว)`)
      return
    }
    addImages.mutate(files)
  }

  const updateActivity = useMutation({
    mutationFn: (data: typeof form) => {
      const body = new FormData()
      body.append('title', data.title)
      body.append('description', data.description)
      body.append('startDate', data.startDate)
      body.append('endDate', data.endDate)
      if (data.image) body.append('image', data.image)
      return requestAPI({ method: 'PUT', url: `/activities/${activity.id}`, body })
    },
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'บันทึกไม่สำเร็จ')
        return
      }
      toast.success('แก้ไขกิจกรรมสำเร็จ')
      qc.invalidateQueries({ queryKey: ['activity'] })
      onClose()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.startDate.trim()) {
      toast.error('กรุณากรอกชื่อกิจกรรมและวันที่เริ่มให้ครบ')
      return
    }
    updateActivity.mutate(form)
  }

  // แสดง preview: รูปใหม่ที่เลือก > รูปเดิมจาก server
  const previewSrc = form.image
    ? URL.createObjectURL(form.image)
    : activity.img_url
      ? `${API_URL}${activity.img_url}`
      : ''

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">แก้ไขกิจกรรม</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-sm hover:bg-paper flex items-center justify-center" aria-label="ปิด">
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">ชื่อกิจกรรม</Label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">วันที่เริ่ม</Label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">วันที่สิ้นสุด</Label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">รายละเอียด</Label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">รูปกิจกรรม (ไม่เลือก = ใช้รูปเดิม)</Label>
            <div className="flex items-center gap-4">
              {previewSrc ? (
                <img src={previewSrc} alt="ตัวอย่าง" className="w-20 h-20 rounded-sm object-cover border border-line shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-sm bg-paper border border-line flex items-center justify-center shrink-0 text-faint">
                  <ImageIcon className="w-8 h-8" strokeWidth={1.5} />
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

          {/* ── อัลบั้มรูปเพิ่มเติม ──
              เพดานนับรวมรูปปกด้วย (ปก 1 + อัลบั้มไม่เกิน 11 = 12)
              เพิ่ม/ลบมีผลทันที ไม่ต้องกด "บันทึกการแก้ไข" — คนละ endpoint กับฟอร์ม */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted">รูปเพิ่มเติม (อัลบั้ม)</Label>
              <span className="text-xs text-faint">
                ใช้ไป {usedSlots}/{MAX_ACTIVITY_IMAGES} รูป (นับรวมรูปปก)
              </span>
            </div>

            {album.length > 0 && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {album.map((img) => (
                  <div key={img.id} className="relative aspect-square">
                    <img
                      src={`${API_URL}${img.img_url}`}
                      alt=""
                      className="h-full w-full rounded-sm border border-line object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('ลบรูปนี้ออกจากอัลบั้มใช่ไหมครับ?')) removeImage.mutate(img.id)
                      }}
                      disabled={removeImage.isPending}
                      aria-label="ลบรูปนี้"
                      className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow-sm ring-1 ring-line transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {slotsLeft > 0 ? (
              <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-sm border-2 border-dashed border-line bg-paper/50 text-sm text-muted transition-colors hover:border-teal hover:bg-paper">
                <CloudUpload className="h-5 w-5 text-faint" strokeWidth={1.5} />
                <span>
                  <span className="font-semibold text-teal">
                    {addImages.isPending ? 'กำลังอัปโหลด...' : 'เพิ่มรูปเข้าอัลบั้ม'}
                  </span>{' '}
                  (เลือกได้อีก {slotsLeft} รูป)
                </span>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  multiple
                  disabled={addImages.isPending}
                  className="hidden"
                  onChange={handleAlbumChange}
                />
              </label>
            ) : (
              <p className="rounded-sm border border-line bg-paper/50 px-3 py-2.5 text-center text-sm text-muted">
                มีรูปครบ {MAX_ACTIVITY_IMAGES} รูปแล้ว — ลบรูปเดิมก่อนถึงจะเพิ่มได้
              </p>
            )}
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
              disabled={updateActivity.isPending}
              className="w-2/3 h-11 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors disabled:opacity-50"
            >
              {updateActivity.isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
