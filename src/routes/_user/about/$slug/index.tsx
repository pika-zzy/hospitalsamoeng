import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Download, FileText } from 'lucide-react'

import { requestAPI } from '@/lib/api'
import { PageHero } from '@/components/page/page-hero'
import type { ContentGroup, ContentSection } from '@/interface/content'
import { yearsOf } from '@/interface/content'

// หน้าเนื้อหาที่แก้ได้จากหลังบ้าน — route เดียวเสิร์ฟทุกหน้า (/about/drug-safety,
// /about/ethics-club, /about/pdpa และหน้าที่ admin สร้างเพิ่มทีหลัง)
//
// route แบบ static (/about/doctor, /about/contact) ชนะ $slug อยู่แล้วตามกติกา
// ของ TanStack Router จึงไม่ต้องกันชื่อซ้ำเอง
//
// ⚠️ หน้าที่ admin สร้างใหม่จะเข้าถึงได้ทันทีทาง URL แต่จะยังไม่โผล่ในเมนู
// "เกี่ยวกับเรา" จนกว่าจะเพิ่มบรรทัดใน src/interface/menu.ts (เมนูหลักยังเป็นโค้ด)
export const Route = createFileRoute('/_user/about/$slug/')({
  component: RouteComponent,
})

const API_URL = import.meta.env.VITE_API_URL

function fileKind(url: string) {
  const ext = url.split('.').pop()?.toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg') return 'JPG'
  if (ext === 'png') return 'PNG'
  return 'PDF'
}

function RouteComponent() {
  const { slug } = Route.useParams()

  const { data, isLoading, isError } = useQuery<ContentSection | null>({
    queryKey: ['content-section', slug],
    queryFn: async () => {
      const resp = await requestAPI<ContentSection>({
        method: 'GET',
        url: `/content/sections/${slug}`,
        disableToken: true,
      })
      return resp.success ? (resp.data ?? null) : null
    },
  })

  const groups = useMemo(() => data?.groups ?? [], [data])
  const years = useMemo(() => yearsOf(groups), [groups])

  // ปีที่เลือกอยู่ — คำนวณจากข้อมูลที่มี ไม่เก็บเป็น state ที่ต้อง sync
  // (ปีที่เคยเลือกหายไปจากข้อมูล จะตกกลับปีล่าสุดเอง)
  const [pickedYear, setPickedYear] = useState<number | null>(null)
  const activeYear = years.includes(pickedYear ?? NaN) ? pickedYear : (years[0] ?? null)

  // ไม่มีปีเลย = แสดงทุกหัวข้อ · มีปี = แสดงเฉพาะปีที่เลือก
  // หัวข้อที่ไม่ผูกปีในหน้าที่มีปี ถือว่า "ใช้ได้ทุกปี" จึงแสดงเสมอ
  const visible = activeYear == null
    ? groups
    : groups.filter((g) => g.year === activeYear || g.year == null)

  if (isLoading) {
    return (
      <div className="pb-20">
        <PageHero title="กำลังโหลด..." />
        <p className="py-24 text-center text-[15px] text-stone-400">กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="pb-20">
        <PageHero eyebrow="Not found" title="ไม่พบหน้านี้" />
        <div className="mx-auto max-w-2xl px-4 pt-14 text-center">
          <p className="text-[15px] leading-relaxed text-stone-500">
            หน้าที่คุณเปิดอาจถูกย้ายหรือลบไปแล้ว
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-full bg-[#3b5546] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#2f4438]"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    )
  }

  // นับจากหัวข้อที่เห็นอยู่จริง ไม่ใช่ทั้งหน้า — ไม่งั้นเลือกปี 2569 แล้วยังขึ้น
  // จำนวนเอกสารรวมของทุกปี ซึ่งไม่ตรงกับที่ตาเห็น
  const visibleFiles = visible.reduce((n, g) => n + g.files.length, 0)

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="About"
        title={data.title}
        description={data.description || undefined}
      />

      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* ปุ่มสลับปี — ขึ้นเฉพาะหน้าที่หัวข้อผูกปีไว้ (ชมรมจริยธรรม)
            ปีใหม่ที่ admin เพิ่มในหลังบ้านจะโผล่เองโดยไม่ต้องแก้โค้ด */}
        {years.length > 0 && (
          <div className="scrollbar-none -mx-4 mb-2 flex gap-2.5 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:px-0">
            {years.map((y) => {
              const isActive = y === activeYear
              const count = groups.filter((g) => g.year === y).length
              return (
                <button
                  key={y}
                  onClick={() => setPickedYear(y)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'border-[#3b5546] bg-[#3b5546] text-white'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-[#c9dacd] hover:text-[#3b5546]'
                  }`}
                >
                  ปีงบประมาณ {y}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10.5px] leading-none font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-4 mb-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-stone-200" />
          <span className="text-[11.5px] font-semibold tracking-widest text-[#96704f] uppercase">
            {visible.length} หัวข้อ · {visibleFiles} เอกสาร
          </span>
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        {visible.length === 0 ? (
          <p className="py-24 text-center text-[15px] text-stone-400">
            ยังไม่มีข้อมูลในหน้านี้
          </p>
        ) : (
          <div className="space-y-4">
            {visible.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GroupCard({ group }: { group: ContentGroup }) {
  return (
    <section className="rounded-2xl border border-stone-200/80 bg-white px-6 py-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e4ece5]">
          <FileText className="h-4 w-4 text-[#4a6b57]" />
        </span>
        <h2 className="text-[16px] leading-relaxed font-semibold text-[#24352b]">
          {group.title}
        </h2>
      </div>

      {/* เนื้อความยาว (เช่น Privacy Notice) — เว็บเก่าเก็บเป็นข้อความล้วน ไม่ใช่ HTML
          จึงเรนเดอร์เป็น text ตรง ๆ ด้วย whitespace-pre-line ห้ามใช้ dangerouslySetInnerHTML */}
      {group.body && (
        <div className="mb-4 border-l-2 border-[#e4ece5] pl-4 text-[14.5px] leading-[1.9] whitespace-pre-line text-stone-600">
          {group.body}
        </div>
      )}

      {group.files.length > 0 ? (
        <div className="space-y-1.5">
          {group.files.map((file) => (
            <a
              key={file.id}
              href={`${API_URL}${file.file_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-stone-200/80 bg-[#fdfcf9] px-4 py-3 transition-all duration-150 hover:border-[#c9dacd] hover:bg-[#f3f7f3]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#dcc3ab] bg-[#f2eee4]">
                <span className="text-[9px] font-bold text-[#96704f]">
                  {fileKind(file.file_url)}
                </span>
              </span>
              <span className="flex-1 text-[13.5px] leading-relaxed text-stone-600 transition-colors group-hover:text-[#24352b]">
                {file.label}
              </span>
              <Download className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-[#4a6b57]" />
            </a>
          ))}
        </div>
      ) : (
        // หัวข้อที่ไม่มีทั้งไฟล์และเนื้อความ — เว็บเก่ามีอยู่จริง 1 หัวข้อ (ขึ้น "ไม่พบข้อมูล")
        // บอกให้ชัดดีกว่าปล่อยการ์ดว่างจนดูเหมือนหน้าพัง (บทเรียนเดียวกับหน้า /news/$id)
        !group.body && (
          <p className="text-[13.5px] text-stone-400">ยังไม่มีเอกสารในหัวข้อนี้</p>
        )
      )}
    </section>
  )
}
