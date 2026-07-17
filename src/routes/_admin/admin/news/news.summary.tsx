import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  ChevronDown, Plus, Pencil, Trash2, X, ExternalLink, CloudUpload, CheckCircle2, FileText, UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { requestAPI } from '@/lib/api'
import { NEWS_TYPES, type NewsInfo } from '@/interface/newinfo'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { SummaryPageShell } from '@/components/summary-page-shell'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_admin/admin/news/news/summary')({
  component: NewsSummaryPage,
})

// typed as string เพื่อให้ผ่าน typed-route ของ TanStack (pattern เดียวกับหน้าบุคลากร)
const CREATE_PATH: string = '/admin/news'
const API_URL = import.meta.env.VITE_API_URL

function NewsSummaryPage() {
  const qc = useQueryClient()
  const [typeFilter, setTypeFilter] = useState('')
  const [editing, setEditing] = useState<NewsInfo | null>(null)

  const { data, isLoading } = useQuery<NewsInfo[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const resp = await requestAPI<NewsInfo[]>({ method: 'GET', url: '/news' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const news = useMemo(() => data ?? [], [data])

  // ตัวเลือกประเภท = ประเภทที่มีจริงในข้อมูล (derive จาก data ไม่ต้อง maintain list แยก)
  const typeOptions = useMemo(
    () => Array.from(new Set(news.map((n) => n.type).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [news],
  )

  // กรองตามประเภท + เรียงตามวันที่ล่าสุด (ใหม่→เก่า) ก่อนส่งเข้า DataTable
  // ช่องค้นหาข้อความของ DataTable ทำงานซ้อนต่อได้
  const filteredNews = useMemo(() => {
    const list = typeFilter ? news.filter((n) => n.type === typeFilter) : news
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [news, typeFilter])

  const deleteNews = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/news/${id}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'ลบไม่สำเร็จ')
        return
      }
      toast.success('ลบข่าวสำเร็จ')
      qc.invalidateQueries({ queryKey: ['news'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const confirmDelete = (n: NewsInfo) => {
    if (window.confirm(`ลบข่าว "${n.title}" ใช่ไหมครับ?`)) deleteNews.mutate(n.id)
  }

  const columns: DataTableColumn<NewsInfo>[] = [
    {
      key: 'title',
      header: 'หัวข้อข่าว',
      render: (row) => row.title,
      searchValue: (row) => row.title,
    },
    {
      key: 'type',
      header: 'ประเภท',
      render: (row) => (
        <span className="text-xs px-2 py-0.5 rounded-sm border border-line text-teal">
          {row.type}
        </span>
      ),
      searchValue: (row) => row.type,
    },
    {
      key: 'date',
      header: 'วันที่เผยแพร่',
      render: (row) => {
        if (!row.date) return '-'
        const date = new Date(row.date)
        return isNaN(date.getTime()) ? row.date : date.toLocaleDateString('th-TH')
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          {row.file_url && (
            <a
              href={`${API_URL}${row.file_url}`}
              target="_blank"
              rel="noopener noreferrer"
              title="เปิดไฟล์ PDF"
              className="w-7 h-7 rounded-sm hover:bg-teal/10 flex items-center justify-center"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal" />
            </a>
          )}
          <button
            onClick={() => setEditing(row)}
            className="w-7 h-7 rounded-sm hover:bg-white flex items-center justify-center"
            aria-label="แก้ไข"
          >
            <Pencil className="w-3.5 h-3.5 text-muted" />
          </button>
          <button
            onClick={() => confirmDelete(row)}
            disabled={deleteNews.isPending}
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
        { label: 'รายการข่าวสาร' },
      ]}
      title="ข่าวสารทั้งหมด"
      subtitle="รายการข่าวทั้งหมดในระบบ ค้นหาและจัดการได้จากตารางด้านล่าง"
      action={
        <Link
          to={CREATE_PATH}
          className="flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal/90 text-white text-sm font-semibold rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่มข่าว
        </Link>
      }
    >
      <DataTable
        data={filteredNews}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="ค้นหาข่าว..."
        emptyLabel={typeFilter ? `ไม่มีข่าวประเภท "${typeFilter}"` : 'ยังไม่มีข่าวในระบบ'}
        rowKey={(row) => row.id}
        toolbar={
          // Filter ตามประเภทข่าว — ค่า = ค่า type ที่มีจริงในข้อมูล
          <div className="relative w-44 shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-sm border border-line bg-white text-sm text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 cursor-pointer"
            >
              <option value="">ทุกประเภท</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-faint">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        }
      />

      {editing && <NewsEditModal news={editing} onClose={() => setEditing(null)} />}
    </SummaryPageShell>
  )
}

function NewsEditModal({ news, onClose }: { news: NewsInfo; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    title: news.title,
    type: news.type,
    date: news.date,
    description: news.description,
    file: null as File | null,
    image: null as File | null,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('อัปโหลดได้เฉพาะไฟล์ PDF')
      return
    }
    setForm({ ...form, file })
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

  const updateNews = useMutation({
    mutationFn: (data: typeof form) => {
      const body = new FormData()
      body.append('title', data.title)
      body.append('description', data.description)
      body.append('date', data.date)
      body.append('type', data.type)
      if (data.file) body.append('file', data.file)
      if (data.image) body.append('image', data.image)
      return requestAPI({ method: 'PUT', url: `/news/${news.id}`, body })
    },
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'บันทึกไม่สำเร็จ')
        return
      }
      toast.success('แก้ไขข่าวสำเร็จ')
      qc.invalidateQueries({ queryKey: ['news'] })
      onClose()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date.trim() || !form.type.trim()) {
      toast.error('กรุณากรอกหัวข้อ ประเภท และวันที่ให้ครบ')
      return
    }
    updateNews.mutate(form)
  }

  // แสดง preview: รูปใหม่ที่เลือก > รูปเดิมจาก server
  const previewSrc = form.image
    ? URL.createObjectURL(form.image)
    : news.img_url
      ? `${API_URL}${news.img_url}`
      : ''

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">แก้ไขข่าว</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-sm hover:bg-paper flex items-center justify-center" aria-label="ปิด">
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">หัวข้อข่าว</Label>
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
              <Label className="text-sm font-medium text-muted">ประเภทข่าว</Label>
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none px-3 py-2 rounded-sm border border-line bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 cursor-pointer"
                >
                  <option value="">-- เลือกประเภท --</option>
                  {NEWS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  {/* กันเคส type เดิมไม่อยู่ใน list (ข้อมูลเก่า) ให้ยังเลือกค้างไว้ได้ */}
                  {form.type && !(NEWS_TYPES as readonly string[]).includes(form.type) && (
                    <option value={form.type}>{form.type} (เดิม)</option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-faint">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted">วันที่เผยแพร่</Label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
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
            <Label className="text-sm font-medium text-muted">ไฟล์ PDF (ไม่เลือก = ใช้ไฟล์เดิม)</Label>
            {news.file_url && !form.file && (
              <a
                href={`${API_URL}${news.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-teal hover:underline"
              >
                <FileText className="w-3.5 h-3.5" /> ไฟล์ปัจจุบัน
              </a>
            )}
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="block w-full text-xs text-gray-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-sm file:border-0 file:bg-teal/10 file:text-teal file:text-xs file:font-medium hover:file:bg-teal/20"
            />
            {form.file && (
              <p className="text-xs text-teal flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {form.file.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">รูปหน้าปก (ไม่เลือก = ใช้รูปเดิม)</Label>
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
              disabled={updateNews.isPending}
              className="w-2/3 h-11 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors disabled:opacity-50"
            >
              {updateNews.isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
