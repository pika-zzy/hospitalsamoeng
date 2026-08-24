import Footer from '@/components/page/Footer/footer'
import Navbar from '@/components/page/Nva/Navbar'
import PopupModal from '@/components/page/Popup/PopupModal'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute("/_user")({
  component: UserLayout,
})

// พื้นหลังเบจครีมของทั้งเว็บฝั่งประชาชน (โทน sage) — ประกาศที่นี่ที่เดียว
// หน้าย่อยไม่ต้องตั้ง bg เอง ยกเว้นตั้งใจทำแถบสีทับ
function UserLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf8f3] font-sarabun">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      <PopupModal />
    </div>
  )
}
