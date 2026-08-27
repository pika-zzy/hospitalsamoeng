import { createFileRoute, Link } from '@tanstack/react-router'
import { FileClock, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/_user/about/history/')({
  component: RouteComponent,
})

// FIX: เนื้อหาเดิมเป็น placeholder ที่ผิด — เขียนว่า "โรงพยาบาลสมองเชียงใหม่ ก่อตั้งปี พ.ศ.2530"
// ทั้งที่เป็นโรงพยาบาลสะเมิง ข้อมูลผิดบนเว็บราชการอันตรายกว่าไม่มีข้อมูล จึงเปลี่ยนเป็นหน้า
// "อยู่ระหว่างจัดทำ" ไปก่อน และซ่อนเมนู "ประวัติ" ใน interface/menu.ts แล้ว
// (route ยังอยู่ กันคนที่เคยบุ๊กมาร์ก/ลิงก์เก่าเจอ 404) — ได้เนื้อหาจริงเมื่อไหร่ค่อยเขียนทับหน้านี้
function RouteComponent() {
  return (
    <div className="min-h-[70vh] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200/80 bg-white px-6 py-14 text-center sm:px-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f7f3] text-[#4a6b57]">
          <FileClock className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#24352b]">ประวัติความเป็นมา</h1>

        <p className="mt-4 text-[17px] leading-relaxed text-stone-500">
          ขออภัย ขณะนี้อยู่ระหว่างการจัดทำข้อมูลประวัติความเป็นมาของโรงพยาบาลสะเมิง
          <br className="hidden sm:block" />
          หากต้องการสอบถามข้อมูล สามารถติดต่อโรงพยาบาลได้โดยตรง
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
