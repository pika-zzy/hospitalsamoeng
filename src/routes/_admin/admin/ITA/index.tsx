import { InlineEdit } from '@/components/ui/inline-edit'
import { requestAPI } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Trash2, FileText, Plus, ExternalLink, Pencil, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/ITA/')({
  component: RouteComponent,
})

const API_URL = import.meta.env.VITE_API_URL

// --------- Types (mirror ของ GetAllITA — preload Item.Topic.Moit + Year) ---------
interface ITAYear {
  ID: number
  Year: number
}

interface ITAMoit {
  ID: number
  Name: string
  Description: string | null
  YearID: number
}

interface ITATopic {
  ID: number
  Label: string
  Moit: ITAMoit
}

interface ITAItem {
  ID: number
  Label: string
  Topic: ITATopic
}

interface ITAFile {
  ID: number
  Title: string
  FileURL: string
  YearID: number
  Year: ITAYear
  // ไฟล์แนบได้กับข้อรอง (Item) หรือหัวข้อตรง ๆ (Topic) — มีอย่างใดอย่างหนึ่ง
  ItemID: number | null
  Item: ITAItem | null
  TopicID: number | null
  Topic: ITATopic | null
}

// --------- Grouped shape (Moit → Topic → files) ---------
interface TopicGroup {
  topic: { ID: number; Label: string }
  files: ITAFile[]
}
interface MoitGroup {
  moit: ITAMoit
  topics: TopicGroup[]
  fileCount: number
}

