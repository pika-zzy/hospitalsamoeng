import Footer from '@/components/page/Footer/footer'
import Navbar from '@/components/page/Nva/Navbar'
import PopupModal from '@/components/page/Popup/PopupModal'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute("/_user")({
  component: UserLayout,
})

function UserLayout() {
  return(
    <div className=" font-sarabun ">
      <Navbar />
      <Outlet />
      <Footer />
      <PopupModal />
    </div>)
}
