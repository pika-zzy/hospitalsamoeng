import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/ita/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_user/ita/create"!</div>
}
