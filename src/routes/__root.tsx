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
      <Navbar />

      {/* ส่วนเนื้อหาแต่ละหน้า */}
      <Outlet />

      {/* Devtools */}
      <TanStackRouterDevtoolsInProd />
      <Footer />
    </>
  )
}
