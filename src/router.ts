import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  // FIX: scroll jumped to the footer when navigating (e.g. "ดูทั้งหมด" from the
  // bottom of the home page) because scroll position wasn't reset. This resets
  // to the top on new navigations and restores position on back/forward.
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
