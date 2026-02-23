import { createFileRoute } from '@tanstack/react-router'
import Main_page from '@/components/page/Mainpage/Mainpage'
import News_page from '@/components/page/Newspage/Newspage'
import Activity from '@/components/page/Activity/Activity'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
  <div className="flex flex-col gap-0 overflow-x-hidden">
      {/* 1. ส่วนต้อนรับ (Hero) */}
      <section className="relative">
        <Main_page />
      </section>

      {/* 2. ส่วนข่าวสาร (ใช้พื้นหลังสีขาวเพื่อความชัดเจน) */}
      <section className=" bg-white">
        <News_page />
      </section>

      {/* 3. ส่วนกิจกรรม (เน้นภาพลักษณ์ชุมชน) */}
      <section className=" bg-green-50/50">
        <Activity />
      </section>

    
    </div>
  )
}
