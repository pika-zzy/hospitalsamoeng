import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/employee/usermanetmint')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/admin/employee/usermanetmint"!</div>
}
