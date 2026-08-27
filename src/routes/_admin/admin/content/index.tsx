import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { ContentGroup, ContentSection } from '@/interface/content'
import { requestAPI } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Info,
  Paperclip,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// จัดการหน้าเนื้อหาที่แก้ได้จากหลังบ้าน (ความปลอดภัยด้านยา / ชมรมจริยธรรม / PDPA)
//
// 3 ชั้น: หน้า (section) → หัวข้อ (group) → เอกสาร (file) — สร้าง/ลบได้ครบทุกชั้น
//
// หน้าใหม่ที่สร้างจากที่นี่โผล่ในเมนู "เกี่ยวกับเรา" ให้เอง (ดู useNavbarList)
// ไม่ต้องกลับไปแก้ src/interface/menu.ts อีก
export const Route = createFileRoute('/_admin/admin/content/')({
  component: RouteComponent,
})

const API_URL = import.meta.env.VITE_API_URL

// typed as string เพื่อให้ผ่าน typed-route ของ TanStack
const CREATE_PATH: string = '/admin/content/create'

function RouteComponent() {
  const qc = useQueryClient()
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  const { data: sections = [], isLoading } = useQuery<ContentSection[]>({
    queryKey: ['content-sections'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<ContentSection[]>({ method: 'GET', url: '/content/sections' })
      return resp.success ? (resp.data ?? []) : []
    },
  })

  return (
    <div className="text-ink mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">จัดการหน้าเนื้อหา</h1>
        <p className="text-muted mt-1 text-sm">
          หน้าที่อยู่ใต้เมนู "เกี่ยวกับเรา" — สร้างหน้า เพิ่มหัวข้อ และแนบเอกสารได้เองโดยไม่ต้องแก้โค้ด
        </p>
      </div>

      <div className="border-line bg-paper/50 mb-6 flex gap-2.5 rounded-md border p-4">
        <Info className="text-teal mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-muted text-xs leading-relaxed">
          <span className="text-ink font-semibold">ปีงบประมาณ</span> — ใส่เฉพาะหน้าที่แยกตามปี
          (เช่น ชมรมจริยธรรม) หน้าเว็บจะขึ้นปุ่มสลับปีให้เอง ปีใหม่เพิ่มได้จากที่นี่เลย
          <br />
          <span className="text-ink font-semibold">ไม่ใส่ปี</span> — หัวข้อจะแสดงตลอด ไม่ว่าเลือกปีไหน
          <br />
          ลบหัวข้อ = ลบเอกสารที่อยู่ข้างในทั้งหมดด้วย
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted py-16 text-center text-sm">กำลังโหลด...</p>
      ) : sections.length === 0 ? (
        <div className="border-line bg-paper/50 text-faint flex h-40 w-full flex-col items-center justify-center rounded-sm border border-dashed">
          <FileText className="mb-2 h-7 w-7" strokeWidth={1.5} />
          <p className="text-sm">ยังไม่มีหน้าเนื้อหาในระบบ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isOpen={openSlug === section.slug}
              onToggle={() => setOpenSlug((p) => (p === section.slug ? null : section.slug))}
              onChanged={() => qc.invalidateQueries({ queryKey: ['content-section', section.slug] })}
            />
          ))}
        </div>
      )}

      {/* ฟอร์มสร้างหน้าอยู่คนละหน้า (/admin/content/create) ตามแบบเดียวกับ
          บุคลากร/ข่าว/กิจกรรม — sidebar จะได้มีเมนูย่อย "รายการ / เพิ่ม" เหมือนกันทุกหมวด */}
      <div className="mt-4">
        <Link
          to={CREATE_PATH}
          className="border-line text-muted hover:bg-paper flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-dashed text-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> เพิ่มหน้าใหม่
        </Link>
      </div>
    </div>
  )
}

