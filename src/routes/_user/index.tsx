import { createFileRoute } from '@tanstack/react-router'
import Main_page from '@/components/page/Mainpage/Mainpage'
import QuickActions from '@/components/page/QuickActions'
import VisionSection from '@/components/page/Vision/Vision'
import News_page from '@/components/page/Newspage/Newspage'
import Activity from '@/components/page/Activity/Activity'
import PublicServices from '@/components/page/Publicpage'
import StaffPortal from '@/components/page/Staffpage'

export const Route = createFileRoute('/_user/')({
  component: Home,
})

// REDESIGN (โทน sage): พื้นหน้าเว็บย้ายไปประกาศที่ _user/route.tsx แล้ว
// หน้าแรกจึงเหลือแค่ลำดับ section — QuickActions แทรกใต้ hero และลอยทับขอบ hero ขึ้นไป
function Home() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <Main_page />
      <QuickActions />
      <VisionSection />
      <News_page />
      <Activity />
      <PublicServices />
      <StaffPortal />
    </div>
  )
}
