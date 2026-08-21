import { createFileRoute, Link } from '@tanstack/react-router'
import { Stethoscope, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/_user/service/')({
  component: RouteComponent,
})

// เนื้อหาเดิมของหน้านี้เป็น template บริษัทรับทำเว็บที่ติดมาตอนตั้งโปรเจกต์
// (Web Development / UI-UX Design / Mobile Apps) ไม่เกี่ยวกับโรงพยาบาลเลย — ถอดออกแล้ว
// route ยังอยู่กันลิงก์เก่าเจอ 404 (ไม่มีเมนูไหนชี้มาหน้านี้)
// ข้อมูลบริการจริงของโรงพยาบาลอยู่ที่ section "บริการสำหรับประชาชน" บนหน้าแรก
function RouteComponent() {
  return (
    <div className="min-h-[70vh] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200/80 bg-white px-6 py-14 text-center sm:px-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f7f3] text-[#4a6b57]">
          <Stethoscope className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#24352b]">บริการของโรงพยาบาล</h1>

        <p className="mt-4 text-[17px] leading-relaxed text-stone-500">
          ข้อมูลคลินิกและหน่วยบริการทั้งหมด อยู่ที่หัวข้อ “บริการสำหรับประชาชน” บนหน้าแรก
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#3b5546] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#2f4438]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            กลับหน้าแรก
          </Link>
          <Link
            to="/about/contact"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-[13.5px] font-semibold text-stone-600 transition-colors hover:border-[#3b5546] hover:bg-[#3b5546] hover:text-white"
          >
            ติดต่อสอบถาม
          </Link>
        </div>
      </div>
    </div>
  )
}
