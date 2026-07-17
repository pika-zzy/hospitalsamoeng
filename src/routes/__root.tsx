import { Outlet, createRootRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Toaster } from 'sonner'

// NOTE: load Router Devtools only in development. In a production build
// import.meta.env.PROD is statically true, so this lazy import is tree-shaken
// out entirely — the floating devtools panel no longer ships to end users.
const RouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import('@tanstack/react-router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )

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

      <Toaster richColors position="top-center" />
      <Suspense>
        <RouterDevtools />
      </Suspense>
    </div>
  )
}