function SectionCard({
  section,
  isOpen,
  onToggle,
  onChanged,
}: {
  section: ContentSection
  isOpen: boolean
  onToggle: () => void
  onChanged: () => void
}) {
  const qc = useQueryClient()
  const [adding, setAdding] = useState(false)

  // ดึงรายละเอียดเฉพาะตอนกางออก — รายการรวมไม่ส่ง groups มาให้
  const { data: detail, isLoading } = useQuery<ContentSection | null>({
    queryKey: ['content-section', section.slug],
    enabled: isOpen,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<ContentSection>({
        method: 'GET',
        url: `/content/sections/${section.slug}`,
      })
      return resp.success ? (resp.data ?? null) : null
    },
  })

  const groups = detail?.groups ?? []
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['content-section', section.slug] })
    onChanged()
  }

  const removeSection = useMutation({
    mutationFn: () => requestAPI({ method: 'DELETE', url: `/content/sections/${section.slug}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'ลบหน้าไม่สำเร็จ')
        return
      }
      toast.success('ลบหน้าแล้ว')
      // ล้างทั้ง 2 คิว: รายการหน้า และเมนูบนเว็บที่ใช้คิวเดียวกัน
      qc.invalidateQueries({ queryKey: ['content-sections'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  return (
    <div className="border-line overflow-hidden rounded-md border bg-white">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="hover:bg-paper/40 flex w-full items-center gap-3 px-5 py-4 text-left transition-colors"
      >
        <span className="min-w-0 flex-1">
          <span className="text-ink block text-[15px] font-semibold">{section.title}</span>
          <span className="text-faint block text-xs">/about/{section.slug}</span>
        </span>

        <a
          href={`/about/${section.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          title="เปิดดูหน้าจริง"
          onClick={(e) => e.stopPropagation()}
          className="text-faint hover:text-teal shrink-0 p-1.5"
        >
          <ExternalLink className="h-4 w-4" />
        </a>

        <ChevronDown
          className={`text-faint h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="border-line bg-paper/30 space-y-3 border-t px-5 py-4">
          {isLoading ? (
            <p className="text-muted py-6 text-center text-sm">กำลังโหลด...</p>
          ) : (
            <>
              {groups.length === 0 ? (
                <p className="text-faint py-4 text-center text-sm">ยังไม่มีหัวข้อในหน้านี้</p>
              ) : (
                groups.map((g) => <GroupRow key={g.id} group={g} onChanged={refresh} />)
              )}

              {adding ? (
                <AddGroupForm
                  slug={section.slug}
                  nextOrder={groups.length + 1}
                  onDone={() => {
                    setAdding(false)
                    refresh()
                  }}
                  onCancel={() => setAdding(false)}
                />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAdding(true)}
                  className="border-line text-muted hover:bg-paper h-9 w-full gap-1.5 rounded-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> เพิ่มหัวข้อ
                </Button>
              )}

              {/* ลบทั้งหน้า — วางไว้ล่างสุดในกล่องที่กางออกแล้วเท่านั้น
                  ให้ต้องตั้งใจกดจริง ๆ ไม่ใช่ปุ่มถังขยะลอยอยู่ข้างชื่อหน้าให้กดพลาด */}
              <div className="border-line/70 mt-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={removeSection.isPending}
                  onClick={() => {
                    if (
                      window.confirm(
                        `ลบหน้า "${section.title}" ทั้งหน้าใช่ไหมครับ?\n` +
                          `หัวข้อ ${groups.length} หัวข้อและเอกสารข้างในทั้งหมดจะถูกลบไปด้วย\n` +
                          `ลิงก์ /about/${section.slug} ที่เคยส่งให้ใครไว้จะใช้ไม่ได้อีก`,
                      )
                    ) {
                      removeSection.mutate()
                    }
                  }}
                  className="h-8 gap-1.5 rounded-sm border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> ลบหน้านี้ทั้งหน้า
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function GroupRow({ group, onChanged }: { group: ContentGroup; onChanged: () => void }) {
  const [files, setFiles] = useState<File[]>([])

  const addFiles = useMutation({
    mutationFn: (picked: File[]) => {
      const form = new FormData()
      for (const f of picked) {
        form.append('files', f)
        // ไม่ใส่ชื่อเอง = backend ใช้ชื่อไฟล์เดิม แก้ชื่อทีหลังได้
        form.append('labels', f.name.replace(/\.[^.]+$/, ''))
      }
      return requestAPI({ method: 'POST', url: `/content/groups/${group.id}/files`, body: form })
    },
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'แนบไฟล์ไม่สำเร็จ')
        return
      }
      toast.success('แนบไฟล์แล้ว')
      setFiles([])
      onChanged()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const removeFile = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/content/files/${id}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'ลบไฟล์ไม่สำเร็จ')
        return
      }
      toast.success('ลบไฟล์แล้ว')
      onChanged()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const renameFile = useMutation({
    mutationFn: (v: { id: number; label: string; sort_order: number }) =>
      requestAPI({ method: 'PUT', url: `/content/files/${v.id}`, body: v }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'แก้ชื่อไม่สำเร็จ')
        return
      }
      onChanged()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const removeGroup = useMutation({
    mutationFn: () => requestAPI({ method: 'DELETE', url: `/content/groups/${group.id}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'ลบหัวข้อไม่สำเร็จ')
        return
      }
      toast.success('ลบหัวข้อแล้ว')
      onChanged()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  return (
    <div className="border-line rounded-sm border bg-white p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-ink text-sm leading-relaxed font-medium">{group.title}</p>
          <p className="text-faint mt-0.5 text-xs">
            {group.year ? `ปีงบประมาณ ${group.year}` : 'ไม่ผูกปี'}
            {' · '}
            {group.files.length} เอกสาร
            {group.body ? ` · เนื้อความ ${group.body.length} ตัวอักษร` : ''}
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="icon"
          title="ลบหัวข้อนี้พร้อมเอกสารข้างใน"
          disabled={removeGroup.isPending}
          onClick={() => {
            if (
              window.confirm(
                `ลบหัวข้อ "${group.title}" ใช่ไหมครับ?\nเอกสาร ${group.files.length} ไฟล์ในหัวข้อนี้จะถูกลบไปด้วย`,
              )
            ) {
              removeGroup.mutate()
            }
          }}
          className="h-9 w-9 shrink-0 rounded-sm bg-red-600 disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {group.files.length > 0 && (
        <ul className="mb-3 space-y-2">
          {group.files.map((f) => (
            <li key={f.id} className="border-line bg-paper/40 flex items-center gap-2 rounded-sm border p-2">
              <a
                href={`${API_URL}${f.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                title="เปิดดูไฟล์"
                className="text-faint hover:text-teal shrink-0 p-1"
              >
                <Paperclip className="h-3.5 w-3.5" />
              </a>
              <input
                defaultValue={f.label}
                disabled={renameFile.isPending}
                // บันทึกตอน blur เหมือนช่องลำดับของหน้ารูปสไลด์ ไม่ต้องมีปุ่ม save ต่อแถว
                onBlur={(e) => {
                  const label = e.target.value.trim()
                  if (!label || label === f.label) {
                    e.target.value = f.label
                    return
                  }
                  renameFile.mutate({ id: f.id, label, sort_order: f.sort_order })
                }}
                className="border-line text-ink focus:border-teal focus:ring-teal/20 min-w-0 flex-1 rounded-sm border bg-white px-2.5 py-1.5 text-xs outline-none focus:ring-2 disabled:opacity-50"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                title="ลบไฟล์นี้"
                disabled={removeFile.isPending}
                onClick={() => {
                  if (window.confirm(`ลบไฟล์ "${f.label}" ใช่ไหมครับ?`)) removeFile.mutate(f.id)
                }}
                className="h-8 w-8 shrink-0 rounded-sm bg-red-600 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="text-muted file:border-line file:bg-paper file:text-ink min-w-0 flex-1 text-xs file:mr-2 file:rounded-sm file:border file:px-2.5 file:py-1"
        />
        <Button
          type="button"
          size="sm"
          disabled={files.length === 0 || addFiles.isPending}
          onClick={() => addFiles.mutate(files)}
          className="bg-teal h-8 shrink-0 gap-1.5 rounded-sm text-white disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          {addFiles.isPending ? 'กำลังอัปโหลด...' : `แนบ ${files.length || ''} ไฟล์`}
        </Button>
      </div>
    </div>
  )
}

function AddGroupForm({
  slug,
  nextOrder,
  onDone,
  onCancel,
}: {
  slug: string
  nextOrder: number
  onDone: () => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [body, setBody] = useState('')

  const create = useMutation({
    mutationFn: () =>
      requestAPI({
        method: 'POST',
        url: `/content/sections/${slug}/groups`,
        body: {
          title: title.trim(),
          body,
          // ช่องว่าง = ไม่ผูกปี ต้องส่ง null ไม่ใช่ 0 (backend ตรวจว่าเป็น พ.ศ. จริง)
          year: year.trim() ? Number(year.trim()) : null,
          sort_order: nextOrder,
        },
      }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'เพิ่มหัวข้อไม่สำเร็จ')
        return
      }
      toast.success('เพิ่มหัวข้อแล้ว')
      onDone()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  return (
    <div className="border-teal/30 bg-teal/5 space-y-3 rounded-sm border border-dashed p-4">
      <div>
        <Label className="text-muted text-xs">ชื่อหัวข้อ</Label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="เช่น แผนปฏิบัติการส่งเสริมคุณธรรม ปีงบประมาณ 2570"
          className="border-line text-ink focus:border-teal focus:ring-teal/20 mt-1 w-full rounded-sm border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
        />
      </div>

      <div>
        <Label className="text-muted text-xs">ปีงบประมาณ (ไม่บังคับ)</Label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2570"
          className="border-line text-ink focus:border-teal focus:ring-teal/20 mt-1 w-32 rounded-sm border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
        />
        <p className="text-faint mt-1 text-xs">ใส่เป็น พ.ศ. — เว้นว่างถ้าหัวข้อนี้ไม่ได้แยกตามปี</p>
      </div>

      <div>
        <Label className="text-muted text-xs">เนื้อความ (ไม่บังคับ)</Label>
        <textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="ใส่เฉพาะหัวข้อที่เป็นข้อความยาว ไม่ได้เป็นไฟล์แนบ"
          className="border-line text-ink focus:border-teal focus:ring-teal/20 mt-1 w-full resize-y rounded-sm border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          disabled={!title.trim() || create.isPending}
          onClick={() => create.mutate()}
          className="bg-teal h-9 rounded-sm text-white disabled:opacity-40"
        >
          {create.isPending ? 'กำลังบันทึก...' : 'บันทึกหัวข้อ'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="border-line text-muted hover:bg-paper h-9 rounded-sm"
        >
          ยกเลิก
        </Button>
      </div>

      <p className="text-faint text-xs">แนบไฟล์ได้หลังบันทึกหัวข้อแล้ว</p>
    </div>
  )
}
