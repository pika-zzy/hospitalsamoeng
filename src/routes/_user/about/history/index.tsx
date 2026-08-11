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
    <div className="bg-green-50 min-h-[70vh] px-4 py-20">
      <div className="max-w-2xl mx-auto text-center bg-white border border-green-100/60 rounded-3xl shadow-lg shadow-green-900/5 px-6 py-14 sm:px-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
          <FileClock className="w-8 h-8" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">ประวัติความเป็นมา</h1>

        <p className="mt-3 text-lg leading-relaxed text-gray-600">
          ขออภัย ขณะนี้อยู่ระหว่างการจัดทำข้อมูลประวัติความเป็นมาของโรงพยาบาลสะเมิง
          <br className="hidden sm:block" />
          หากต้องการสอบถามข้อมูล สามารถติดต่อโรงพยาบาลได้โดยตรง
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-bold shadow-sm hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            กลับหน้าแรก
          </Link>
          <Link
            to="/about/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-[1.5px] border-green-200 text-green-700 text-sm font-bold hover:bg-green-600 hover:border-green-600 hover:text-white transition-colors"
          >
            ติดต่อสอบถาม
          </Link>
        </div>
      </div>
    </div>
  )
}
