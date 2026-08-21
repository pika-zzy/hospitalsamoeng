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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4"
      onClick={() => setClosed(true)}
    >
      <button
        type="button"
        aria-label="ปิด"
        onClick={() => setClosed(true)}
        className="fixed top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#24352b] shadow-lg transition-colors hover:bg-white"
      >
        <X className="w-6 h-6" />
      </button>
      <img
        src={`${API_URL}${popup.ImageURL}`}
        alt="ประชาสัมพันธ์"
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full h-auto w-auto rounded-2xl object-contain"
      />
    </div>
  )
}
