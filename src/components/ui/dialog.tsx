import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

// Dialog กลางของระบบหลังบ้าน — ยกหน้าตามาจาก UploadDoneModal เดิมในหน้า ITA/create
// แล้วทำให้ใช้ซ้ำได้ + รองรับหลายปุ่ม (เช่น "เพิ่มต่อ" / "ไปหน้ารายการ")
// ใช้แทนการเขียน modal มือในแต่ละหน้า และแทน alert() ของ browser

export type DialogActionVariant = 'primary' | 'outline'

export type DialogAction = {
  label: string
  onClick: () => void
  variant?: DialogActionVariant // default = 'primary'
}

const ACTION_CLASS: Record<DialogActionVariant, string> = {
  primary:
    'bg-teal-600 hover:bg-teal-700 text-white border border-transparent',
  outline:
    'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200',
}

export function Dialog({
  open,
  title,
  description,
  icon,
  actions,
  onClose,
}: {
  open: boolean
  title: string
  description?: ReactNode
  icon?: ReactNode // default = ไอคอนติ๊กถูกสีเขียว (เคสสำเร็จ ซึ่งเป็นการใช้งานหลัก)
  actions: DialogAction[]
  onClose: () => void // เรียกเมื่อกดพื้นหลัง หรือกด Esc
}) {
  // ปิดด้วยปุ่ม Esc — modal เดิมในโปรเจกต์ไม่มี ทำให้ปิดได้แค่คลิกพื้นหลัง
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
          {icon ?? <CheckCircle2 className="w-7 h-7 text-teal-600" />}
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
        {description && <p className="text-sm text-gray-500 mb-5">{description}</p>}

        <div className="flex gap-3">
          {actions.map((action, i) => (
            <button
              key={action.label}
              type="button"
              // โฟกัสปุ่มสุดท้าย (ปุ่มหลัก) ให้กด Enter ยืนยันได้เลย
              autoFocus={i === actions.length - 1}
              onClick={action.onClick}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors
                          ${ACTION_CLASS[action.variant ?? 'primary']}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
