import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/history/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 min-h-screen ">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">ประวัติความเป็นมา</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          โรงพยาบาลสมองเชียงใหม่ก่อตั้งขึ้นในปี พ.ศ. 2530 โดยมีเป้าหมายที่จะให้บริการทางการแพทย์ที่มีคุณภาพสูงแก่ชุมชนในพื้นที่และจังหวัดใกล้เคียง ด้วยทีมแพทย์และบุคลากรที่มีความเชี่ยวชาญ โรงพยาบาลได้เติบโตอย่างรวดเร็วและได้รับความไว้วางใจจากผู้ป่วยมากมาย
        </p>
      </div>
    </>
  )
}
