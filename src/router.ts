import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// FIX: scroll jumped to the footer when navigating (e.g. "ดูทั้งหมด" from the
// bottom of the home page) because scroll position wasn't reset. scrollRestoration
// resets to the top on new navigations and restores position on back/forward.
//
// FIX: on a full page load (fresh visit or F5 reload) the router would otherwise
// restore the previous scroll position from its sessionStorage cache — reloading
// at the bottom of a page kept you at the bottom. Returning false for the first
// render after a page load skips that restore so the page starts at the top,
// while every later client-side navigation keeps normal behavior (push → top,
// back/forward → previous position).
let isFirstRender = true

export const router = createRouter({
  routeTree,
  scrollRestoration: () => {
    if (isFirstRender) {
      isFirstRender = false
      return false
    }
    return true
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
