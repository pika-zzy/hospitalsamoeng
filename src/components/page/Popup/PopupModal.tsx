import { requestAPI } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useState } from 'react'

interface Popup {
  ID: number
  Status: boolean
  ImageURL: string
}

const API_URL = import.meta.env.VITE_API_URL

/**
 * PopupModal — ป็อปอัปประชาสัมพันธ์ฝั่ง public
 * NOTE: ตามสเปก ไม่ใช้ localStorage/sessionStorage — แสดงใหม่ทุกครั้งที่โหลดเว็บ/รีเฟรช
 *       (mount ครั้งเดียวใน UserLayout → เปิด 1 ครั้งต่อการเข้าเว็บเต็ม ๆ, ปิดแล้วไม่เด้งซ้ำตอนสลับหน้าแบบ client-side)
 */
export default function PopupModal() {
  const [closed, setClosed] = useState(false)

  const { data: popup } = useQuery<Popup | null>({
    queryKey: ['popup-public'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<Popup>({ method: 'GET', url: '/popup', disableToken: true })
      return resp.success ? resp.data : null
    },
  })

  if (closed) return null
  if (!popup?.Status || !popup.ImageURL) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onClick={() => setClosed(true)}
    >
      <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="ปิด"
          onClick={() => setClosed(true)}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-gray-700 shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={`${API_URL}${popup.ImageURL}`}
          alt="ประชาสัมพันธ์"
          className="w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}
