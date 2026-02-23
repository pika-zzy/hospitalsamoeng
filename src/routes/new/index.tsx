import { Card } from '@/components/ui/card'
import { newInfoList } from '@/interface/newinfo'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react';
import { Megaphone, Briefcase, Calendar, ChevronRight, FileText } from 'lucide-react';

export const Route = createFileRoute('/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [tap, setTap] = useState<'job' | 'general'>('general');

  const { latestJob, latestGeneral } = useMemo(() => {
    const job = newInfoList.filter(n => n.type === "job");
    const genera = newInfoList.filter(n => n.type === "general");

    const sortByDate = (arr: typeof newInfoList) => {
      return [...arr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return {
      latestJob: sortByDate(job),
      latestGeneral: sortByDate(genera),
    }
  }, []);

  const latestList = tap === 'job' ? latestJob : latestGeneral;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-4">
            ศูนย์ข้อมูลข่าวสาร <span className="text-green-600">โรงพยาบาล</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            ติดตามประกาศรับสมัครงาน ข่าวประชาสัมพันธ์ และกิจกรรมต่างๆ เพื่อเข้าถึงบริการและโอกาสร่วมงานกับเรา
          </p>

          {/* Modern Tabs Design */}
          <div className="flex justify-center mt-10">
            <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl w-full max-w-md">
              <button
                onClick={() => setTap('general')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  tap === 'general' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                ประชาสัมพันธ์
              </button>
              <button
                onClick={() => setTap('job')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  tap === 'job' 
                  ? 'bg-white text-green-600 shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                รับสมัครงาน
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Content Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {latestList.length > 0 ? (
            latestList.map((info) => (
              <Card 
                key={info.id}
                className='group relative flex flex-col bg-white rounded-[2rem] border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer p-6' 
                onClick={() =>
                  navigate({
                    to: "/new/$id",
                    params: { id: info.id.toString() },
                  })
                }
              >
                {/* Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-2xl ${tap === 'job' ? 'bg-blue-50 text-green-600' : 'bg-green-50 text-blue-600'}`}>
                    {tap === 'job' ? <FileText className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">
                      {new Date(info.date).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className={`text-xl font-bold text-gray-800 mb-3 ${tap === 'job' ? 'group-hover:text-green-600' : 'group-hover:text-blue-600'} transition-colors leading-snug line-clamp-2`}>
                    {info.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6 font-medium">
                    {info.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${tap === 'job' ? 'text-green-600' : ' text-blue-600'}`}>อ่านรายละเอียด</span>
                  <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center ${tap === 'job' ? 'group-hover:bg-green-600' : ' group-hover:bg-blue-600'} group-hover:text-white transition-all`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-white inline-flex p-6 rounded-full shadow-inner mb-4">
                <FileText className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 font-medium">ขออภัย ยังไม่พบข้อมูลข่าวสารในหมวดนี้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}