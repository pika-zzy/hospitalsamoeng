import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { icons } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const Route = createFileRoute('/_admin/admin/staffservice/')({
  component: RouteComponent,
})

const ALL_ICONS: {
  name: string
  icon: LucideIcon
}[] = Object.entries(icons).map(([name, icon]) => ({
  name,
  icon,
}))

type ColorOption = {
  label: string
  bgClass: string
  borderClass: string
  bgHex: string
  borderHex: string
}

const ICON_COLORS: ColorOption[] = [
  { label: 'green',  bgClass: 'bg-green-100',  borderClass: 'border-green-300',  bgHex: '#dcfce7', borderHex: '#86efac' },
  { label: 'blue',   bgClass: 'bg-blue-100',   borderClass: 'border-blue-300',   bgHex: '#dbeafe', borderHex: '#93c5fd' },
  { label: 'purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-300', bgHex: '#f3e8ff', borderHex: '#c084fc' },
  { label: 'orange', bgClass: 'bg-orange-100', borderClass: 'border-orange-300', bgHex: '#ffedd5', borderHex: '#fdba74' },
  { label: 'red',    bgClass: 'bg-red-100',    borderClass: 'border-red-300',    bgHex: '#fee2e2', borderHex: '#fca5a5' },
  { label: 'pink',   bgClass: 'bg-pink-100',   borderClass: 'border-pink-300',   bgHex: '#fce7f3', borderHex: '#f9a8d4' },
  { label: 'cream',  bgClass: 'bg-amber-50',   borderClass: 'border-amber-200',  bgHex: '#fffbeb', borderHex: '#fde68a' },
  { label: 'teal',   bgClass: 'bg-teal-100',   borderClass: 'border-teal-300',   bgHex: '#ccfbf1', borderHex: '#5eead4' },
]

function RouteComponent() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [iconSearch, setIconSearch] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(ICON_COLORS[0])

  const filteredIcons = ALL_ICONS.filter(({ name }) =>
    name.toLowerCase().includes(iconSearch.toLowerCase())
  )

  const SelectedIconComponent = selectedIcon
  ? (icons[selectedIcon as keyof typeof icons] as React.ElementType)
  : null

  return (
    <div className="min-h-screen bg-black/60 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-neutral-800 border border-neutral-700 rounded-2xl p-6 space-y-5">

        {/* ชื่อเมนู */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm text-neutral-400">
            <span className="w-3 h-3 rounded-sm border border-neutral-500 inline-block" />
            ชื่อเมนู
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="เช่น ระบบจัดการผู้ใช้"
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-neutral-700 border border-neutral-600 outline-none placeholder:text-neutral-500 focus:border-neutral-500 transition-colors"
          />
        </div>

        {/* คำอธิบาย */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm text-neutral-400">
            <span className="w-3 h-3 rounded-sm border border-neutral-500 inline-block" />
            คำอธิบาย
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="อธิบายการใช้งาน..."
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-neutral-700 border border-neutral-600 outline-none placeholder:text-neutral-500 focus:border-neutral-500 transition-colors"
          />
        </div>

        {/* ลิ้งเว็บไซต์ */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm text-neutral-400">
            <span className="w-3 h-3 rounded-sm border border-neutral-500 inline-block" />
            ลิ้งเว็บไซต์
          </label>
          <div className="flex items-center bg-neutral-700 border border-neutral-600 rounded-xl overflow-hidden focus-within:border-neutral-500 transition-colors">
            <span className="px-3 py-2.5 text-xs text-neutral-500 border-r border-neutral-600 select-none">
              https://
            </span>
            <input
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="example.com/path"
              className="flex-1 px-3 py-2.5 text-sm text-white bg-transparent outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>

        {/* เลือกไอคอน */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm text-neutral-400">
            <span className="w-3 h-3 rounded-sm border border-neutral-500 inline-block" />
            เลือกไอคอน
          </label>
          <input
            type="text"
            value={iconSearch}
            onChange={e => setIconSearch(e.target.value)}
            placeholder="ค้นหาไอคอน เช่น chart, file, user..."
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-neutral-700 border border-neutral-600 outline-none placeholder:text-neutral-500 focus:border-neutral-500 transition-colors"
          />

          {/* Icon grid */}
          <div className="bg-neutral-750 border border-neutral-700 rounded-xl overflow-y-auto max-h-48">
            <div className="grid grid-cols-9 gap-1 p-2">
              {filteredIcons.map(({ icon: Icon, name }) => {
                const isSelected = selectedIcon === name
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedIcon(name)}
                    title={name}
                    className={[
                      'aspect-square flex items-center justify-center rounded-lg transition-all',
                      isSelected
                        ? 'bg-neutral-600 border'
                        : 'bg-neutral-700 border border-neutral-600 hover:bg-neutral-600',
                    ].join(' ')}
                    style={isSelected ? { borderColor: selectedColor.borderHex } : undefined}
                  >
                    <Icon
                      size={16}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* สีไอคอน */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm text-neutral-400">
            <span className="w-3 h-3 rounded-sm border border-neutral-500 inline-block" />
            สีไอคอน
          </label>
          <div className="flex gap-2">
            {ICON_COLORS.map(color => {
              const isSelected = selectedColor.label === color.label
              return (
                <button
                  key={color.label}
                  onClick={() => setSelectedColor(color)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: color.bgHex,
                    outline: isSelected ? `2px solid ${color.borderHex}` : '2px solid transparent',
                    outlineOffset: '1px',
                  }}
                >
                  {isSelected && (
                    <div
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ background: color.borderHex }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ตัวอย่าง */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm text-neutral-400">
            <span className="w-3 h-3 rounded-sm border border-neutral-500 inline-block" />
            ตัวอย่าง
          </label>
          <div className="bg-neutral-700 border border-neutral-600 rounded-xl p-4 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: selectedColor.bgHex }}
            >
              {SelectedIconComponent ? (
                <SelectedIconComponent size={28} color={selectedColor.borderHex} />
              ) : (
                <div
                  className="w-6 h-6 rounded opacity-50"
                  style={{ background: selectedColor.borderHex }}
                />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {title || 'ชื่อเมนู'}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {description || 'คำอธิบาย'}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-700" />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button className="px-5 py-2 rounded-xl text-sm font-medium text-neutral-300 bg-neutral-700 border border-neutral-600 hover:bg-neutral-600 transition-colors">
            ยกเลิก
          </button>
          <button className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-neutral-700 border border-neutral-500 hover:bg-neutral-600 transition-colors flex items-center gap-2">
            {SelectedIconComponent && (
              <SelectedIconComponent size={14} color={selectedColor.borderHex} />
            )}
            เพิ่มเมนู
          </button>
        </div>

      </div>
    </div>
  )
}