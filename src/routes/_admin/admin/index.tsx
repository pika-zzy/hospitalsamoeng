import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/')({
  component: RouteComponent,
    beforeLoad: () => {
      throw redirect({
        to: "/admin/dashboard",
      });
    },
})

function RouteComponent() {
  return(
    <>
    </>
  )
}
