import type { ReactNode } from "react"

// แถบหัวหน้าใน (/news, /activity, /ita, /document, ...) — เขียวเข้มเต็มความกว้าง
// ทุกหน้าในใช้ตัวนี้ตัวเดียว เพื่อให้เปิดหน้าไหนก็รู้ว่าเป็นเว็บเดียวกัน
// สีและขนาดอ้างตารางสีใน section-heading.tsx
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  /** แถบเสริมใต้คำอธิบาย เช่น แท็บหมวด หรือช่องค้นหา */
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-[#2f4438] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      {/* วงกลมจาง ๆ กันพื้นเขียวดูตัน */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#4a6b57]/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        {eyebrow && (
          <div className="mb-5 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-[#c9a184]" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.18em] text-[#dcc3ab] uppercase">
              {eyebrow}
            </span>
            <span className="h-px w-8 bg-[#c9a184]" aria-hidden="true" />
          </div>
        )}

        <h1 className="text-3xl leading-tight font-bold tracking-tight text-balance text-white sm:text-[40px]">
          {title}
        </h1>

        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[#a7bfad]">
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  )
}
