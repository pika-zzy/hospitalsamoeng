import { useEffect } from "react"

// จัดการ <title> และ meta tag ต่อหน้า (SEO + การ์ดตอนแชร์ลิงก์ในไลน์/เฟซบุ๊ก)
//
// ทำไมเขียน DOM เองแทน head() + <HeadContent/> ของ TanStack Router:
// เว็บนี้เป็น CSR ล้วน ไม่มี SSR ทั้งสองทางจึง inject ฝั่ง client เหมือนกัน แต่หน้า
// dynamic (news/$id, activity/$id, about/$slug) ดึงข้อมูลด้วย useQuery ใน component
// ไม่ได้ใช้ route loader → head() จะไม่มีข้อมูลให้ใช้ ถ้าจะใช้ต้องยก data fetching
// ไป loader + ผูก queryClient เข้า router context = รื้อมากเกินจำเป็น
// ใช้กลไกเดียวทั้งเว็บยังกันสองระบบเขียนทับ meta กันเองด้วย

export const SITE_NAME = "โรงพยาบาลสะเมิง"

// โดเมนจริง — ยังว่างจนกว่าจะได้ subdomain จากกระทรวง ตั้งเป็น Build Arg
// VITE_SITE_URL ใน Dokploy แล้ว rebuild เมื่อได้โดเมนมา (ดู Dockerfile)
// ระหว่างที่ยังว่าง เราจะไม่ใส่ canonical/og:url เลย — URL ผิดแย่กว่าไม่มี
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/+$/, "")

// ไฟล์อัปโหลดอยู่คนละ origin กับหน้าเว็บ (backend) — ใช้ประกอบ og:image ให้เป็น URL เต็ม
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "")

const DEFAULT_DESCRIPTION =
  "โรงพยาบาลสะเมิง อำเภอสะเมิง จังหวัดเชียงใหม่ — ข่าวสารและประกาศ จัดซื้อจัดจ้าง กิจกรรม บริการผู้ป่วย และข้อมูล ITA คุณธรรมและความโปร่งใส โทร 053-487-124"

// รูปประจำเว็บสำหรับการ์ดแชร์ลิงก์ (ตอนนี้เป็นโลโก้ 225×225)
// ⚠️ ถ้ามีรูปหน้าปก 1200×630 เมื่อไหร่ ให้วางที่ public/og-image.jpg แล้วเปลี่ยนค่านี้
const DEFAULT_IMAGE = "/images.PNG"

// ความยาว description ที่ Google/โซเชียลตัดแสดง — ตัดเองให้จบคำจะอ่านง่ายกว่าโดนตัดกลาง
const DESCRIPTION_MAX = 160

export type SeoOptions = {
  /** ชื่อหน้า (ไม่ต้องต่อท้ายด้วยชื่อโรงพยาบาล hook ต่อให้เอง) — undefined = ใช้ชื่อเว็บเดี่ยว ๆ */
  title?: string
  /** คำอธิบายหน้า — undefined = ใช้คำอธิบายกลางของเว็บ */
  description?: string
  /** รูปสำหรับการ์ดแชร์ — รับได้ทั้ง URL เต็ม, /uploads/... (ไฟล์ที่ backend) และ /xxx ใน public/ */
  image?: string
  /** true = ห้าม search engine เก็บหน้านี้ (หน้าหลังบ้าน / หน้าที่ยังไม่มีเนื้อหาจริง) */
  noindex?: boolean
}

/**
 * ตั้ง title + meta ของหน้าปัจจุบัน เรียกได้จากทุก route component
 *
 * หน้าที่ข้อมูลมาจาก API ให้ส่งค่าเป็น undefined ไปก่อนระหว่างโหลด
 * (จะได้ค่ากลางของเว็บชั่วคราว แล้วอัปเดตเองเมื่อข้อมูลมาถึง)
 */
export function useSeo({ title, description, image, noindex }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} จังหวัดเชียงใหม่`
    const desc = clamp(description?.trim() || DEFAULT_DESCRIPTION, DESCRIPTION_MAX)
    const img = absoluteUrl(image?.trim() || DEFAULT_IMAGE)
    const pageUrl = SITE_URL
      ? SITE_URL + window.location.pathname + window.location.search
      : null

    document.title = fullTitle

    upsertMeta("name", "description", desc)
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : null)

    upsertMeta("property", "og:title", fullTitle)
    upsertMeta("property", "og:description", desc)
    upsertMeta("property", "og:image", img)
    upsertMeta("property", "og:url", pageUrl)

    upsertMeta("name", "twitter:title", fullTitle)
    upsertMeta("name", "twitter:description", desc)
    upsertMeta("name", "twitter:image", img)

    upsertCanonical(pageUrl)
  }, [title, description, image, noindex])
}

/** ตัดข้อความให้จบคำ (เว้นวรรค) ไม่เกินความยาวที่กำหนด แล้วปิดท้ายด้วย … */
function clamp(text: string, max: number) {
  const flat = text.replace(/\s+/g, " ").trim()
  if (flat.length <= max) return flat

  const cut = flat.slice(0, max)
  const lastSpace = cut.lastIndexOf(" ")
  // ภาษาไทยไม่เว้นวรรคระหว่างคำ — ถ้าไม่เจอช่องว่างใกล้ ๆ ท้ายก็ตัดตรง ๆ
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…"
}

/** ทำ URL ให้เต็ม: ไฟล์ /uploads อยู่ที่ backend ส่วน path อื่นเป็นไฟล์ใน public/ ของหน้าเว็บ */
function absoluteUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith("/uploads")) return API_URL ? API_URL + url : url
  return SITE_URL ? SITE_URL + url : url
}

/** เขียน/อัปเดต <meta> ตาม key — ส่ง content = null เพื่อลบแท็กนั้นทิ้ง */
function upsertMeta(attr: "name" | "property", key: string, content: string | null) {
  const el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)

  if (content === null) {
    el?.remove()
    return
  }

  if (el) {
    el.setAttribute("content", content)
    return
  }

  const created = document.createElement("meta")
  created.setAttribute(attr, key)
  created.setAttribute("content", content)
  document.head.appendChild(created)
}

/** <link rel="canonical"> — ไม่ใส่เลยถ้ายังไม่รู้โดเมนจริง */
function upsertCanonical(href: string | null) {
  const el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (href === null) {
    el?.remove()
    return
  }

  if (el) {
    el.href = href
    return
  }

  const created = document.createElement("link")
  created.rel = "canonical"
  created.href = href
  document.head.appendChild(created)
}
