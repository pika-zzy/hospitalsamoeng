import { Card } from '@/components/ui/card'
import type ActivityInfo from '@/interface/activity_info';
import { requestAPI } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Calendar } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
export const Route = createFileRoute('/_user/activity/')({
    component: RouteComponent,
})

function RouteComponent() {
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
    return (
        <>
            <div className="min-h-screen bg-slate-50 py-12">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        กิจกรรมโรงพยาบาล
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 tracking-tight">
                        คลังกิจกรรม <span className="text-green-600">ทั้งหมด</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        รวบรวมภาพบรรยากาศ ความประทับใจ และการดำเนินงานด้านต่างๆ
                        เพื่อส่งเสริมสุขภาพและความสุขของพี่น้องชาวสะเมิง
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="max-w-7xl mx-auto px-6">
                    {data === undefined && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-4/5 rounded-2xl bg-gray-200 animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {data !== undefined && data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">ยังไม่มีกิจกรรมในขณะนี้</p>
                            <p className="text-gray-400 text-sm mt-1">โปรดติดตามกิจกรรมใหม่ๆ ได้เร็วๆ นี้</p>
                        </div>
                    )}

                    {data !== undefined && data.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {data.map((activity) => (
                                <Card
                                    key={activity.id}
                                    onClick={() => navigate({ to: `/activity/${activity.id}` })}
                                    className="group relative aspect-4/5 rounded-2xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out p-0"
                                >
                                    {/* Main Image */}
                                    <img
                                        src={`${API_URL}${activity.img_url}`}
                                        alt={activity.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent"></div>

                                    {/* Content on Image */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h2 className="text-white text-base font-semibold leading-snug mb-1.5 drop-shadow-sm line-clamp-2">
                                            {activity.title}
                                        </h2>

                                        {/* ส่วนที่โผล่มาตอน Hover */}
                                        <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                                            <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed mb-2">
                                                {activity.description}
                                            </p>
                                            <div className="flex items-center text-green-400 text-[11px] font-semibold">
                                                อ่านรายละเอียด
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}