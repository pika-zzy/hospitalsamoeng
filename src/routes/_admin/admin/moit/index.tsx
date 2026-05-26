import { requestAPI } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_admin/admin/moit/')({
  component: RouteComponent,
})

interface ITAYear { ID: number; Year: number }
interface MoitItem { ID: number; Label: string; TopicID: number }
interface MoitTopic { ID: number; Label: string; MoitID: number; Items: MoitItem[] }
interface Moit { ID: number; Name: string; Description: string; YearID: number }

function InlineEdit({ value, onSave, onCancel, placeholder = '', multiline = false }: {
  value: string; onSave: (val: string) => void; onCancel: () => void; placeholder?: string; multiline?: boolean
}) {
  const [val, setVal] = useState(value)
  return (
    <div className="flex items-start gap-2 flex-1">
      {multiline ? (
        <textarea autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder} rows={2}
          className="flex-1 px-3 py-1.5 text-sm border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" />
      ) : (
        <input autoFocus type="text" value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder}
          className="flex-1 px-3 py-1.5 text-sm border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none" />
      )}
      <button onClick={() => val.trim() && onSave(val.trim())}
        className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shrink-0 transition-colors mt-0.5">
        <Check className="w-3.5 h-3.5 text-white" />
      </button>
      <button onClick={onCancel}
        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors mt-0.5">
        <X className="w-3.5 h-3.5 text-gray-500" />
      </button>
    </div>
  )
}

