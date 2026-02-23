import { sampleActivities } from '@/interface/activity_info'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Calendar, Tag, Info, Clock, ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/activity/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const activity = sampleActivities.find((item) => item.id === id)

  if (!activity) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <Info className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-xl">ไม่พบข้อมูลกิจกรรม</p>
        <button onClick={() => navigate({ to: '/activity' })} className="mt-4 text-green-600 font-bold">กลับหน้ากิจกรรม</button>
      </div>
    )
  }

  const statusMap = {
    'active': { text: 'กำลังดำเนินการ', color: 'bg-green-100 text-green-700 border-green-200' },
    'inactive': { text: 'ปิดรับสมัคร', color: 'bg-gray-100 text-gray-600 border-gray-200' },
    'completed': { text: 'เสร็จสิ้นกิจกรรม', color: 'bg-blue-100 text-blue-700 border-blue-200' }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. Header Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <button 
          onClick={() => navigate({ to: '/activity' })}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors font-medium text-sm group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          กลับไปหน้ากิจกรรมทั้งหมด
        </button>
      </div>

      {/* 2. Hero Image Section */}
      <div className="max-w-5xl mx-auto px-4 mb-10">
        <div className="relative h-100 md:h-125 w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img 
            src={activity.imgUrl} 
            alt={activity.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badge on Image */}
          <div className="absolute bottom-8 left-8">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${statusMap[activity.status]?.color || 'bg-white text-black'}`}>
              {statusMap[activity.status]?.text}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Content Section */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-3 uppercase tracking-widest">
            <Tag className="w-4 h-4" />
            {activity.type}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight">
            {activity.name}
          </h1>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">วันที่จัดกิจกรรม</p>
              <p className="text-sm font-semibold">
                {new Date(activity.startDate).toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}
                {activity.endDate && ` - ${new Date(activity.endDate).toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">อัปเดตล่าสุดเมื่อ</p>
              <p className="text-sm font-semibold">
                {new Date(activity.updatedAt).toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-slate prose-lg max-w-none">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-green-500 rounded-full" />
            รายละเอียดกิจกรรม
          </h3>
          <p className="text-gray-600 leading-loose text-lg whitespace-pre-line">
            {activity.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-gray-400 font-medium italic">โรงพยาบาลสะเมิง - มุ่งมั่นให้บริการด้วยหัวใจ</p>
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-full transition-colors"
          >
            พิมพ์เอกสารนี้
          </button>
        </div>
      </div>
    </div>
  )
}