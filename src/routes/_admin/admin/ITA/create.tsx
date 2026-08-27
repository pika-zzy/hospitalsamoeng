import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { requestAPI } from '@/lib/api'
import { compareThaiLabels } from '@/lib/thai-label-sort'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Upload, X, Save, CheckCircle2, ChevronRight, Plus, ChevronDown, FileText } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/ITA/create')({
  component: RouteComponent,
})

const API_URL = import.meta.env.VITE_API_URL

// --------- Types ---------
interface ITAYear {
  ID: number
  Year: number
}

interface Moit {
  ID: number
  Name: string
  Description: string
  YearID: number
}

interface MoitItem {
  ID: number
  TopicID: number
  Label: string
  // ข้อรองซ้อนได้ 1 ชั้น — null = ข้อชั้นบนสุด
  // (แทนกติกาเดิมที่ต้องพิมพ์ "›" ในชื่อหัวข้อเพื่อสร้างชั้นซ้อน)
  ParentID: number | null
}

interface MoitTopic {
  ID: number
  MoitID: number
  Label: string
  Items: MoitItem[]
}

// ชนิดไฟล์ที่ ITA รับ — ต้องตรงกับ allowedITAExt ฝั่ง backend
// MOIT บางข้อขอหลักฐานเป็นภาพถ่าย/อินโฟกราฟิก ไม่ใช่ PDF อย่างเดียว
const ITA_ACCEPT = '.pdf,.jpg,.jpeg,.png'
const ITA_REJECT_MSG = 'อัปโหลดได้เฉพาะไฟล์ PDF, JPG หรือ PNG เท่านั้น'
const ITA_MIME = ['application/pdf', 'image/jpeg', 'image/png']

function isAllowedITAFile(file: File) {
  return ITA_MIME.includes(file.type)
}

interface RowFile {
  item_id: number
  title: string
  file: File | null
}

// ไฟล์ที่แนบกับหัวข้อโดยตรง (ไม่ผ่านข้อรอง)
interface TopicRowFile {
  topic_id: number
  title: string
  file: File | null
}

// ไฟล์ ITA ที่อัปโหลดไว้แล้ว (subset ของ GetAllITA — ใช้แค่ระบุว่าข้อไหนอัปแล้ว)
interface ExistingITA {
  ID: number
  Title: string
  FileURL: string
  ItemID: number
}

// --------- Dropdown Component ---------
interface SelectDropdownProps {
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  disabled?: boolean
}

function SelectDropdown({ value, onChange, options, placeholder, disabled }: SelectDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border text-sm font-medium
                    bg-white outline-none transition-all duration-200 cursor-pointer
                    ${disabled
                      ? 'border-line text-gray-300 cursor-not-allowed bg-gray-50'
                      : value
                        ? 'border-teal-300 text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                        : 'border-line text-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20'
                    }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}

// --------- Inline Add Year ---------
interface AddYearInlineProps {
  onSuccess: (year: ITAYear) => void
}

