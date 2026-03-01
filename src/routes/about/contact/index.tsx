import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/contact/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about/contact/"!</div>
}