function RouteComponent() {
  const qc = useQueryClient()
  const [selectedYearID, setSelectedYearID] = useState<number | null>(null)
  const [addingYear, setAddingYear] = useState(false)
  const [newYear, setNewYear] = useState('')
  const [openMoit, setOpenMoit] = useState<number | null>(null)
  const [openTopic, setOpenTopic] = useState<number | null>(null)
  const [editingMoit, setEditingMoit] = useState<number | null>(null)
  const [editingTopic, setEditingTopic] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [addingMoit, setAddingMoit] = useState(false)
  const [addingTopicFor, setAddingTopicFor] = useState<number | null>(null)
  const [addingItemFor, setAddingItemFor] = useState<number | null>(null)

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

  const createYear = useMutation({
    mutationFn: (year: number) => requestAPI({ method: 'POST', url: '/ita/years', body: { year, Year: year } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ita-years'] }); setAddingYear(false); setNewYear('') },
  })

  const deleteYear = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/ita/years/${id}` }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ita-years'] }); setSelectedYearID(null); setOpenMoit(null) },
  })

  const { data: moits = [], isLoading } = useQuery<Moit[]>({
    queryKey: ['moit', activeYearID],
    enabled: !!activeYearID,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<Moit[]>({ method: 'GET', url: `/ita/years/${activeYearID}/moit` })
      if (resp.success) return resp.data ?? []
      return []
    },
  })

  const { data: topics = [] } = useQuery<MoitTopic[]>({
    queryKey: ['moit-topics', openMoit],
    enabled: !!openMoit,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<MoitTopic[]>({ method: 'GET', url: `/moit/${openMoit}/topics` })
      if (resp.success) return resp.data ?? []
      return []
    },
  })

  const invalidateMoit = () => qc.invalidateQueries({ queryKey: ['moit', activeYearID] })
  const invalidateTopics = () => qc.invalidateQueries({ queryKey: ['moit-topics', openMoit] })

  const createMoit = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      requestAPI({ method: 'POST', url: `/ita/years/${activeYearID}/moit`, body: { name: data.name, description: data.description, Name: data.name, Description: data.description } }),
    onSuccess: () => { invalidateMoit(); setAddingMoit(false) },
  })

  const updateMoit = useMutation({
    mutationFn: ({ id, name, description }: { id: number; name: string; description: string }) =>
      requestAPI({ method: 'PUT', url: `/moit/${id}`, body: { name, description, Name: name, Description: description } }),
    onSuccess: () => { invalidateMoit(); setEditingMoit(null) },
  })

  const deleteMoit = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/moit/${id}` }),
    onSuccess: () => { invalidateMoit(); setOpenMoit(null) },
  })

  const createTopic = useMutation({
    mutationFn: ({ moitId, label }: { moitId: number; label: string }) =>
      requestAPI({ method: 'POST', url: `/moit/${moitId}/topics`, body: { label, Label: label } }),
    onSuccess: () => { invalidateTopics(); setAddingTopicFor(null) },
  })

  const updateTopic = useMutation({
    mutationFn: ({ id, label }: { id: number; label: string }) =>
      requestAPI({ method: 'PUT', url: `/topics/${id}`, body: { label, Label: label } }),
    onSuccess: () => { invalidateTopics(); setEditingTopic(null) },
  })

  const deleteTopic = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/topics/${id}` }),
    onSuccess: () => invalidateTopics(),
  })

  const createItem = useMutation({
    mutationFn: ({ topicId, label }: { topicId: number; label: string }) =>
      requestAPI({ method: 'POST', url: `/topics/${topicId}/items`, body: { label, Label: label } }),
    onSuccess: () => { invalidateTopics(); setAddingItemFor(null) },
  })

  const updateItem = useMutation({
    mutationFn: ({ id, label }: { id: number; label: string }) =>
      requestAPI({ method: 'PUT', url: `/items/${id}`, body: { label, Label: label } }),
    onSuccess: () => { invalidateTopics(); setEditingItem(null) },
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => requestAPI({ method: 'DELETE', url: `/items/${id}` }),
    onSuccess: () => invalidateTopics(),
  })

  const confirmDelete = (label: string, onConfirm: () => void) => {
    if (window.confirm(`ลบ "${label}" ใช่ไหมครับ?`)) onConfirm()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-medium text-emerald-600 tracking-widest uppercase mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-1 h-7 bg-emerald-500 rounded-full inline-block" />
            จัดการโครงสร้าง MOIT
          </h1>
        </div>

        {/* Year selector */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">ปีงบประมาณ</p>
            <button onClick={() => setAddingYear(true)}
              className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" /> เพิ่มปี
            </button>
          </div>

          {loadingYears ? (
            <div className="flex gap-2">
              {[1,2,3].map(i => <div key={i} className="w-16 h-9 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {years.map((y) => (
                <div key={y.ID} className="relative group/year">
                  <button onClick={() => { setSelectedYearID(y.ID); setOpenMoit(null); setOpenTopic(null) }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeYearID === y.ID ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {y.Year}
                  </button>
                  <button onClick={() => confirmDelete(String(y.Year), () => deleteYear.mutate(y.ID))}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-400 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/year:opacity-100 transition-opacity">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}

              {addingYear && (
                <div className="flex items-center gap-2">
                  <input autoFocus type="number" value={newYear} onChange={(e) => setNewYear(e.target.value)} placeholder="เช่น 2570"
                    className="w-24 px-3 py-1.5 text-sm border border-emerald-400 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                  <button onClick={() => { const y = parseInt(newYear); if (y > 2500) createYear.mutate(y) }}
                    className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button onClick={() => { setAddingYear(false); setNewYear('') }}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              )}

              {!loadingYears && years.length === 0 && !addingYear && (
                <p className="text-sm text-gray-400">ยังไม่มีปีงบประมาณ กด "เพิ่มปี" เพื่อเริ่มต้นครับ</p>
              )}
            </div>
          )}
        </div>

        {/* MOIT list */}
        {activeYearID && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">MOIT ปี {years.find((y) => y.ID === activeYearID)?.Year}</p>
              <button onClick={() => setAddingMoit(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> เพิ่ม MOIT
              </button>
            </div>

            {isLoading && <p className="text-sm text-gray-400 text-center py-10">กำลังโหลด...</p>}

            {addingMoit && (
              <div className="bg-white border border-emerald-200 rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-sm font-semibold text-gray-700">เพิ่ม MOIT ใหม่</p>
                <AddMoitForm onSave={(name, description) => createMoit.mutate({ name, description })} onCancel={() => setAddingMoit(false)} />
              </div>
            )}

            {moits.map((moit) => {
              const isOpen = openMoit === moit.ID
              const isEditing = editingMoit === moit.ID
              return (
                <div key={moit.ID} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 group">
                    <button onClick={() => { setOpenMoit(isOpen ? null : moit.ID); setOpenTopic(null) }}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-emerald-600">{moit.ID}</span>
                      </div>
                      {!isEditing && (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{moit.Name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{moit.Description}</p>
                        </div>
                      )}
                    </button>
                    {isEditing ? (
                      <AddMoitForm defaultName={moit.Name} defaultDesc={moit.Description}
                        onSave={(name, description) => updateMoit.mutate({ id: moit.ID, name, description })}
                        onCancel={() => setEditingMoit(null)} />
                    ) : (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingMoit(moit.ID)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <Pencil className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <button onClick={() => confirmDelete(moit.Name, () => deleteMoit.mutate(moit.ID))} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                        <ChevronRight className={`w-4 h-4 text-gray-300 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                      </div>
                    )}
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-50 px-5 py-3 space-y-2">
                      {topics.length === 0 && <p className="text-xs text-gray-400 py-2">ยังไม่มีหัวข้อหลัก</p>}

                      {topics.map((topic) => {
                        const isTopicOpen = openTopic === topic.ID
                        const isEditingTopic = editingTopic === topic.ID
                        return (
                          <div key={topic.ID} className="rounded-xl border border-gray-100 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 group">
                              <button onClick={() => setOpenTopic(isTopicOpen ? null : topic.ID)} className="flex-1 min-w-0 text-left">
                                {!isEditingTopic && <p className="text-sm text-gray-700 font-medium line-clamp-2">{topic.Label}</p>}
                              </button>
                              {isEditingTopic ? (
                                <InlineEdit value={topic.Label} multiline placeholder="หัวข้อหลัก..."
                                  onSave={(label) => updateTopic.mutate({ id: topic.ID, label })} onCancel={() => setEditingTopic(null)} />
                              ) : (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button onClick={() => setEditingTopic(topic.ID)} className="w-6 h-6 rounded-lg hover:bg-gray-200 flex items-center justify-center">
                                    <Pencil className="w-3 h-3 text-gray-400" />
                                  </button>
                                  <button onClick={() => confirmDelete(topic.Label, () => deleteTopic.mutate(topic.ID))} className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center">
                                    <Trash2 className="w-3 h-3 text-red-400" />
                                  </button>
                                  <ChevronRight className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-200 ${isTopicOpen ? 'rotate-90' : ''}`} />
                                </div>
                              )}
                            </div>

                            {isTopicOpen && (
                              <div className="px-4 py-2 space-y-1.5">
                                {(topic.Items ?? []).map((item) => (
                                  <div key={item.ID} className="flex items-start gap-2 py-1.5 group/item">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                                    {editingItem === item.ID ? (
                                      <InlineEdit value={item.Label} multiline placeholder="หัวข้อย่อย..."
                                        onSave={(label) => updateItem.mutate({ id: item.ID, label })} onCancel={() => setEditingItem(null)} />
                                    ) : (
                                      <>
                                        <p className="flex-1 text-xs text-gray-600 leading-relaxed">{item.Label}</p>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                                          <button onClick={() => setEditingItem(item.ID)} className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                                            <Pencil className="w-3 h-3 text-gray-400" />
                                          </button>
                                          <button onClick={() => confirmDelete(item.Label, () => deleteItem.mutate(item.ID))} className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center">
                                            <Trash2 className="w-3 h-3 text-red-400" />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}

                                {addingItemFor === topic.ID ? (
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                                    <InlineEdit value="" multiline placeholder="เช่น 1.1 มีบันทึกข้อความ..."
                                      onSave={(label) => createItem.mutate({ topicId: topic.ID, label })} onCancel={() => setAddingItemFor(null)} />
                                  </div>
                                ) : (
                                  <button onClick={() => setAddingItemFor(topic.ID)}
                                    className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-1 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> เพิ่มหัวข้อย่อย
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {addingTopicFor === moit.ID ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3">
                          <InlineEdit value="" multiline placeholder="เช่น 1. คำสั่ง / ประกาศ ที่ระบุกรอบแนวทาง..."
                            onSave={(label) => createTopic.mutate({ moitId: moit.ID, label })} onCancel={() => setAddingTopicFor(null)} />
                        </div>
                      ) : (
                        <button onClick={() => setAddingTopicFor(moit.ID)}
                          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors pt-1">
                          <Plus className="w-4 h-4" /> เพิ่มหัวข้อหลัก
                        </button>
                      )}
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

function AddMoitForm({ defaultName = '', defaultDesc = '', onSave, onCancel }: {
  defaultName?: string; defaultDesc?: string; onSave: (name: string, description: string) => void; onCancel: () => void
}) {
  const [name, setName] = useState(defaultName)
  const [desc, setDesc] = useState(defaultDesc)
  return (
    <div className="flex items-start gap-2 flex-1">
      <div className="flex flex-col gap-2 flex-1">
        <input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อ เช่น MOIT1"
          className="px-3 py-1.5 text-sm border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="คำอธิบาย เช่น หน่วยงานมีการวางระบบ..." rows={2}
          className="px-3 py-1.5 text-sm border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" />
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button onClick={() => name.trim() && desc.trim() && onSave(name.trim(), desc.trim())}
          className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors">
          <Check className="w-3.5 h-3.5 text-white" />
        </button>
        <button onClick={onCancel}
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  )
}