function AddYearInline({ onSuccess }: AddYearInlineProps) {
  const [yearInput, setYearInput] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const resp = await requestAPI<ITAYear>({
        method: 'POST',
        url: '/ita/years',
        body: { year: Number(yearInput), Year: Number(yearInput) },
      })
      if (resp.success && resp.data) return resp.data
      throw new Error('Failed to add year')
    },
    onSuccess: (data) => {
      onSuccess(data)
      setYearInput('')
      setError('')
      toast.success(`เพิ่มปีงบประมาณ ${data.Year} แล้ว`)
    },
    onError: () => setError('ไม่สามารถเพิ่มปีได้ กรุณาลองใหม่'),
  })

  const handleAdd = () => {
    const y = Number(yearInput)
    if (!yearInput || isNaN(y) || y < 2500 || y > 2600) {
      setError('กรุณาระบุปี พ.ศ. ที่ถูกต้อง (เช่น 2570)')
      return
    }
    setError('')
    mutation.mutate()
  }

  return (
    <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
      <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
        <Plus className="w-3.5 h-3.5" /> เพิ่มปีงบประมาณใหม่
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="ปี พ.ศ. เช่น 2570"
          value={yearInput}
          onChange={(e) => setYearInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white
                     focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={mutation.isPending}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium
                     rounded-lg transition-colors disabled:opacity-60"
        >
          {mutation.isPending ? 'กำลังเพิ่ม...' : 'เพิ่ม'}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// --------- Inline Add MOIT ---------
interface AddMoitInlineProps {
  yearID: number
  onSuccess: (moit: Moit) => void
}

function AddMoitInline({ yearID, onSuccess }: AddMoitInlineProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const resp = await requestAPI<Moit>({
        method: 'POST',
        url: `/ita/years/${yearID}/moit`,
        body: { name, description, Name: name, Description: description },
      })
      if (resp.success && resp.data) return resp.data
      throw new Error('Failed to add MOIT')
    },
    onSuccess: (data) => {
      onSuccess(data)
      setName('')
      setDescription('')
      setError('')
      toast.success(`เพิ่มหมวด ${data.Name} แล้ว`)
    },
    onError: () => setError('ไม่สามารถเพิ่ม MOIT ได้ กรุณาลองใหม่'),
  })

  const handleAdd = () => {
    if (!name.trim()) {
      setError('กรุณาระบุชื่อหมวด MOIT')
      return
    }
    setError('')
    mutation.mutate()
  }

  return (
    <div className="mt-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
      <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
        <Plus className="w-3.5 h-3.5" /> เพิ่มหมวด MOIT ใหม่
      </p>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="ชื่อหมวด เช่น MOIT 1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white
                     focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none"
        />
        <input
          type="text"
          placeholder="คำอธิบาย (ไม่บังคับ)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white
                     focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={mutation.isPending}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium
                     rounded-lg transition-colors disabled:opacity-60"
        >
          {mutation.isPending ? 'กำลังเพิ่ม...' : 'เพิ่ม MOIT'}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// --------- Inline Add Topic (หัวข้อหลัก) ---------
interface AddTopicInlineProps {
  moitID: number
  onSuccess: () => void
}

function AddTopicInline({ moitID, onSuccess }: AddTopicInlineProps) {
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const resp = await requestAPI({
        method: 'POST',
        url: `/moit/${moitID}/topics`,
        body: { label, Label: label },
      })
      if (resp.success) return resp
      throw new Error('Failed to add topic')
    },
    onSuccess: () => {
      onSuccess()
      setLabel('')
      setError('')
      toast.success('เพิ่มหัวข้อหลักแล้ว')
    },
    onError: () => setError('ไม่สามารถเพิ่มหัวข้อหลักได้ กรุณาลองใหม่'),
  })

  const handleAdd = () => {
    if (!label.trim()) {
      setError('กรุณาระบุหัวข้อหลัก')
      return
    }
    setError('')
    mutation.mutate()
  }

  return (
    <div className="mt-3 p-4 rounded-xl bg-teal-50 border border-teal-100">
      <p className="text-xs font-semibold text-teal-700 mb-2 flex items-center gap-1.5">
        <Plus className="w-3.5 h-3.5" /> เพิ่มหัวข้อหลักใหม่
      </p>
      <div className="flex gap-2">
        <textarea
          autoFocus
          rows={2}
          placeholder="เช่น 1. คำสั่ง / ประกาศ ที่ระบุกรอบแนวทาง..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-teal-200 rounded-lg bg-white
                     focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none resize-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={mutation.isPending}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium
                     rounded-lg transition-colors disabled:opacity-60 self-start"
        >
          {mutation.isPending ? 'กำลังเพิ่ม...' : 'เพิ่ม'}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// เรียงข้อรองแบบต้นไม้: ข้อชั้นบนสุดเรียงตามเลขนำหน้า แล้วตามด้วยข้อย่อยของตัวเอง
// คืน depth มาด้วยเพื่อให้ UI ย่อหน้าให้เห็นว่าอันไหนเป็นลูก
function orderItemsAsTree(items: MoitItem[]): { item: MoitItem; depth: number }[] {
  // ใช้ตัวเทียบเดียวกับหน้าสาธารณะ ไม่งั้น admin เห็นลำดับหนึ่ง ประชาชนเห็นอีกลำดับ
  // (localeCompare เพียว ๆ เรียงชื่อเดือนไทยตามตัวอักษร ไม่ใช่ตามเวลา)
  const byLabel = (a: MoitItem, b: MoitItem) => compareThaiLabels(a.Label, b.Label)

  const roots = items.filter((i) => i.ParentID == null).sort(byLabel)
  const out: { item: MoitItem; depth: number }[] = []

  for (const root of roots) {
    out.push({ item: root, depth: 0 })
    for (const child of items.filter((i) => i.ParentID === root.ID).sort(byLabel)) {
      out.push({ item: child, depth: 1 })
    }
  }

  // กันข้อมูลเพี้ยน: ข้อที่อ้างแม่ที่ไม่มีอยู่จริงจะไม่หายไปจากหน้าจอ
  for (const orphan of items.filter(
    (i) => i.ParentID != null && !items.some((x) => x.ID === i.ParentID),
  )) {
    out.push({ item: orphan, depth: 0 })
  }

  return out
}

// --------- Inline Add Item (หัวข้อย่อย) ---------
interface AddItemInlineProps {
  topicID: number
  /** ข้อที่เลือกเป็น "ข้อแม่" ได้ = ข้อชั้นบนสุดของหัวข้อนี้เท่านั้น (ระบบรองรับชั้นเดียว) */
  parentChoices: MoitItem[]
  onSuccess: () => void
}

function AddItemInline({ topicID, parentChoices, onSuccess }: AddItemInlineProps) {
  const [label, setLabel] = useState('')
  const [parentID, setParentID] = useState<number | null>(null)
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const resp = await requestAPI({
        method: 'POST',
        url: `/topics/${topicID}/items`,
        body: { label, Label: label, parent_id: parentID },
      })
      if (resp.success) return resp
      throw new Error('Failed to add item')
    },
    onSuccess: () => {
      onSuccess()
      setLabel('')
      setParentID(null)
      setError('')
      toast.success('เพิ่มหัวข้อย่อยแล้ว')
    },
    onError: () => setError('ไม่สามารถเพิ่มหัวข้อย่อยได้ กรุณาลองใหม่'),
  })

  const handleAdd = () => {
    if (!label.trim()) {
      setError('กรุณาระบุหัวข้อย่อย')
      return
    }
    setError('')
    mutation.mutate()
  }

  return (
    <div className="p-3.5 rounded-xl bg-teal-50/50 border border-dashed border-teal-200">
      {/* เลือกข้อแม่ = สร้างชั้นซ้อน เช่น "2. มีแบบสรุปผลฯ" ที่มีลูกเป็นเอกสารรายเดือน
          ระบบรองรับซ้อนชั้นเดียว จึงให้เลือกได้เฉพาะข้อชั้นบนสุด */}
      {parentChoices.length > 0 && (
        <div className="mb-2">
          <label className="block text-[11px] text-gray-500 mb-1">อยู่ใต้ข้อ (ไม่บังคับ)</label>
          <select
            value={parentID ?? ''}
            onChange={(e) => setParentID(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 text-xs border border-teal-200 rounded-lg bg-white
                       focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none"
          >
            <option value="">— ไม่มี (เป็นข้อชั้นบนสุด) —</option>
            {parentChoices.map((p) => (
              <option key={p.ID} value={p.ID}>
                {p.Label.length > 70 ? `${p.Label.slice(0, 70)}…` : p.Label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2">
        <textarea
          autoFocus
          rows={2}
          placeholder="เช่น 1.1 มีบันทึกข้อความเสนอผู้บริหาร..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex-1 px-3 py-2 text-xs border border-teal-200 rounded-lg bg-white
                     focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none resize-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={mutation.isPending}
          className="px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium
                     rounded-lg transition-colors disabled:opacity-60 self-start whitespace-nowrap"
        >
          {mutation.isPending ? 'กำลังเพิ่ม...' : 'เพิ่ม'}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// --------- Upload Done Modal ---------
// --------- Main ---------
function RouteComponent() {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const [selectedYearID, setSelectedYearID] = useState<number | null>(null)
  const [selectedMoitID, setSelectedMoitID] = useState<number | null>(null)
  const [rows, setRows] = useState<Record<number, RowFile>>({})
  const [topicRows, setTopicRows] = useState<Record<number, TopicRowFile>>({})
  // จำนวนไฟล์ที่เพิ่งอัปโหลดสำเร็จ — ไม่ null = เปิด modal แจ้งเสร็จ
  const [doneCount, setDoneCount] = useState<number | null>(null)
  const [showAddYear, setShowAddYear] = useState(false)
  const [showAddMoit, setShowAddMoit] = useState(false)
  const [addingTopic, setAddingTopic] = useState(false)
  const [addingItemFor, setAddingItemFor] = useState<number | null>(null)
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const topicFileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  // ดึงปีทั้งหมด
  const { data: years = [], isLoading: loadingYears } = useQuery<ITAYear[]>({
    queryKey: ['ita-years'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<ITAYear[]>({ method: 'GET', url: '/ita/years' })
      if (resp.success) return resp.data ?? []
      return []
    },
  })

  // ดึง MOIT ตามปีที่เลือก
  const { data: moitList = [], isLoading: loadingMoit } = useQuery<Moit[]>({
    queryKey: ['moit', selectedYearID],
    enabled: !!selectedYearID,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<Moit[]>({
        
        method: 'GET',
        url: `/ita/years/${selectedYearID}/moit`,
      })
      console.log('moit resp:', resp) // ดูตรงนี้
      if (resp.success) return resp.data ?? []
      return []
    },
  })
  

  const selectedMoit = moitList.find((m) => m.ID === selectedMoitID) ?? null

  // ดึง topics + items
  const { data: topics = [], isLoading: loadingTopics } = useQuery<MoitTopic[]>({
    queryKey: ['moit-topics', selectedMoitID],
    enabled: !!selectedMoitID,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<MoitTopic[]>({
        method: 'GET',
        url: `/moit/${selectedMoitID}/topics`,
      })
      if (resp.success) return resp.data ?? []
      return []
    },
  })

  // ดึงไฟล์ ITA ที่อัปโหลดไว้แล้วของปีที่เลือก (ทั้งปี) เพื่อบอกว่าข้อไหนอัปแล้ว
  // key เดียวกับหน้ารายการเอกสาร (index) — share cache; อัปเสร็จ invalidate ['ita'] แล้ว badge อัปเดตเอง
  const { data: existingFiles = [] } = useQuery<ExistingITA[]>({
    queryKey: ['ita', selectedYearID],
    enabled: !!selectedYearID,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const all: ExistingITA[] = []
      const limit = 100
      let page = 1
      while (true) {
        const resp = await requestAPI<ExistingITA[]>({
          method: 'GET',
          url: '/ita',
          query: { year_id: selectedYearID, page, limit },
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

  // จับกลุ่มไฟล์เดิมตาม item เพื่อ lookup เร็ว ๆ ตอน render
  const existingByItem = useMemo(() => {
    const m = new Map<number, ExistingITA[]>()
    for (const f of existingFiles) {
      const arr = m.get(f.ItemID)
      if (arr) arr.push(f)
      else m.set(f.ItemID, [f])
    }
    return m
  }, [existingFiles])

  // sync rows กับ topics — merge ไม่ใช่ reset:
  // เก็บไฟล์/ชื่อที่ user แนบไว้แล้วของ item เดิม, เพิ่ม entry ว่างให้ item ใหม่, ตัด item ที่หายไป
  // (สำคัญตอนเพิ่มหัวข้อ inline ระหว่างทาง — topics จะ refetch แต่ต้องไม่ล้างงานที่ค้าง)
  useEffect(() => {
    if (!topics.length) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRows((prev) => {
      const next: Record<number, RowFile> = {}
      topics.forEach((topic) => {
        ;(topic.Items ?? []).forEach((item) => {
          next[item.ID] = prev[item.ID] ?? { item_id: item.ID, title: '', file: null }
        })
      })
      return next
    })
  }, [topics])

  const handleYearChange = (val: string) => {
    setSelectedYearID(val ? Number(val) : null)
    setSelectedMoitID(null)
    setRows({})
    setTopicRows({})
    setShowAddMoit(false)
    setAddingTopic(false)
    setAddingItemFor(null)
  }

  const handleMoitChange = (val: string) => {
    setSelectedMoitID(val ? Number(val) : null)
    setRows({})
    setTopicRows({})
    setAddingTopic(false)
    setAddingItemFor(null)
  }

  const invalidateTopics = () =>
    qc.invalidateQueries({ queryKey: ['moit-topics', selectedMoitID] })

  // ไฟล์ที่แนบกับ "หัวข้อ" ตรง ๆ (หัวข้อที่ไม่มีข้อรอง) — แยก state ออกจาก rows ของข้อรอง
  // เพื่อไม่ให้ id ชนกัน (topic กับ item เป็นคนละตาราง id เดินคนละชุด)
  const updateTopicRow = (topic_id: number, field: 'title' | 'file', value: string | File | null) => {
    setTopicRows((prev) => ({
      ...prev,
      [topic_id]: { ...(prev[topic_id] ?? { topic_id, title: '', file: null }), [field]: value },
    }))
  }

  const clearTopicFile = (topic_id: number) => {
    updateTopicRow(topic_id, 'file', null)
    if (topicFileRefs.current[topic_id]) topicFileRefs.current[topic_id]!.value = ''
  }

  const updateRow = (item_id: number, field: 'title' | 'file', value: string | File | null) => {
    setRows((prev) => ({
      ...prev,
      [item_id]: { ...prev[item_id], [field]: value },
    }))
  }

  const clearFile = (item_id: number) => {
    updateRow(item_id, 'file', null)
    if (fileRefs.current[item_id]) fileRefs.current[item_id]!.value = ''
  }

  const filledRows = Object.values(rows).filter((r) => r.file)
  const filledTopicRows = Object.values(topicRows).filter((r) => r.file)
  const totalItems = Object.values(rows).length
  // จำนวนไฟล์ที่พร้อมอัปทั้งหมด = ของข้อรอง + ของหัวข้อ
  const filledCount = filledRows.length + filledTopicRows.length

  const saveMutation = useMutation({
    mutationFn: async () => {
      // snapshot รายการที่จะอัป แล้วเช็คผลรายไฟล์ (requestAPI ไม่ throw ตอน error — คืน success:false)
      // ไฟล์ของข้อรอง (item_id) และไฟล์ที่แนบกับหัวข้อตรง ๆ (topic_id) ยิง endpoint เดียวกัน
      const targets: Array<{ item_id?: number; topic_id?: number; title: string; file: File }> = [
        ...filledRows.map((r) => ({ item_id: r.item_id, title: r.title, file: r.file! })),
        ...filledTopicRows.map((r) => ({ topic_id: r.topic_id, title: r.title, file: r.file! })),
      ]
      const results = await Promise.all(
        targets.map((r) => {
          const fd = new FormData()
          if (r.item_id !== undefined) fd.append('item_id', String(r.item_id))
          if (r.topic_id !== undefined) fd.append('topic_id', String(r.topic_id))
          fd.append('title', r.title)
          fd.append('year_id', String(selectedYearID))
          fd.append('file', r.file)
          return requestAPI({ method: 'POST', url: '/ita/upload', body: fd })
        }),
      )
      return targets.map((t, i) => ({
        item_id: t.item_id, topic_id: t.topic_id, ok: results[i].success,
      }))
    },
    onSuccess: (outcomes) => {
      const okIDs = outcomes.filter((o) => o.ok && o.item_id !== undefined).map((o) => o.item_id!)
      const okTopicIDs = outcomes.filter((o) => o.ok && o.topic_id !== undefined).map((o) => o.topic_id!)
      const failCount = outcomes.length - okIDs.length - okTopicIDs.length

      // เคลียร์เฉพาะรายการที่อัปสำเร็จ — รายการที่พลาดคงไฟล์ไว้ให้ลองใหม่
      setRows((prev) => {
        const next = { ...prev }
        okIDs.forEach((id) => {
          if (next[id]) next[id] = { ...next[id], title: '', file: null }
        })
        return next
      })
      okIDs.forEach((id) => {
        const ref = fileRefs.current[id]
        if (ref) ref.value = ''
      })

      setTopicRows((prev) => {
        const next = { ...prev }
        okTopicIDs.forEach((id) => {
          if (next[id]) next[id] = { ...next[id], title: '', file: null }
        })
        return next
      })
      okTopicIDs.forEach((id) => {
        const ref = topicFileRefs.current[id]
        if (ref) ref.value = ''
      })

      // ให้หน้ารายการเอกสาร (index) เห็นไฟล์ใหม่
      qc.invalidateQueries({ queryKey: ['ita'] })

      if (failCount > 0) {
        toast.error(`มี ${failCount} รายการอัปโหลดไม่สำเร็จ กรุณาลองใหม่`)
      }
      if (okIDs.length > 0) {
        setDoneCount(okIDs.length)
      }
    },
    onError: () => toast.error('เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่'),
  })
  

  const yearOptions = years.map((y) => ({ value: String(y.ID), label: String(y.Year) }))
  const moitOptions = moitList.map((m) => ({ value: String(m.ID), label: m.Name }))
  

  return (
    <div className="text-ink">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-teal-600 tracking-widest uppercase mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-1 h-7 bg-teal-500 rounded-full inline-block" />
            เพิ่มงาน ITA
          </h1>
        </div>

        {/* Success dialog — เด้งตอนอัปโหลดเสร็จ ให้เลือกว่าจะอัปต่อ หรือไปดูหน้ารายการเอกสาร */}
        <Dialog
          open={doneCount !== null}
          title="อัปโหลดสำเร็จ"
          description={`บันทึกเอกสารเรียบร้อยแล้ว ${doneCount ?? 0} รายการ`}
          onClose={() => setDoneCount(null)}
          actions={[
            { label: 'อัปโหลดต่อ', variant: 'outline', onClick: () => setDoneCount(null) },
            { label: 'ไปหน้ารายการเอกสาร', onClick: () => navigate({ to: '/admin/ITA' }) },
          ]}
        />

        <div className="space-y-4">

          {/* Step 1 — เลือกปี */}
          <div className="bg-white border border-line rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                                 bg-teal-100 text-teal-700 text-xs font-bold mr-2">1</span>
                เลือกปีงบประมาณ
              </p>
              <button
                type="button"
                onClick={() => setShowAddYear((v) => !v)}
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700
                           font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                เพิ่มปีใหม่
              </button>
            </div>

            {loadingYears ? (
              <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ) : years.length === 0 && !showAddYear ? (
              <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-700">
                ยังไม่มีปีงบประมาณ กรุณาเพิ่มปีก่อน
                <button
                  type="button"
                  onClick={() => setShowAddYear(true)}
                  className="ml-2 font-semibold underline"
                >
                  เพิ่มเลย
                </button>
              </div>
            ) : (
              <SelectDropdown
                value={selectedYearID ? String(selectedYearID) : ''}
                onChange={handleYearChange}
                options={yearOptions}
                placeholder="— เลือกปีงบประมาณ —"
                disabled={years.length === 0}
              />
            )}

            {showAddYear && (
              <AddYearInline
                onSuccess={(newYear) => {
                  qc.setQueryData<ITAYear[]>(['ita-years'], (old = []) => [...old, newYear])
                  setSelectedYearID(newYear.ID)
                  setShowAddYear(false)
                }}
              />
            )}
          </div>

          {/* Step 2 — เลือก MOIT */}
          {selectedYearID && (
            <div className="bg-white border border-line rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                                   bg-teal-100 text-teal-700 text-xs font-bold mr-2">2</span>
                  เลือกหมวด MOIT
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddMoit((v) => !v)}
                  className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700
                             font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  เพิ่ม MOIT ใหม่
                </button>
              </div>

              {loadingMoit ? (
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ) : moitList.length === 0 && !showAddMoit ? (
                <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
                  ยังไม่มี MOIT สำหรับปีนี้ กรุณาเพิ่มก่อน
                  <button
                    type="button"
                    onClick={() => setShowAddMoit(true)}
                    className="ml-2 font-semibold underline"
                  >
                    เพิ่มเลย
                  </button>
                </div>
              ) : (
                <SelectDropdown
                  value={selectedMoitID ? String(selectedMoitID) : ''}
                  onChange={handleMoitChange}
                  options={moitOptions}
                  placeholder="— เลือกหมวด MOIT —"
                  disabled={moitList.length === 0}
                />
              )}

              {selectedMoit && (
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  {selectedMoit.Description}
                </p>
              )}

              {showAddMoit && (
                <AddMoitInline
                  yearID={selectedYearID}
                  onSuccess={(newMoit) => {
                    qc.setQueryData<Moit[]>(['moit', selectedYearID], (old = []) => [...old, newMoit])
                    setSelectedMoitID(newMoit.ID)
                    setShowAddMoit(false)
                  }}
                />
              )}
            </div>
          )}

          {/* Step 3 — Topics + Items */}
          {selectedMoit && (
            <div className="bg-white border border-line rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                                   bg-teal-100 text-teal-700 text-xs font-bold mr-2">3</span>
                  อัปโหลดเอกสาร — {selectedMoit.Name}
                </p>
                {filledCount > 0 && (
                  <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2.5 py-1 rounded-full">
                    {filledCount} / {totalItems} รายการ
                  </span>
                )}
              </div>

              {loadingTopics ? (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  กำลังโหลดหัวข้อ...
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {topics.length === 0 && (
                    <div className="px-6 py-8 text-center text-sm text-gray-400">
                      ยังไม่มีหัวข้อใน {selectedMoit.Name} — กด "เพิ่มหัวข้อหลัก" ด้านล่างเพื่อเริ่มต้นครับ
                    </div>
                  )}
                  {topics
                    .sort((a, b) => a.Label.localeCompare(b.Label, undefined, { numeric: true }))
                    .map((topic) => (
                      <div key={topic.ID} className="px-6 py-5">
                        <div className="flex items-start gap-2 mb-4">
                          <ChevronRight className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                          <p className="text-sm font-semibold text-gray-700 leading-snug">
                            {topic.Label}
                          </p>
                        </div>

                        {/* แนบไฟล์กับหัวข้อโดยตรง — ใช้กับหัวข้อที่ไม่มีข้อรอง
                            (เดิมต้องสร้างข้อรองหลอกขึ้นมารับไฟล์) */}
                        <div className="ml-6 mb-3">
                          {(() => {
                            const trow = topicRows[topic.ID]
                            const hasTopicFile = !!trow?.file
                            return (
                              <div className="flex items-center gap-2 rounded-lg border border-dashed border-line bg-gray-50/60 px-3 py-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] text-gray-400">แนบไฟล์กับหัวข้อนี้โดยตรง</p>
                                  {hasTopicFile && (
                                    <input
                                      type="text"
                                      placeholder="ชื่อเอกสาร (ถ้าต้องการระบุเพิ่มเติม)"
                                      value={trow.title}
                                      onChange={(e) => updateTopicRow(topic.ID, 'title', e.target.value)}
                                      className="mt-1.5 w-full px-3 py-1.5 text-xs border border-line rounded-lg bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all placeholder:text-gray-300"
                                    />
                                  )}
                                </div>
                                <div className="shrink-0 flex items-center gap-2">
                                  {hasTopicFile ? (
                                    <>
                                      <span className="text-[11px] text-teal-600 font-medium max-w-25 truncate hidden sm:block">
                                        {trow.file!.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => clearTopicFile(topic.ID)}
                                        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                                      >
                                        <X className="w-3 h-3 text-red-500" />
                                      </button>
                                    </>
                                  ) : (
                                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-line hover:border-teal-400 text-xs text-gray-500 hover:text-teal-600 cursor-pointer transition-all duration-200 whitespace-nowrap">
                                      <Upload className="w-3.5 h-3.5" />
                                      แนบไฟล์
                                      <input
                                        type="file"
                                        accept={ITA_ACCEPT}
                                        className="hidden"
                                        ref={(el) => { topicFileRefs.current[topic.ID] = el }}
                                        onChange={(e) => {
                                          const file = e.target.files?.[0]
                                          if (!file) return
                                          if (!isAllowedITAFile(file)) {
                                            toast.error(ITA_REJECT_MSG)
                                            return
                                          }
                                          updateTopicRow(topic.ID, 'file', file)
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>
                            )
                          })()}
                        </div>

                        <div className="space-y-2.5 ml-6">
                          {orderItemsAsTree(topic.Items ?? [])
                            .map(({ item, depth }) => {
                              const row = rows[item.ID]
                              const hasFile = !!row?.file
                              const existing = existingByItem.get(item.ID) ?? []
                              const hasExisting = existing.length > 0

                              return (
                                <div
                                  key={item.ID}
                                  className={`rounded-xl border p-3.5 transition-all duration-200
                                    ${depth > 0 ? 'ml-5 border-l-2 border-l-teal-200' : ''}
                                    ${hasFile
                                      ? 'border-teal-200 bg-teal-50/40'
                                      : hasExisting
                                        ? 'border-teal-100 bg-teal-50/20'
                                        : 'border-line bg-gray-50'
                                    }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start gap-2 flex-wrap">
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                          {item.Label}
                                        </p>
                                        {hasExisting && (
                                          <span className="inline-flex items-center gap-1 text-[10px] font-medium
                                                           text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full shrink-0">
                                            <CheckCircle2 className="w-3 h-3" />
                                            อัปโหลดแล้ว{existing.length > 1 ? ` ${existing.length}` : ''}
                                          </span>
                                        )}
                                      </div>
                                      {hasExisting && (
                                        <div className="mt-1.5 space-y-1">
                                          {existing.map((ef) => (
                                            <a
                                              key={ef.ID}
                                              href={`${API_URL}${ef.FileURL}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-1.5 text-[11px] text-teal-600
                                                         hover:text-teal-700 hover:underline w-fit max-w-full"
                                            >
                                              <FileText className="w-3 h-3 shrink-0" />
                                              <span className="truncate">{ef.Title}</span>
                                            </a>
                                          ))}
                                        </div>
                                      )}
                                      {hasFile && (
                                        <input
                                          type="text"
                                          placeholder="ชื่อเอกสาร (ถ้าต้องการระบุเพิ่มเติม)"
                                          value={row.title}
                                          onChange={(e) => updateRow(item.ID, 'title', e.target.value)}
                                          className="mt-2 w-full px-3 py-1.5 text-xs border border-line
                                                     rounded-lg bg-white focus:border-teal-500
                                                     focus:ring-2 focus:ring-teal-500/20 outline-none
                                                     transition-all placeholder:text-gray-300"
                                        />
                                      )}
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2">
                                      {hasFile ? (
                                        <>
                                          <span className="text-[11px] text-teal-600 font-medium
                                                           max-w-25 truncate hidden sm:block">
                                            {row.file!.name}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => clearFile(item.ID)}
                                            className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200
                                                       flex items-center justify-center transition-colors"
                                          >
                                            <X className="w-3 h-3 text-red-500" />
                                          </button>
                                        </>
                                      ) : (
                                        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                                          bg-white border border-line hover:border-teal-400
                                                          text-xs text-gray-500 hover:text-teal-600
                                                          cursor-pointer transition-all duration-200 whitespace-nowrap">
                                          <Upload className="w-3.5 h-3.5" />
                                          {hasExisting ? 'อัปโหลดเพิ่ม' : 'อัปโหลดไฟล์'}
                                          <input
                                            type="file"
                                            accept={ITA_ACCEPT}
                                            className="hidden"
                                            ref={(el) => { fileRefs.current[item.ID] = el }}
                                            onChange={(e) => {
                                              const file = e.target.files?.[0]
                                              if (!file) return
                                              if (!isAllowedITAFile(file)) {
                                                toast.error(ITA_REJECT_MSG)
                                                return
                                              }
                                              updateRow(item.ID, 'file', file)
                                            }}
                                          />
                                        </label>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}

                            {addingItemFor === topic.ID ? (
                              <AddItemInline
                                topicID={topic.ID}
                                parentChoices={(topic.Items ?? []).filter((i) => i.ParentID == null)}
                                onSuccess={() => {
                                  invalidateTopics()
                                  setAddingItemFor(null)
                                }}
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAddingItemFor(topic.ID)}
                                className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors pt-1"
                              >
                                <Plus className="w-3.5 h-3.5" /> เพิ่มหัวข้อย่อย
                              </button>
                            )}
                        </div>
                      </div>
                    ))}

                  {/* footer — เพิ่มหัวข้อหลัก */}
                  <div className="px-6 py-4">
                    {addingTopic ? (
                      <AddTopicInline
                        moitID={selectedMoit.ID}
                        onSuccess={() => {
                          invalidateTopics()
                          setAddingTopic(false)
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddingTopic(true)}
                        className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" /> เพิ่มหัวข้อหลัก
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save */}
          {selectedMoit && (totalItems > 0 || topics.length > 0) && (
            <Button
              type="button"
              disabled={saveMutation.isPending || filledCount === 0}
              onClick={() => saveMutation.mutate()}
              className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2
                         transition-all duration-200
                         ${filledCount > 0
                           ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md'
                           : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                         }`}
            >
              {saveMutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  บันทึก {filledCount > 0 ? `${filledCount} รายการ` : `ข้อมูล`}
                </>
              )}
            </Button>
          )}

        </div>
      </div>
    </div>
  )
}