function RouteComponent() {
  const qc = useQueryClient()
  const [selectedYearID, setSelectedYearID] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [openMoit, setOpenMoit] = useState<number | null>(null)
  const [editingMoit, setEditingMoit] = useState<number | null>(null)
  const [editingTopic, setEditingTopic] = useState<number | null>(null)
  const [editingFile, setEditingFile] = useState<number | null>(null)

  // ปีทั้งหมด (ใช้เป็นตัวเลือก) — key เดียวกับหน้าอื่นเพื่อ share cache
  const { data: years = [], isLoading: loadingYears } = useQuery<ITAYear[]>({
    queryKey: ['ita-years'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<ITAYear[]>({ method: 'GET', url: '/ita/years' })
      if (resp.success) return resp.data ?? []
      return []
    },
  })

  const activeYearID = selectedYearID ?? years[0]?.ID ?? null

  // ไฟล์ ITA ของปีที่เลือก — ยิงทีละหน้าจนครบ
  // (requestAPI ไม่ส่ง meta.total ออกมา จึงหยุดเมื่อ batch สั้นกว่า limit)
  const { data: files = [], isLoading: loadingFiles } = useQuery<ITAFile[]>({
    queryKey: ['ita', activeYearID],
    enabled: !!activeYearID,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const all: ITAFile[] = []
      const limit = 100
      let page = 1
      while (true) {
        const resp = await requestAPI<ITAFile[]>({
          method: 'GET',
          url: '/ita',
          query: { year_id: activeYearID, page, limit },
        })
        if (!resp.success) break
        const batch = resp.data ?? []
        all.push(...batch)
        if (batch.length < limit) break
        page++
      }
      return all
    },
  })

  // group เป็น tree ฝั่ง client ตาม pattern ITA (ห้ามย้ายไป backend)
  // IMPROVEMENT: filter ตามคำค้น (ข้อเล็ก/ชื่อเอกสาร/ชื่อ MOIT/ข้อใหญ่) ก่อน group
  const groups = useMemo<MoitGroup[]>(() => {
    const q = search.trim().toLowerCase()
    const source = q
      ? files.filter((f) => {
          const hay = [
            f.Item?.Label,
            f.Title,
            f.Item?.Topic?.Label,
            f.Item?.Topic?.Moit?.Name,
          ]
          return hay.some((s) => s?.toLowerCase().includes(q))
        })
      : files

    const moitMap = new Map<
      number,
      { moit: ITAMoit; topics: Map<number, TopicGroup> }
    >()
    for (const f of source) {
      // ไฟล์แนบกับข้อรอง (Item) หรือกับหัวข้อตรง ๆ (Topic)
      const topic = f.Item?.Topic ?? f.Topic
      const moit = topic?.Moit
      if (!topic || !moit) continue
      if (!moitMap.has(moit.ID)) moitMap.set(moit.ID, { moit, topics: new Map() })
      const m = moitMap.get(moit.ID)!
      if (!m.topics.has(topic.ID)) m.topics.set(topic.ID, { topic, files: [] })
      m.topics.get(topic.ID)!.files.push(f)
    }
    return Array.from(moitMap.values())
      .map((m) => {
        const topics = Array.from(m.topics.values()).sort((a, b) =>
          a.topic.Label.localeCompare(b.topic.Label, undefined, { numeric: true }),
        )
        return {
          moit: m.moit,
          topics,
          fileCount: topics.reduce((s, t) => s + t.files.length, 0),
        }
      })
      .sort((a, b) => a.moit.Name.localeCompare(b.moit.Name, undefined, { numeric: true }))
  }, [files, search])

  const totalFiles = files.length
  const isSearching = search.trim() !== ''
  const matchedFiles = groups.reduce((s, g) => s + g.fileCount, 0)

  const deleteITA = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/ita/${id}` }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error('ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        return
      }
      toast.success('ลบเอกสารเรียบร้อยแล้ว')
      qc.invalidateQueries({ queryKey: ['ita', activeYearID] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  // แก้โครงสร้าง MOIT/Topic/Item เป็น entity ที่ใช้ร่วมกับหน้าจัดการ MOIT
  // → invalidate ทั้ง cache ของหน้ารายการ ITA และของหน้า moit ให้ตรงกัน
  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ['ita', activeYearID] })
    qc.invalidateQueries({ queryKey: ['moit'] })
    qc.invalidateQueries({ queryKey: ['moit-topics'] })
  }

  const updateMoit = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      requestAPI({ method: 'PUT', url: `/moit/${id}`, body: { name } }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error('แก้ไขไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        return
      }
      toast.success('แก้ไขชื่อ MOIT เรียบร้อยแล้ว')
      setEditingMoit(null)
      invalidateAll()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const updateTopic = useMutation({
    mutationFn: ({ id, label }: { id: number; label: string }) =>
      requestAPI({ method: 'PUT', url: `/topics/${id}`, body: { label } }),
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error('แก้ไขไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        return
      }
      toast.success('แก้ไขข้อใหญ่เรียบร้อยแล้ว')
      setEditingTopic(null)
      invalidateAll()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  // แก้ทั้งการ์ดไฟล์ในครั้งเดียว: ข้อเล็ก (item) + ชื่อเอกสาร + เปลี่ยน PDF (ถ้าแนบ)
  // item เป็นโครงสร้างที่ใช้ร่วม → แก้ที่นี่จะไปเปลี่ยนทุกไฟล์ใต้ item เดียวกัน
  const updateFile = useMutation({
    mutationFn: async ({ ita, itemLabel, title, file }: {
      ita: ITAFile; itemLabel: string; title: string; file: File | null
    }) => {
      // ไฟล์ที่แนบกับหัวข้อตรง ๆ ไม่มีข้อรองให้แก้ — ข้ามไป
      if (ita.Item && itemLabel !== ita.Item.Label) {
        const r = await requestAPI({ method: 'PUT', url: `/items/${ita.Item.ID}`, body: { label: itemLabel } })
        if (!r.success) throw new Error('update item failed')
      }
      const fd = new FormData()
      fd.append('title', title)
      if (file) fd.append('file', file)
      const r2 = await requestAPI({ method: 'PUT', url: `/ita/${ita.ID}`, body: fd })
      if (!r2.success) throw new Error('update ita failed')
      return true
    },
    onSuccess: () => {
      toast.success('บันทึกการแก้ไขเรียบร้อยแล้ว')
      setEditingFile(null)
      invalidateAll()
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const confirmDelete = (label: string, onConfirm: () => void) => {
    if (window.confirm(`ลบเอกสาร "${label}" ใช่ไหมครับ?`)) onConfirm()
  }

  return (
    <div className="text-ink">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-medium text-teal-600 tracking-widest uppercase mb-1">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1 h-7 bg-teal-500 rounded-full inline-block" />
              รายการเอกสาร ITA
            </h1>
          </div>
          <Link
            to="/admin/ITA/create"
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700
                       text-white text-sm font-medium rounded-xl transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            เพิ่มงาน ITA
          </Link>
        </div>

        {/* Year selector */}
        <div className="bg-white border border-line rounded-2xl p-5 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">ปีงบประมาณ</p>
          {loadingYears ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-9 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : years.length === 0 ? (
            <p className="text-sm text-gray-400">
              ยังไม่มีปีงบประมาณ —{' '}
              <Link to="/admin/moit" className="text-teal-600 hover:underline font-medium">
                ไปตั้งค่าโครงสร้าง MOIT
              </Link>
            </p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {years.map((y) => (
                <button
                  key={y.ID}
                  onClick={() => {
                    setSelectedYearID(y.ID)
                    setOpenMoit(null)
                    setSearch('')
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeYearID === y.ID
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {y.Year}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* File list grouped by MOIT */}
        {activeYearID && (
          <div className="flex flex-col gap-3">
            {/* Search box — filter client-side over already-loaded files */}
            {!loadingFiles && totalFiles > 0 && (
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาเอกสาร / ข้อ / MOIT..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-line rounded-2xl
                             focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 outline-none transition-colors"
                />
                {isSearching && (
                  <button
                    onClick={() => setSearch('')}
                    title="ล้างคำค้น"
                    className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
              </div>
            )}

            {!loadingFiles && (
              <p className="text-sm text-gray-500">
                {totalFiles === 0
                  ? 'ยังไม่มีเอกสารในปีนี้'
                  : isSearching
                    ? `พบ ${matchedFiles} เอกสาร ใน ${groups.length} หมวด MOIT`
                    : `ทั้งหมด ${totalFiles} เอกสาร ใน ${groups.length} หมวด MOIT`}
              </p>
            )}

            {loadingFiles && (
              <p className="text-sm text-gray-400 text-center py-10">กำลังโหลด...</p>
            )}

            {!loadingFiles && totalFiles === 0 && (
              <div className="bg-white border border-line rounded-2xl px-6 py-10 text-center">
                <p className="text-sm text-gray-400 mb-3">ยังไม่มีเอกสาร ITA สำหรับปีนี้</p>
                <Link
                  to="/admin/ITA/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700
                             text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" /> เพิ่มงาน ITA
                </Link>
              </div>
            )}

            {!loadingFiles && totalFiles > 0 && isSearching && matchedFiles === 0 && (
              <div className="bg-white border border-line rounded-2xl px-6 py-10 text-center">
                <p className="text-sm text-gray-400">
                  ไม่พบเอกสารที่ตรงกับ "{search.trim()}"
                </p>
              </div>
            )}

            {!loadingFiles &&
              groups.map((g) => {
                // ค้นหาอยู่ = กางทุกหมวดที่มีผลลัพธ์ให้เห็นทันที
                const isOpen = isSearching || openMoit === g.moit.ID
                return (
                  <div key={g.moit.ID} className="bg-white border border-line rounded-2xl overflow-hidden">
                    <div className="w-full flex items-center gap-3 px-5 py-4">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-teal-600">{g.moit.ID}</span>
                      </div>
                      {editingMoit === g.moit.ID ? (
                        <InlineEdit
                          value={g.moit.Name}
                          placeholder="ชื่อ MOIT..."
                          onSave={(name) => updateMoit.mutate({ id: g.moit.ID, name })}
                          onCancel={() => setEditingMoit(null)}
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => setOpenMoit(isOpen ? null : g.moit.ID)}
                            className="flex-1 min-w-0 text-left"
                          >
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{g.moit.Name}</p>
                            {g.moit.Description && (
                              <p className="text-xs text-gray-400 line-clamp-1">{g.moit.Description}</p>
                            )}
                          </button>
                          <button
                            onClick={() => setEditingMoit(g.moit.ID)}
                            title="แก้ชื่อ MOIT"
                            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                          <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2.5 py-1 rounded-full shrink-0">
                            {g.fileCount} ไฟล์
                          </span>
                          <button
                            onClick={() => setOpenMoit(isOpen ? null : g.moit.ID)}
                            title={isOpen ? 'ย่อ' : 'ขยาย'}
                            className="shrink-0"
                          >
                            <ChevronRight
                              className={`w-4 h-4 text-gray-300 ml-1 transition-transform duration-200 ${
                                isOpen ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        </>
                      )}
                    </div>

                    {isOpen && (
                      <div className="border-t border-gray-50 px-5 py-3 space-y-3">
                        {g.topics.map((t) => (
                          <div key={t.topic.ID}>
                            <div className="flex items-start gap-2 mb-2 group/topic">
                              <ChevronRight className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                              {editingTopic === t.topic.ID ? (
                                <InlineEdit
                                  value={t.topic.Label}
                                  multiline
                                  placeholder="ข้อใหญ่ (หัวข้อหลัก)..."
                                  onSave={(label) => updateTopic.mutate({ id: t.topic.ID, label })}
                                  onCancel={() => setEditingTopic(null)}
                                />
                              ) : (
                                <>
                                  <p className="flex-1 text-sm font-semibold text-gray-700 leading-snug">
                                    {t.topic.Label}
                                  </p>
                                  <button
                                    onClick={() => setEditingTopic(t.topic.ID)}
                                    title="แก้ข้อใหญ่"
                                    className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center shrink-0 opacity-0 group-hover/topic:opacity-100 transition-opacity"
                                  >
                                    <Pencil className="w-3 h-3 text-gray-400" />
                                  </button>
                                </>
                              )}
                            </div>

                            <div className="space-y-2 ml-6">
                              {t.files.map((f) => (
                                <div
                                  key={f.ID}
                                  className="flex items-start gap-3 rounded-xl border border-line bg-gray-50 p-3 group/file"
                                >
                                  <FileText className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                                  {editingFile === f.ID ? (
                                    <FileEditForm
                                      initialItemLabel={f.Item?.Label ?? ''}
                                      initialTitle={f.Title}
                                      pending={updateFile.isPending}
                                      onSave={({ itemLabel, title, file }) =>
                                        updateFile.mutate({ ita: f, itemLabel, title, file })
                                      }
                                      onCancel={() => setEditingFile(null)}
                                    />
                                  ) : (
                                    <>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 font-medium line-clamp-2">
                                          {f.Item?.Label ?? 'แนบกับหัวข้อโดยตรง'}
                                        </p>
                                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                          {f.Title}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <a
                                          href={`${API_URL}${f.FileURL}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          title="เปิดไฟล์"
                                          className="w-7 h-7 rounded-lg hover:bg-teal-50 flex items-center justify-center transition-colors"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5 text-teal-500" />
                                        </a>
                                        <button
                                          onClick={() => setEditingFile(f.ID)}
                                          title="แก้ไข"
                                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                        >
                                          <Pencil className="w-3.5 h-3.5 text-gray-400" />
                                        </button>
                                        <button
                                          onClick={() => confirmDelete(f.Title, () => deleteITA.mutate(f.ID))}
                                          disabled={deleteITA.isPending}
                                          title="ลบ"
                                          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors disabled:opacity-50"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}

// ฟอร์มแก้ไขการ์ดไฟล์: ข้อเล็ก (item) + ชื่อเอกสาร + เปลี่ยนไฟล์ PDF (optional)
function FileEditForm({ initialItemLabel, initialTitle, onSave, onCancel, pending }: {
  initialItemLabel: string
  initialTitle: string
  onSave: (v: { itemLabel: string; title: string; file: File | null }) => void
  onCancel: () => void
  pending: boolean
}) {
  const [itemLabel, setItemLabel] = useState(initialItemLabel)
  const [title, setTitle] = useState(initialTitle)
  const [file, setFile] = useState<File | null>(null)
  const canSave = !!itemLabel.trim() && !!title.trim() && !pending

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">ข้อเล็ก (หัวข้อย่อย)</label>
        <textarea
          autoFocus
          value={itemLabel}
          onChange={(e) => setItemLabel(e.target.value)}
          rows={2}
          className="px-3 py-1.5 text-sm border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">ชื่อเอกสาร</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-1.5 text-sm border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-500/20 outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">เปลี่ยนไฟล์ PDF (ไม่เลือก = ใช้ไฟล์เดิม)</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-xs text-gray-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-600 file:text-xs file:font-medium hover:file:bg-teal-100"
        />
      </div>
      <div className="flex items-center gap-2 pt-0.5">
        <button
          onClick={() => onSave({ itemLabel: itemLabel.trim(), title: title.trim(), file })}
          disabled={!canSave}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors disabled:opacity-50"
        >
          {pending ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
        <button
          onClick={onCancel}
          disabled={pending}
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  )
}
