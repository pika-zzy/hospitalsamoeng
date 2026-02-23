import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/complaint/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/complaint/"!</div>
}
