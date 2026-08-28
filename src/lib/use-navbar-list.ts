import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { Navbarlist, type MenuItem } from '@/interface/menu'
import type { ContentSection } from '@/interface/content'
import { requestAPI } from './api'

/**
 * เมนูหลักของเว็บ = โครงจาก `Navbarlist` (โค้ด) + หน้าเนื้อหาที่สร้างจาก /admin/content (DB)
 *
 * ทำไมต้องผสม ไม่ใช่เอาจาก DB ล้วน ๆ: โครงเมนู (หน้าหลัก / ITA / ข่าวสาร / เอกสาร /
 * ร้องเรียน) ผูกกับ route ในโค้ด ไม่ควรให้ลบหายจากหลังบ้านได้
 *
 * เมนูที่ตั้ง `appendContentSections: true` จะได้ section จาก DB ที่**ยังไม่มีใน submenu**
 * ต่อท้ายให้เอง เทียบกันด้วย path (`/about/<slug>`) จึงไม่มีทางซ้ำ
 *
 * NOTE (2026-08-28): เดิมเขียน 3 หน้าเนื้อหาไว้ใน Navbarlist ด้วยในฐานะ fallback ตอน
 * backend ล่ม — ถอดออกแล้ว **อย่าเอากลับมา** เพราะทำให้เมนูมีความจริง 2 ชุดที่ไม่ตรงกัน:
 * ลบหน้าในหลังบ้านแล้วเมนูยังโชว์ลิงก์ตาย · เปลี่ยนชื่อหน้าแล้วเมนูยังเป็นชื่อเก่า
 * (ชื่อที่ใช้เป็นของโค้ด ไม่ใช่ของ DB) · ตั้ง slug ไม่ตรงแล้วขึ้นทั้งของเก่าและของใหม่
 * ส่วน fallback เองก็ไม่ได้ช่วยอะไรจริง: backend ล่มทีข่าว/กิจกรรม/ITA ตายหมดทั้งเว็บอยู่แล้ว
 */
export function useNavbarList(): MenuItem[] {
  const { data: sections = [] } = useQuery<ContentSection[]>({
    queryKey: ['content-sections'],
    staleTime: 5 * 60 * 1000, // เมนูไม่ใช่ของที่เปลี่ยนบ่อย ไม่ต้องยิงทุกครั้งที่เปลี่ยนหน้า
    queryFn: async () => {
      const resp = await requestAPI<ContentSection[]>({
        method: 'GET',
        url: '/content/sections',
        disableToken: true,
      })
      return resp.success ? (resp.data ?? []) : []
    },
  })

  return useMemo(() => {
    if (sections.length === 0) return Navbarlist

    return Navbarlist.map((menu) => {
      if (!menu.appendContentSections || !menu.submenu) return menu

      const already = new Set(menu.submenu.map((s) => s.link))
      const extra = sections
        .filter((s) => !already.has(`/about/${s.slug}`))
        .map((s) => ({ name: s.title, link: `/about/${s.slug}` }))

      return extra.length > 0 ? { ...menu, submenu: [...menu.submenu, ...extra] } : menu
    })
  }, [sections])
}
