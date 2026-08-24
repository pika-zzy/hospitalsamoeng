import type { ReactNode } from "react"

/* ─────────────────────────────────────────────────────────────────────────────
   PALETTE — "sage" โทนเว็บฝั่งประชาชน (เขียวหม่นอบอุ่น + น้ำตาลไม้)

   ทุกสีเขียนเป็น Tailwind arbitrary value ในไฟล์ tsx โดยตรง ไม่มีการแก้ CSS
   คัดลอกค่าจากตารางนี้ไปใช้ให้ตรงกันทุกหน้า อย่าคิดเฉดใหม่เอง

     sage-50   #f3f7f3      sage-500  #6b8c76      clay-300  #dcc3ab
     sage-100  #e4ece5      sage-600  #4a6b57  ←   clay-400  #c9a184
     sage-200  #c9dacd      sage-700  #3b5546  ←   clay-500  #b08968
     sage-300  #a7bfad      sage-800  #2f4438      clay-600  #96704f
     sage-400  #8aa893      sage-900  #24352b
                            sage-950  #16211a      cream     #faf8f3 / #f2eee4

   ← = สีหลักที่ใช้บ่อยสุด (ปุ่ม/ลิงก์/หัวข้อเน้น)
   สีเทา ตัวอักษรรอง และเส้นขอบ ใช้ stone-* ของ Tailwind (เทาอมน้ำตาล เข้ากับ sage)
   ───────────────────────────────────────────────────────────────────────────── */

// หัว section มาตรฐาน — ทุกหน้าใช้ตัวนี้ตัวเดียว
// (เดิมแต่ละ section เขียนหัวข้อเอง เลยได้ขนาด/น้ำหนัก/สีไม่ตรงกันสักอัน)
// โครง: ขีดสั้นสีน้ำตาลไม้ + eyebrow ตัวเล็ก → หัวข้อไทยตัวใหญ่ → คำอธิบาย
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  tone = "light",
}: {
  /** ตัวประดับ ไม่ใช่ข้อมูล — ละได้ */
  eyebrow?: string
  title: ReactNode
  description?: string
  /** ปุ่ม/ลิงก์บรรทัดเดียวกับหัวข้อ (เช่น "ดูทั้งหมด") — โชว์เฉพาะ align="start" */
  action?: ReactNode
  align?: "start" | "center"
  /** dark = วางบนพื้นเขียวเข้ม (กลับสีตัวหนังสือให้อ่านออก) */
  tone?: "light" | "dark"
}) {
  const centered = align === "center"

  return (
    <div
      className={`mb-8 flex gap-4 sm:mb-10 ${
        centered ? "flex-col items-center text-center" : "items-end justify-between"
      }`}
    >
      <div className={centered ? "max-w-2xl" : "min-w-0"}>
        {eyebrow && (
          <div className={`flex items-center gap-2.5 ${centered ? "justify-center" : ""}`}>
            <span className="h-px w-8 bg-[#c9a184]" aria-hidden="true" />
            <span
              className={`text-[11px] font-semibold tracking-[0.18em] uppercase ${
                tone === "dark" ? "text-[#dcc3ab]" : "text-[#96704f]"
              }`}
            >
              {eyebrow}
            </span>
          </div>
        )}

        <h2
          className={`mt-3 text-2xl leading-tight font-bold tracking-tight sm:text-[32px] ${
            tone === "dark" ? "text-white" : "text-[#24352b]"
          }`}
        >
          {title}
        </h2>

        {description && (
          <p
            className={`mt-2.5 max-w-xl text-[15px] leading-relaxed ${
              tone === "dark" ? "text-[#c9dacd]" : "text-stone-500"
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {action && !centered && <div className="hidden shrink-0 sm:block">{action}</div>}
    </div>
  )
}

// ลิงก์ "ดูทั้งหมด" ท้ายหัว section — หน้าตาเดียวกันทุกที่
export function MoreLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-full border border-[#c9dacd] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#3b5546] transition-colors duration-200 hover:border-[#3b5546] hover:bg-[#3b5546] hover:text-white"
    >
      {children}
      <span
        className="transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        →
      </span>
    </button>
  )
}
