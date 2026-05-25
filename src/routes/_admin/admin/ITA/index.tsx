import { Button } from '@/components/ui/button'
import { requestAPI } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Upload, X, Save, CheckCircle2, ChevronRight, Settings, Plus, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/_admin/admin/ITA/')({
  component: RouteComponent,
})

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
}

interface MoitTopic {
  ID: number
  MoitID: number
  Label: string
  Items: MoitItem[]
}

interface RowFile {
  item_id: number
  title: string
  file: File | null
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
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                      : value
                        ? 'border-emerald-300 text-gray-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-gray-200 text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
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
    },
    onError: () => setError('ไม่สามารถเพิ่มปีได้ กรุณาลองใหม่'),
  })

  const handleAdd = () => {
    const y = Number(yearInput)
    if (!yearInput || isNaN(y) || y < 2000 || y > 2100) {
      setError('กรุณาระบุปี ค.ศ. ที่ถูกต้อง (เช่น 2025)')
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
          placeholder="ปี ค.ศ. เช่น 2025"
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

// --------- Main ---------
function RouteComponent() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [selectedYearID, setSelectedYearID] = useState<number | null>(null)
  const [selectedMoitID, setSelectedMoitID] = useState<number | null>(null)
  const [rows, setRows] = useState<Record<number, RowFile>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showAddYear, setShowAddYear] = useState(false)
  const [showAddMoit, setShowAddMoit] = useState(false)
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({})

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

  // reset rows เมื่อ topics เปลี่ยน
  useEffect(() => {
    if (!topics.length) return
    const initial: Record<number, RowFile> = {}
    topics.forEach((topic) => {
      topic.Items.forEach((item) => {
        initial[item.ID] = { item_id: item.ID, title: '', file: null }
      })
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRows(initial)
    setSaveSuccess(false)
  }, [topics])

  const handleYearChange = (val: string) => {
    setSelectedYearID(val ? Number(val) : null)
    setSelectedMoitID(null)
    setRows({})
    setSaveSuccess(false)
    setShowAddMoit(false)
  }

  const handleMoitChange = (val: string) => {
    setSelectedMoitID(val ? Number(val) : null)
    setRows({})
    setSaveSuccess(false)
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
  const totalItems = Object.values(rows).length

  const saveMutation = useMutation({
    mutationFn: async () => {
      const promises = filledRows.map((r) => {
        const fd = new FormData()
        fd.append('item_id', String(r.item_id))
        fd.append('title', r.title)
        fd.append('year_id', String(selectedYearID))
        fd.append('file', r.file!)
        return requestAPI({ method: 'POST', url: '/ita/upload', body: fd })
      })
      return Promise.all(promises)
    },
    onSuccess: () => {
      setSaveSuccess(true)
      setRows((prev) => {
        const reset = { ...prev }
        Object.keys(reset).forEach((k) => {
          reset[Number(k)] = { ...reset[Number(k)], title: '', file: null }
        })
        return reset
      })
      Object.values(fileRefs.current).forEach((ref) => {
        if (ref) ref.value = ''
      })
    },
  })
  

  const yearOptions = years.map((y) => ({ value: String(y.ID), label: String(y.Year) }))
  const moitOptions = moitList.map((m) => ({ value: String(m.ID), label: m.Name }))
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-medium text-emerald-600 tracking-widest uppercase mb-1">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1 h-7 bg-emerald-500 rounded-full inline-block" />
              เพิ่มงาน ITA
            </h1>
          </div>
          <button
            onClick={() => navigate({ to: '/admin/moit' })}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200
                       hover:border-emerald-400 text-gray-600 hover:text-emerald-700
                       text-sm font-medium rounded-xl transition-all duration-200 shadow-sm"
          >
            <Settings className="w-4 h-4" />
            จัดการโครงสร้าง MOIT
          </button>
        </div>

        {/* Success */}
        {saveSuccess && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-100
                          text-emerald-700 text-sm px-4 py-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            บันทึกข้อมูลสำเร็จแล้วครับ
          </div>
        )}

        <div className="space-y-4">

          {/* Step 1 — เลือกปี */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                                 bg-emerald-100 text-emerald-700 text-xs font-bold mr-2">1</span>
                เลือกปีงบประมาณ
              </p>
              <button
                type="button"
                onClick={() => setShowAddYear((v) => !v)}
                className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700
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
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                                   bg-emerald-100 text-emerald-700 text-xs font-bold mr-2">2</span>
                  เลือกหมวด MOIT
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddMoit((v) => !v)}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700
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
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                                   bg-emerald-100 text-emerald-700 text-xs font-bold mr-2">3</span>
                  อัปโหลดเอกสาร — {selectedMoit.Name}
                </p>
                {filledRows.length > 0 && (
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
                    {filledRows.length} / {totalItems} รายการ
                  </span>
                )}
              </div>

              {loadingTopics ? (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  กำลังโหลดหัวข้อ...
                </div>
              ) : topics.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-gray-400">
                  ยังไม่มีหัวข้อใน {selectedMoit.Name} —{' '}
                  <button
                    onClick={() => navigate({ to: '/admin/moit' })}
                    className="text-emerald-600 hover:underline"
                  >
                    ไปเพิ่มหัวข้อ
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {topics
                    .sort((a, b) => a.Label.localeCompare(b.Label))
                    .map((topic) => (
                      <div key={topic.ID} className="px-6 py-5">
                        <div className="flex items-start gap-2 mb-4">
                          <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm font-semibold text-gray-700 leading-snug">
                            {topic.Label}
                          </p>
                        </div>

                        <div className="space-y-2.5 ml-6">
                          {(topic.Items ?? [])
                            .sort((a, b) => a.Label.localeCompare(b.Label))
                            .map((item) => {
                              const row = rows[item.ID]
                              const hasFile = !!row?.file

                              return (
                                <div
                                  key={item.ID}
                                  className={`rounded-xl border p-3.5 transition-all duration-200
                                    ${hasFile
                                      ? 'border-emerald-200 bg-emerald-50/40'
                                      : 'border-gray-100 bg-gray-50'
                                    }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        {item.Label}
                                      </p>
                                      {hasFile && (
                                        <input
                                          type="text"
                                          placeholder="ชื่อเอกสาร (ถ้าต้องการระบุเพิ่มเติม)"
                                          value={row.title}
                                          onChange={(e) => updateRow(item.ID, 'title', e.target.value)}
                                          className="mt-2 w-full px-3 py-1.5 text-xs border border-gray-200
                                                     rounded-lg bg-white focus:border-emerald-500
                                                     focus:ring-2 focus:ring-emerald-500/20 outline-none
                                                     transition-all placeholder:text-gray-300"
                                        />
                                      )}
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2">
                                      {hasFile ? (
                                        <>
                                          <span className="text-[11px] text-emerald-600 font-medium
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
                                                          bg-white border border-gray-200 hover:border-emerald-400
                                                          text-xs text-gray-500 hover:text-emerald-600
                                                          cursor-pointer transition-all duration-200 whitespace-nowrap">
                                          <Upload className="w-3.5 h-3.5" />
                                          อัปโหลด PDF
                                          <input
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            ref={(el) => { fileRefs.current[item.ID] = el }}
                                            onChange={(e) => {
                                              const file = e.target.files?.[0]
                                              if (!file) return
                                              if (file.type !== 'application/pdf') {
                                                alert('อัปโหลดได้เฉพาะไฟล์ PDF เท่านั้น')
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
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Save */}
          {selectedMoit && totalItems > 0 && (
            <Button
              type="button"
              disabled={saveMutation.isPending || filledRows.length === 0}
              onClick={() => saveMutation.mutate()}
              className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2
                         transition-all duration-200
                         ${filledRows.length > 0
                           ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
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
                  บันทึก {filledRows.length > 0 ? `${filledRows.length} รายการ` : 'ข้อมูล'}
                </>
              )}
            </Button>
          )}

        </div>
      </div>
    </div>
  )
}