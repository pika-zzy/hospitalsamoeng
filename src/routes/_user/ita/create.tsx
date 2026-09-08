import { createFileRoute } from '@tanstack/react-router'
import { useSeo } from '@/lib/seo'

export const Route = createFileRoute('/_user/ita/create')({
  component: RouteComponent,
})

function RouteComponent() {
  // placeholder ที่ยังไม่มีอะไรลิงก์มา — กันไม่ให้หลุดเข้า Google
  useSeo({ noindex: true })

  return <div>Hello "/_user/ita/create"!</div>
}
