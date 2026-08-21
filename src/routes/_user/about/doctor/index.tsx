import { departments } from '@/interface/employee'
import { requestAPI } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { PageHero } from '@/components/page/page-hero'

export const Route = createFileRoute('/_user/about/doctor/')({
  component: RouteComponent,
})

// ตรงกับ shape ที่ backend ส่ง (GET /personnel) — role = ชื่อ department ที่ admin เลือกตอนเพิ่ม
interface Personnel {
  id: number
  prefix: string
  name: string
  lastname: string
  role: string
  position: string
  img_url: string
}

const API_URL = import.meta.env.VITE_API_URL

// ป้ายย่อสำหรับ pill filter — ตัดคำนำหน้า "กลุ่มงาน" ออกให้กระชับ (ชื่อเต็มยังโชว์ที่ divider/empty state)
const shortDeptName = (name: string) => name.replace(/^กลุ่มงาน/, '').trim() || name

function RouteComponent() {
  const [activeTab, setActiveTab] = useState(departments[0].id)
  const pillsRef = useRef<HTMLDivElement>(null)

  const { data: personnelData = [], isLoading } = useQuery<Personnel[]>({
    queryKey: ['personnel'],
    queryFn: async () => {
      const resp = await requestAPI<Personnel[]>({ method: 'GET', url: '/personnel', disableToken: true })
      return resp.success ? resp.data ?? [] : []
    },
  })

  const activeDept = departments.find((d) => d.id === activeTab)
  // group ตามชื่อ department (role ที่ admin เลือก === dept.name)
  const filteredPersonnel = personnelData.filter((p) => p.role === activeDept?.name)

  // Scroll active pill into view
  useEffect(() => {
    const active = pillsRef.current?.querySelector('[data-active="true"]') as HTMLElement
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeTab])

  // REDESIGN (โทน sage): เดิมหัวการ์ดไล่สีคนละสีต่อกลุ่มงาน (เขียว/ฟ้า/ชมพู/ม่วง...) ดูเป็นสีรุ้ง
  // ตอนนี้ใช้เขียวชุดเดียวทั้งหน้า แยกกลุ่มงานด้วย pill filter ที่เลือกอยู่แทน
  // และถอดการ์ดหลอก "เร็วๆ นี้" ตอนมีบุคลากรคนเดียวออก
  // logic query / filter / scrollIntoView เดิมทั้งหมด
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Our Team"
        title="ทำเนียบบุคลากรทางการแพทย์"
        description="ทีมแพทย์ พยาบาล และบุคลากรทุกกลุ่มงานที่พร้อมดูแลคุณด้วยใจ"
      />

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">

        {/* ─── ตัวกรองกลุ่มงาน ─── */}
        <div
          ref={pillsRef}
          className="scrollbar-none -mx-4 mb-2 flex gap-2.5 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {departments.map((dept) => {
            const isActive = activeTab === dept.id
            const count = personnelData.filter((p) => p.role === dept.name).length
            return (
              <button
                key={dept.id}
                data-active={isActive}
                onClick={() => setActiveTab(dept.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'border-[#3b5546] bg-[#3b5546] text-white'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-[#c9dacd] hover:text-[#3b5546]'
                }`}
              >
                {shortDeptName(dept.name)}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10.5px] leading-none font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ─── เส้นคั่น + ชื่อกลุ่มงานที่เลือก ─── */}
        <div className="mt-4 mb-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-stone-200" />
          <span className="text-[11.5px] font-semibold tracking-widest text-[#96704f] uppercase">
            {activeDept?.name} · {filteredPersonnel.length} คน
          </span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        {/* ─── การ์ดบุคลากร ─── */}
        {isLoading ? (
          <p className="py-24 text-center text-[15px] text-stone-400">กำลังโหลดข้อมูลบุคลากร...</p>
        ) : filteredPersonnel.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredPersonnel.map((person) => (
              <div
                key={person.id}
                className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#24352b]/8"
              >
                {/* หัวการ์ด + รูป */}
                <div className="flex h-24 items-end justify-center bg-gradient-to-br from-[#f3f7f3] to-[#e4ece5]">
                  <div className="flex h-16 w-16 translate-y-8 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-stone-100 transition-transform duration-300 group-hover:scale-105">
                    {person.img_url ? (
                      <img
                        src={`${API_URL}${person.img_url}`}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-7 w-7 text-stone-300" />
                    )}
                  </div>
                </div>

                {/* ข้อมูล */}
                <div className="px-3 pt-10 pb-4 text-center">
                  <p className="text-[13.5px] leading-snug font-bold text-[#24352b] transition-colors group-hover:text-[#4a6b57]">
                    {person.prefix} {person.name} {person.lastname}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug font-medium text-[#96704f]">
                    {person.position || person.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ยังไม่มีข้อมูลบุคลากรในกลุ่มงานนี้ */
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-stone-300 bg-white/60 py-24">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f7f3]">
              <User className="h-7 w-7 text-[#c9dacd]" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-stone-500">ยังไม่มีข้อมูลบุคลากร</p>
              <p className="mt-1 text-[13px] text-stone-400">ใน{activeDept?.name}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
