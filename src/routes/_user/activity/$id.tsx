import type ActivityInfo from '@/interface/activity_info';
import { requestAPI } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Calendar, Tag, Info, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL;
export const Route = createFileRoute('/_user/activity/$id')({
  component: RouteComponent,
})

function RouteComponent() {
   const { id } = Route.useParams()

    const { data : activity } = useQuery<ActivityInfo>({
        queryKey: ["activities",id],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
          const resp = await requestAPI<ActivityInfo>({
            method: "GET",
            url: `/activities/${id}`,
          });
          if (resp.success) {
            return resp.data;
          }
          throw new Error("Failed to fetch news");
        },
      });
    
      
 
  const navigate = useNavigate()
  const [isPortrait, setIsPortrait] = useState(false)

  if (!activity) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <Info className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-xl">ไม่พบข้อมูลกิจกรรม</p>
        <button onClick={() => navigate({ to: '/activity' })} className="mt-4 text-green-600 font-bold">กลับหน้ากิจกรรม</button>
      </div>
    )
  }

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
        <div
          className={`relative w-full rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-slate-50 ${
            isPortrait
              ? 'h-128 flex items-center justify-center'
              : 'h-96 md:h-112'
          }`}
        >
          <img 
            src={`${API_URL}${activity.img_url}`}
            alt={activity.title}
            onLoad={(e) => {
              const img = e.currentTarget
              setIsPortrait(img.naturalHeight > img.naturalWidth)
            }}
            className={isPortrait ? 'h-full w-auto max-w-full object-contain' : 'w-full h-full object-cover'}
          />
          <div className={`absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent ${isPortrait ? 'opacity-0' : ''}`} />
        </div>
      </div>

      {/* 3. Content Section */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-3 uppercase tracking-widest">
            <Tag className="w-4 h-4" />
            กิจกรรม
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight">
            {activity.title}
          </h1>
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-4 mb-10 p-5 bg-slate-50 rounded-2xl border border-slate-100 max-w-md">
          <div className="p-2.5 bg-white rounded-xl shadow-sm">
            <Calendar className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">วันที่จัดกิจกรรม</p>
            <p className="text-sm font-semibold text-gray-700">
              {new Date(activity.start_date).toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}
              {activity.end_date && ` - ${new Date(activity.end_date).toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </p>
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
      </div>
    </div>
  )
}