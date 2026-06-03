import { Button } from "@/components/ui/button";
import type ActivityInfo from "@/interface/activity_info";
import { requestAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ArrowRight, ImageOff } from "lucide-react";

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
      throw new Error("Failed to fetch activities");
    },
  });

  // เรียงล่าสุดก่อน เอา 6 รายการ
  const activities = [...(data ?? [])]
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    .slice(0, 6);

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* ─── Header ─── */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-emerald-500 uppercase mb-0.5">
                Activities &amp; Events
              </p>
              <h2 className="text-3xl font-black text-gray-900 leading-none">
                กิจกรรม<span className="text-emerald-500">ล่าสุด</span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/activity" })}
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-emerald-600 transition-colors group"
          >
            ดูทั้งหมด
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* ─── Empty state ─── */}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm italic text-gray-400">ยังไม่มีกิจกรรมในขณะนี้</p>
          </div>
        )}

        {/* ─── Grid ─── */}
        {activities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, idx) => {
              const dateObj = new Date(activity.start_date);
              const day = dateObj.toLocaleDateString("th-TH", { day: "numeric" });
              const month = dateObj.toLocaleDateString("th-TH", { month: "short" });
              const fullDate = dateObj.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              // card แรกใหญ่ span 2 คอลัมน์ ถ้ามีมากกว่า 1 รายการ
              const isFeatured = idx === 0 && activities.length > 1;

              return (
                <div
                  key={activity.id}
                  onClick={() => navigate({ to: `/activity/${activity.id}` })}
                  className={`group flex flex-col bg-white rounded-2xl overflow-hidden
                    border border-gray-100 cursor-pointer
                    hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1
                    transition-all duration-300
                    ${isFeatured ? "sm:col-span-2 lg:col-span-1 lg:row-span-1" : ""}
                  `}
                >
                  {/* ─── Image ─── */}
                  <div className={`relative overflow-hidden flex-shrink-0 ${isFeatured ? "h-72 sm:h-80" : "h-52 sm:h-60"}`}>
                    {activity.img_url ? (
                      <img
                        src={`${API_URL}${activity.img_url}`}
                        alt={activity.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
                        <ImageOff className="w-12 h-12 text-emerald-200" />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Date badge top-left */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex flex-col items-center shadow-sm min-w-[40px]">
                      <span className="text-lg font-black text-emerald-700 leading-none">{day}</span>
                      <span className="text-[9px] text-emerald-500 font-bold uppercase mt-0.5">{month}</span>
                    </div>

                    {/* ล่าสุด badge เฉพาะ card แรก */}
                    {idx === 0 && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                        ล่าสุด
                      </div>
                    )}

                    {/* Title overlay ด้านล่างรูป */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className={`font-bold text-white leading-snug line-clamp-2 drop-shadow
                        ${isFeatured ? "text-lg" : "text-[14px]"}`}>
                        {activity.title}
                      </h3>
                    </div>
                  </div>

                  {/* ─── Content ─── */}
                  <div className="p-4 flex flex-col flex-1">
                    {activity.description && (
                      <p className="text-[12.5px] text-gray-500 line-clamp-2 leading-relaxed flex-1">
                        {activity.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {fullDate}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-600
                                       group-hover:gap-2 transition-all">
                        อ่านเพิ่มเติม <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Mobile button ─── */}
        <div className="mt-8 md:hidden">
          <Button
            onClick={() => navigate({ to: "/activity" })}
            className="w-full py-3.5 bg-emerald-50 text-emerald-700 font-semibold rounded-2xl
                       text-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
          >
            ดูกิจกรรมทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </section>
  );
}