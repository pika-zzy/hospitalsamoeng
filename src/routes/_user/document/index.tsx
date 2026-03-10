import { documentList } from '@/interface/document'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
// อย่าลืม import ไอคอนจาก lucide-react นะครับ
import { ChevronDown, FileText, Download, FolderOpen } from 'lucide-react'

export const Route = createFileRoute('/_user/document/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] py-12 font-sans">
      <div className="mx-auto px-4 max-w-3xl">
        
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-100 p-3.5 rounded-2xl text-green-600 shadow-sm">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              เอกสารที่เกี่ยวข้อง
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              เลือกหัวข้อเพื่อดูและดาวน์โหลดเอกสาร
            </p>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {documentList.map((doc) => (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                openId === doc.id
                  ? "border-green-500 shadow-md"
                  : "border-gray-200 shadow-sm hover:border-green-300"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggle(doc.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50/50 transition-colors focus:outline-none"
              >
                <span className={`text-lg font-semibold transition-colors ${
                  openId === doc.id ? "text-green-700" : "text-gray-800"
                }`}>
                  {doc.title}
                </span>

                <div className={`p-1.5 rounded-full transition-colors ${
                  openId === doc.id ? "bg-green-100 text-green-600" : "text-gray-400 bg-gray-50"
                }`}>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openId === doc.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Content */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openId === doc.id
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2 space-y-3 border-t border-gray-100 mt-2">
                    {doc.items?.map((item) => (
                      <a
                        key={item.id}
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-200 transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-gray-400 group-hover:text-green-500 transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="text-gray-700 font-medium group-hover:text-green-700 transition-colors line-clamp-1">
                            {item.title}
                          </span>
                        </div>

                        {/* Styled Download Button */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 group-hover:text-green-600 group-hover:border-green-300 group-hover:shadow-sm transition-all shrink-0">
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">ดาวน์โหลด</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}