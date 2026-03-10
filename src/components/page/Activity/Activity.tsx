import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type ActivityInfo from "@/interface/activity_info";
import { requestAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ArrowRight } from "lucide-react"; // แนะนำให้ใช้ lucide-react เพิ่มความพรีเมียม


export default function Activity() {
    const navigate = useNavigate();

     const { data } = useQuery<ActivityInfo[]>({
        queryKey: ["activities"],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
          const resp = await requestAPI<ActivityInfo[]>({
            method: "GET",
            url: "/activities",
          });
          if (resp.success) {
            return resp.data;
          }
          throw new Error("Failed to fetch news");
        },
      });
    
    const activities = [...( data ?? [])]
        .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
        .slice(0, 4);   

    const API_URL = import.meta.env.VITE_API_URL
    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-10">
                <div className="border-l-4 border-green-500 pl-4">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">กิจกรรมล่าสุด</h1>
                    <p className="text-gray-500 text-sm mt-1">ภาพบรรยากาศและกิจกรรมต่างๆ ของโรงพยาบาล</p>
                </div>
                <Button 
                    onClick={() => navigate({ to: '/activity' })}
                    className="hidden md:flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors group"
                >
                    ดูทั้งหมด 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            {/* Grid Layout - ปรับจาก 2 เป็น 4 ในจอใหญ่ หรือ 2 ในจอกลาง */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activities.map((activity) => (
                    <Card 
                        key={activity.id} 
                        className="group flex flex-col bg-white rounded-3xl overflow-hidden border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                        onClick={() => navigate({ to: `/activity/${activity.id}` })}
                    >
                        {/* Image Wrap */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={`${API_URL}${activity.img_url}`}
                                alt={activity.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Status Tag Overlay */}
                            <div className="absolute top-3 right-3">
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-sm ${ 'bg-gray-100'}`}>
                                    {}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                            
                            <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                                {activity.title}
                            </h2>
                            
                            <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                                {activity.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(activity.start_date).toLocaleDateString("th-TH", {
                                        day: "numeric",
                                        month: "short",
                                        year: "2-digit"
                                    })}
                                </div>
                                <span className="group-hover:text-green-600 font-bold">อ่านต่อ</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-10 md:hidden flex justify-center">
                <button className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl">
                    ดูข่าวสารและกิจกรรมทั้งหมด
                </button>
            </div>
        </div>
    );
}