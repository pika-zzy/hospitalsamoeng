// หน้าเนื้อหาที่แก้ได้จากหลังบ้าน — mirror ของ model ฝั่ง backend
// (models/content_model.go) แก้ฝั่งไหนต้องตามไปแก้อีกฝั่งเสมอ
//
// 3 ชั้น: ContentSection (1 หน้าเว็บ) → ContentGroup (1 หัวข้อ) → ContentFile (1 เอกสาร)
// เสิร์ฟที่ /about/<slug> · จัดการที่ /admin/content

export interface ContentFile {
  id: number
  group_id: number
  /** ชื่อที่แสดงบนปุ่มดาวน์โหลด */
  label: string
  file_url: string
  sort_order: number
}

export interface ContentGroup {
  id: number
  section_id: number
  title: string
  /** เนื้อความยาวที่ไม่ได้อยู่ในไฟล์แนบ (เช่น Privacy Notice) ปกติเป็นค่าว่าง */
  body: string
  /** พ.ศ. — null = หัวข้อนี้ไม่ผูกกับปี (หน้าเว็บจะไม่ขึ้นปุ่มสลับปี) */
  year: number | null
  sort_order: number
  files: ContentFile[]
}

export interface ContentSection {
  id: number
  /** ส่วนท้าย URL ของหน้า — ห้ามแก้หลังเผยแพร่ ลิงก์ที่คนบันทึกไว้จะพัง */
  slug: string
  title: string
  description: string
  sort_order: number
  /** มีเฉพาะตอนดึงรายหน้า (GET /content/sections/:slug) — รายการรวมไม่ส่งมา */
  groups?: ContentGroup[]
}

/** ปีทั้งหมดที่หน้านี้มี เรียงใหม่→เก่า · ว่าง = หน้านี้ไม่ได้แยกตามปี */
export function yearsOf(groups: ContentGroup[]): number[] {
  const set = new Set<number>()
  for (const g of groups) {
    if (g.year != null) set.add(g.year)
  }
  return [...set].sort((a, b) => b - a)
}
