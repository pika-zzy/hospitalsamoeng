import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsInProd } from '@tanstack/react-router-devtools'


export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    // FIX: use natural document scrolling instead of a nested overflow-y-auto
    // container. The inner scroller broke router scrollRestoration (it only
    // resets window scroll), so navigating to a long page (e.g. คลังกิจกรรม)
    // kept the old scroll position. min-h-screen + flex-col still pushes the
    // Footer to the bottom on short pages.
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-slate-50">
      <main className="grow w-full">
        <Outlet />
      </main>

      <TanStackRouterDevtoolsInProd />
    </div>
  )
}
