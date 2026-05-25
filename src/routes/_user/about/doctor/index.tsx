import { departments, personnelData } from '@/interface/employee'
import { createFileRoute } from '@tanstack/react-router'
import { User, HeartHandshake, Hospital, } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/_user/about/doctor/')({
  component: RouteComponent,
})

const DEPT_COLORS: Record<string, string> = {
  0: 'from-green-50 to-emerald-100/60',
  1: 'from-teal-50 to-teal-100/60',
  2: 'from-blue-50 to-blue-100/60',
  3: 'from-amber-50 to-amber-100/60',
  4: 'from-pink-50 to-pink-100/60',
  5: 'from-purple-50 to-purple-100/60',
  6: 'from-sky-50 to-sky-100/60',
  7: 'from-lime-50 to-lime-100/60',
  8: 'from-orange-50 to-orange-100/60',
  9: 'from-rose-50 to-rose-100/60',
  10: 'from-cyan-50 to-cyan-100/60',
  11: 'from-violet-50 to-violet-100/60',
  12: 'from-fuchsia-50 to-fuchsia-100/60',
}



function RouteComponent() {
  const [activeTab, setActiveTab] = useState(departments[0].id)
  const pillsRef = useRef<HTMLDivElement>(null)

  const filteredPersonnel = personnelData.filter(p => p.deptId === activeTab)
  const activeDept = departments.find(d => d.id === activeTab)
  const activeDeptIndex = departments.findIndex(d => d.id === activeTab)
  const cardBg = DEPT_COLORS[activeDeptIndex % Object.keys(DEPT_COLORS).length] ?? DEPT_COLORS[0]

  // Scroll active pill into view
  useEffect(() => {
    const active = pillsRef.current?.querySelector('[data-active="true"]') as HTMLElement
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ─── Hero ─── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-4">
            <HeartHandshake className="w-3.5 h-3.5 text-green-600" />
            <span className="text-[11px] font-semibold text-green-700 tracking-wider">ทีมแพทย์ของเรา</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            ทำเนียบบุคลากร<span className="text-green-600">ทางการแพทย์</span>
          </h1>
          <p className="mt-3 text-[15px] text-gray-400 max-w-md mx-auto leading-relaxed">
            ทีมผู้เชี่ยวชาญที่พร้อมดูแลคุณด้วยใจ
          </p>
        </div>

        {/* ─── Pill filters ─── */}
        <div
          ref={pillsRef}
          className="flex gap-2.5 overflow-x-auto pb-3 mb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
        >
          {departments.map((dept) => {
            const isActive = activeTab === dept.id
            const count = personnelData.filter(p => p.deptId === dept.id).length
            return (
              <button
                key={dept.id}
                data-active={isActive}
                onClick={() => setActiveTab(dept.id)}
                className={`
                  inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2
                  text-[13px] font-medium transition-all duration-200 shrink-0
                  ${isActive
                    ? 'bg-gray-900 border-gray-900 text-white shadow-md shadow-gray-900/15'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                  }
                `}
              >
                {dept.name}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                    ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}
                  `}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ─── Divider + label ─── */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">
            {activeDept?.name} · {filteredPersonnel.length} คน
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* ─── Cards ─── */}
        {filteredPersonnel.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPersonnel.map((person) => (
              <div
                key={person.id}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden
                           hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1
                           transition-all duration-300 cursor-pointer"
              >
                {/* Colored top */}
                <div className={`h-24 bg-linear-to-br ${cardBg} flex items-end justify-center`}>
                  <div className="w-16 h-16 rounded-full border-[3px] border-white shadow-md
                                  bg-gray-100 overflow-hidden flex items-center justify-center
                                  translate-y-8 group-hover:scale-105 transition-transform duration-300">
                    {person.imageUrl ? (
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-7 h-7 text-gray-300" />
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="pt-10 pb-4 px-3 text-center">
                  <p className="text-[13px] font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors">
                    {person.prefix} {person.name}
                  </p>
                  <p className="text-[11px] text-green-600 font-medium mt-1 leading-snug">
                    {person.specialty}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-center gap-1 text-[11px] text-gray-400">
                    <Hospital className="w-3 h-3" />
                    <span>สะเมิง</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Ghost filler when only 1 person */}
            {filteredPersonnel.length === 1 && Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`ghost-${i}`}
                className={`hidden sm:flex flex-col items-center justify-center rounded-3xl
                  border border-dashed border-gray-200 min-h-50 gap-2
                  ${i >= 2 ? 'md:flex lg:hidden xl:flex' : ''}`}
                style={{ opacity: 0.25 - i * 0.07 }}
              >
                <User className="w-7 h-7 text-gray-300" />
                <p className="text-[11px] text-gray-400 italic">เร็วๆ นี้</p>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <User className="w-7 h-7 text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold text-gray-400">ยังไม่มีข้อมูลบุคลากร</p>
              <p className="text-[12px] text-gray-300 mt-1">ในแผนก{activeDept?.name}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}