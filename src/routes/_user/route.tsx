import Footer from '@/components/page/Footer/footer'
import Navbar from '@/components/page/Nva/Navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute("/_user")({
  component: UserLayout,
})

function UserLayout() {
  return( 
    <div className=" font-sarabun text-2xl"> 
      <Navbar />
      <Outlet />
      <Footer />
    </div>)
}
