import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsInProd } from '@tanstack/react-router-devtools'


export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
  
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        {/* ส่วนเนื้อหา (Outlet) ให้ขยายเต็มที่ (flex-grow) เพื่อดัน Footer ลงล่าง */}
        <main className="grow w-full ">
          <Outlet />
        </main>
      </div>

      <TanStackRouterDevtoolsInProd />
    </div>
    </>
  )
}
