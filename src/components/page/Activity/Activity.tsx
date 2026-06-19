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
      throw new Error("Failed to fetch news");
    },
  });

  const activities = [...(data ?? [])]
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    .slice(0, 4);

  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <div className="bg-linear-to-b from-emerald-50/60 to-white py-16 px-4 ">
      <div className="max-w-7xl mx-auto">

        {/* ─── Header ─── */}
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 rounded-full bg-linear-to-b from-emerald-400 to-emerald-600 shrink-0" />
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
          <div className="flex flex-col items-center justify-center py-24 text-gray-300 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-sm italic text-gray-400">ยังไม่มีกิจกรรมในขณะนี้</p>
          </div>
        )}

        {/* ─── Grid ─── */}
        {activities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activities.map((activity, idx) => {
              const dateObj = new Date(activity.start_date);
              const day = dateObj.toLocaleDateString("th-TH", { day: "numeric" });
              const month = dateObj.toLocaleDateString("th-TH", { month: "short" });
              const fullDate = dateObj.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              });

              // First card gets a "featured" treatment when there's only 1 item
              const isFeatured = activities.length === 1;

              return (
                <div
                  key={activity.id}
                  onClick={() => navigate({ to: `/activity/${activity.id}` })}
                  className={`group flex flex-col bg-white rounded-3xl overflow-hidden
                    border border-gray-100 cursor-pointer
                    hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1.5
                    transition-all duration-300
                    ${isFeatured ? "sm:col-span-2 lg:col-span-2" : ""}
                  `}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden bg-emerald-50 ${isFeatured ? "h-64" : "h-44"}`}>
                    {activity.img_url ? (
                      <img
                        src={`${API_URL}${activity.img_url}`}
                        alt={activity.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-emerald-50 to-emerald-100">
                        <ImageOff className="w-10 h-10 text-emerald-200" />
                      </div>
                    )}

                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/30 to-transparent" />

                    {/* Date badge */}
                    <div className="absolute top-3 left-3 bg-white rounded-2xl px-2.5 py-1.5 flex flex-col items-center shadow-md min-w-9.5">
                      <span className="text-base font-black text-emerald-700 leading-none">{day}</span>
                      <span className="text-[9px] text-emerald-500 font-semibold mt-0.5 uppercase">{month}</span>
                    </div>

                    {/* Order number watermark */}
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold text-white/60">
                      #{String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className={`font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug ${isFeatured ? "text-base" : "text-sm"}`}>
                      {activity.title}
                    </h3>

                    {activity.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-1">
                        {activity.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {fullDate}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600
                                       opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                        อ่านต่อ <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Filler "placeholder" cards when there's only 1 item — shows users more could appear */}
            {activities.length === 1 && (
              <>
                {[1, 2].map((n) => (
                  <div
                    key={`placeholder-${n}`}
                    className="hidden lg:flex flex-col items-center justify-center bg-gray-50/80 rounded-3xl border border-dashed border-gray-200 min-h-70 gap-3"
                  >
                    <Calendar className="w-8 h-8 text-gray-200" />
                    <p className="text-xs text-gray-300 italic">กำลังจะมาเร็วๆ นี้</p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ─── Mobile button ─── */}
        <div className="mt-8 md:hidden flex justify-center">
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
    </div>
  );
}