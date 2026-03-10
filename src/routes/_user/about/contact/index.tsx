import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/about/contact/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about/contact/"!</div>
}
