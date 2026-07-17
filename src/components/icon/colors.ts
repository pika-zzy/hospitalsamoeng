// source of truth เดียวของสีไอคอนเมนูบริการเจ้าหน้าที่ — ใช้ทั้งหน้า admin (/admin/staftmenu)
// ที่ให้เลือกสี และหน้า public (StaffPortal) ที่เรนเดอร์ออกมา
// ค่าที่เก็บลง DB คือ `label` เท่านั้น (เช่น "green") ไม่ใช่ class หรือ hex
// NOTE: แยกออกจาก icon.tsx เพราะไฟล์ component export ค่าที่ไม่ใช่ component ไม่ได้ (react-refresh)

export type ColorOption = {
  label: string
  bgClass: string
  borderClass: string
  textClass: string
  bgHex: string
  borderHex: string
  iconHex: string
}

// NOTE: iconHex เข้มกว่า borderHex เพราะ borderHex ใช้ทำขอบ/พรีวิวจาง ๆ
// แต่ตัวไอคอนจริงต้องอ่านออกบนพื้น bgClass
export const ICON_COLORS: ColorOption[] = [
  { label: 'green',  bgClass: 'bg-green-100',  borderClass: 'border-green-300',  textClass: 'text-green-700',  bgHex: '#dcfce7', borderHex: '#86efac', iconHex: '#15803d' },
  { label: 'blue',   bgClass: 'bg-blue-100',   borderClass: 'border-blue-300',   textClass: 'text-blue-700',   bgHex: '#dbeafe', borderHex: '#93c5fd', iconHex: '#1d4ed8' },
  { label: 'purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-300', textClass: 'text-purple-700', bgHex: '#f3e8ff', borderHex: '#c084fc', iconHex: '#7e22ce' },
  { label: 'orange', bgClass: 'bg-orange-100', borderClass: 'border-orange-300', textClass: 'text-orange-700', bgHex: '#ffedd5', borderHex: '#fdba74', iconHex: '#c2410c' },
  { label: 'red',    bgClass: 'bg-red-100',    borderClass: 'border-red-300',    textClass: 'text-red-700',    bgHex: '#fee2e2', borderHex: '#fca5a5', iconHex: '#b91c1c' },
  { label: 'pink',   bgClass: 'bg-pink-100',   borderClass: 'border-pink-300',   textClass: 'text-pink-700',   bgHex: '#fce7f3', borderHex: '#f9a8d4', iconHex: '#be185d' },
  { label: 'cream',  bgClass: 'bg-amber-50',   borderClass: 'border-amber-200',  textClass: 'text-amber-700',  bgHex: '#fffbeb', borderHex: '#fde68a', iconHex: '#b45309' },
  { label: 'teal',   bgClass: 'bg-teal-100',   borderClass: 'border-teal-300',   textClass: 'text-teal-700',   bgHex: '#ccfbf1', borderHex: '#5eead4', iconHex: '#0f766e' },
]

// แปลงชื่อสีที่เก็บใน DB → config; ถ้าเจอค่าที่ไม่รู้จัก (data เก่า/พิมพ์มือ) ให้ตกไปที่สีแรก ไม่ปล่อยพัง
export function getIconColor(label?: string): ColorOption {
  return ICON_COLORS.find((c) => c.label === label) ?? ICON_COLORS[0]
}
