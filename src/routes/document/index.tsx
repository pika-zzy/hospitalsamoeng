import { documentList } from '@/interface/document'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/document/')({
  component: RouteComponent,
})
function RouteComponent() {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-10 text-gray-800">
          เอกสารที่เกี่ยวข้อง
        </h1>

        <div className="space-y-5">
          {documentList.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-2"
            >
              {/* Header */}
              <button
                onClick={() => toggle(doc.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {doc.title}
                </span>

                <span
                  className={`text-xl transition-transform duration-300 ${
                    openId === doc.id ? "rotate-180" : ""
                  }`}
                >
                  ⌄
                </span>
              </button>

              {/* Content */}
              <div
                className={`grid transition-all duration-300 ${
                  openId === doc.id
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 space-y-3">
                    {doc.items?.map((item) => (
                      <a
                        key={item.id}
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-blue-50 hover:translate-x-1 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-gray-700">
                          📄 {item.title}
                        </span>
                        <span className="text-sm text-blue-600 font-medium">
                          ดาวน์โหลด
                        </span>
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
