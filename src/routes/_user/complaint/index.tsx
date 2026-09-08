import { createFileRoute } from '@tanstack/react-router'
import { useSeo } from '@/lib/seo'

export const Route = createFileRoute('/_user/complaint/')({
  component: RouteComponent,
})

function RouteComponent() {
  // NOTE: หน้านี้ยังเป็น placeholder แต่มีเมนู navbar ชี้มาแล้ว — กันไม่ให้ถูก
  // เก็บเข้า Google ไปก่อน จนกว่าจะมีเนื้อหาจริง (ดู Known Issues ข้อ 3 ใน CLAUDE.md)
  useSeo({ title: 'แจ้งเรื่องร้องเรียน', noindex: true })

  return <div>Hello "/complaint/"!</div>
}
