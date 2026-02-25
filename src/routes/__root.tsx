import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navbar from '@/components/page/Nva/Navbar'
import { TanStackRouterDevtoolsInProd } from '@tanstack/react-router-devtools'
import Footer from '@/components/page/Footer/footer'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      
      {/* Navbar อยู่บนสุด */}
      <Navbar />

      {/* 2. ส่วนเนื้อหา + Footer ให้ Scroll ได้ในก้อนนี้ก้อนเดียว */}
      {/* flex-1 จะสั่งให้ก้อนนี้ขยายเต็มพื้นที่ที่เหลือจาก Navbar */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        
        {/* ส่วนเนื้อหา (Outlet) ให้ขยายเต็มที่ (flex-grow) เพื่อดัน Footer ลงล่าง */}
        <main className="grow w-full ">
          <Outlet />
        </main>

        <Footer />
        
      </div>

      <TanStackRouterDevtoolsInProd />
    </div>
    </>
  )
}
