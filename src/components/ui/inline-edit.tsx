import { Check, X } from 'lucide-react'
import { useState } from 'react'

// Inline text editor ใช้ร่วมกันในหน้าจัดการ MOIT และหน้ารายการ ITA
// (เดิมนิยามในหน้า moit — ย้ายมาที่นี่เพื่อ reuse)
export function InlineEdit({ value, onSave, onCancel, placeholder = '', multiline = false }: {
  value: string; onSave: (val: string) => void; onCancel: () => void; placeholder?: string; multiline?: boolean
}) {
  const [val, setVal] = useState(value)
  return (
    <div className="flex items-start gap-2 flex-1">
      {multiline ? (
        <textarea autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder} rows={2}
          className="flex-1 px-3 py-1.5 text-sm border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-500/20 outline-none resize-none" />
      ) : (
        <input autoFocus type="text" value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder}
          className="flex-1 px-3 py-1.5 text-sm border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-500/20 outline-none" />
      )}
      <button onClick={() => val.trim() && onSave(val.trim())}
        className="w-7 h-7 rounded-lg bg-teal-500 hover:bg-teal-600 flex items-center justify-center shrink-0 transition-colors mt-0.5">
        <Check className="w-3.5 h-3.5 text-white" />
      </button>
      <button onClick={onCancel}
        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors mt-0.5">
        <X className="w-3.5 h-3.5 text-gray-500" />
      </button>
    </div>
  )
}
