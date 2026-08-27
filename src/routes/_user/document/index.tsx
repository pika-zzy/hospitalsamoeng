import { documentList } from '@/interface/document'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown, FileText, Download } from 'lucide-react'
import { PageHero } from '@/components/page/page-hero'

export const Route = createFileRoute('/_user/document/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  // REDESIGN (โทน sage): หัวหน้าใช้ PageHero ชุดเดียวกับหน้าในอื่น ๆ
  // accordion เดิมคงพฤติกรรมทุกอย่าง (เปิดได้ทีละหัวข้อ, กดซ้ำเพื่อปิด)
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Downloads"
        title="เอกสารที่เกี่ยวข้อง"
        description="เลือกหัวข้อเพื่อดูและดาวน์โหลดเอกสารของโรงพยาบาลสะเมิง"
      />

      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="space-y-3.5">
          {documentList.map((doc) => {
            const isOpen = openId === doc.id

            return (
              <div
                key={doc.id}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                  isOpen
                    ? 'border-[#c9dacd] shadow-lg shadow-[#24352b]/8'
                    : 'border-stone-200/80 hover:border-[#c9dacd]'
                }`}
              >
                {/* หัวข้อ */}
                <button
                  onClick={() => toggle(doc.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#fdfcf9] focus:outline-none"
                >
                  <span
                    className={`text-[17px] font-semibold transition-colors ${
                      isOpen ? 'text-[#3b5546]' : 'text-[#24352b]'
                    }`}
                  >
                    {doc.title}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen ? 'bg-[#e4ece5] text-[#4a6b57]' : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    <ChevronDown
                      className={`h-4.5 w-4.5 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>

                {/* รายการไฟล์ */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-2.5 border-t border-stone-100 px-6 pt-4 pb-6">
                      {doc.items?.map((item) => (
                        <a
                          key={item.id}
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 rounded-xl border border-transparent bg-[#fdfcf9] p-4 transition-all duration-200 hover:border-[#c9dacd] hover:bg-[#f3f7f3]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <FileText className="h-5 w-5 shrink-0 text-stone-400 transition-colors group-hover:text-[#b08968]" />
                            <span className="line-clamp-1 text-[15.5px] font-medium text-stone-700 transition-colors group-hover:text-[#24352b]">
                              {item.title}
                            </span>
                          </span>

                          <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-[13px] font-semibold text-stone-600 transition-all group-hover:border-[#3b5546] group-hover:bg-[#3b5546] group-hover:text-white">
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">ดาวน์โหลด</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
