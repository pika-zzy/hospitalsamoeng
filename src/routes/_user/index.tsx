import { createFileRoute } from '@tanstack/react-router'
import Main_page from '@/components/page/Mainpage/Mainpage'
import VisionSection from '@/components/page/Vision/Vision'
import News_page from '@/components/page/Newspage/Newspage'
import Activity from '@/components/page/Activity/Activity'
import PublicServices from '@/components/page/Publicpage'
import StaffPortal from '@/components/page/Staffpage'


export const Route = createFileRoute('/_user/')({
  component: Home,
})

// REFACTOR: โครงหน้าแรกตาม mockup "แบบ G" (2026-07-15) — พื้นทั้งหน้าเป็น mint (green-50)
// hero เฟดขอบล่างเข้าพื้นนี้ ทุก section โปร่งใสวางการ์ดขาวลอยบนพื้นเดียวกันทั้งผืน
// (สี green-50 ต้องตรงกับปลาย gradient ใน Mainpage.tsx — แก้ฝั่งหนึ่งต้องแก้อีกฝั่ง)
function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden font-sarabun bg-green-50">
      <Main_page />
      <VisionSection />
      <News_page />
      <Activity />
      <PublicServices />
      <StaffPortal />
    </div>
  )
}
