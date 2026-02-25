import { createFileRoute } from '@tanstack/react-router'
import { Code, Layout, Smartphone, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/service/')({
  component: RouteComponent,
})

// 1. สร้าง Type และ Mock Data ขึ้นมาก่อน (ในอนาคตย้ายไปไฟล์ config หรือดึง API ก็ได้)
type ServiceItem = {
  title: string
  description: string
  icon: React.ElementType
}

const services: ServiceItem[] = [
  {
    title: 'Web Development',
    description: 'สร้างเว็บไซต์ที่เร็ว แรง และรองรับ SEO ด้วย Tech Stack ล่าสุด',
    icon: Code,
  },
  {
    title: 'UI/UX Design',
    description: 'ออกแบบ User Interface ที่สวยงามและใช้งานง่าย เข้าใจผู้ใช้',
    icon: Layout,
  },
  {
    title: 'Mobile Apps',
    description: 'พัฒนาแอปพลิเคชันบนมือถือที่ลื่นไหล รองรับทั้ง iOS และ Android',
    icon: Smartphone,
  },
  
]

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">บริการของเรา</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          เรามุ่งมั่นที่จะส่งมอบโซลูชันที่ดีที่สุดเพื่อตอบโจทย์ธุรกิจของคุณ
          ด้วยเทคโนโลยีที่ทันสมัยและทีมงานมืออาชีพ
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 cursor-pointer"
          >
            <div className="mb-4 inline-block p-3 bg-blue-50 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <service.icon size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">{service.title}</h3>
            <p className="text-slate-500 mb-4">{service.description}</p>
            
            <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
              ดูรายละเอียด <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}