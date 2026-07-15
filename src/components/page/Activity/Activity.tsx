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
    // REFACTOR: ตาม mockup "แบบ G" (2026-07-15) — section โปร่งใสบนพื้น mint ของหน้าแรก
    // หัว section เปลี่ยนเป็น kicker แบบเดียวกับ Newspage (ถอดแท่งเขียวซ้ายออก)
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ─── Header ─── */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs tracking-widest text-green-500 uppercase font-semibold mb-0.5">
              Activities &amp; Events
            </p>
            <h2 className="text-3xl font-black text-gray-900 leading-none">
              กิจกรรม<span className="text-green-500">ล่าสุด</span>
            </h2>
          </div>
          <button
            onClick={() => navigate({ to: "/activity" })}
            className="group hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-green-100
                       text-xs font-bold text-green-700 shadow-sm
                       hover:bg-green-600 hover:border-green-600 hover:text-white
                       transition-all duration-200"
          >
            ดูทั้งหมด
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>

        {/* ─── Empty state ─── */}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-sm italic text-gray-500">ยังไม่มีกิจกรรมในขณะนี้</p>
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
                  className={`group flex flex-col bg-white rounded-2xl overflow-hidden
                    border border-green-100/60 cursor-pointer
                    hover:shadow-lg hover:-translate-y-1
                    transition-all duration-300
                    ${isFeatured ? "sm:col-span-2 lg:col-span-2" : ""}
                  `}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden bg-green-50 ${isFeatured ? "h-64" : "h-44"}`}>
                    {activity.img_url ? (
                      <img
                        src={`${API_URL}${activity.img_url}`}
                        alt={activity.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-green-50 to-green-100">
                        <ImageOff className="w-10 h-10 text-green-200" />
                      </div>
                    )}

                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/30 to-transparent" />

                    {/* Date badge */}
                    <div className="absolute top-3 left-3 bg-white rounded-2xl px-2.5 py-1.5 flex flex-col items-center shadow-md min-w-9.5">
                      <span className="text-base font-black text-green-700 leading-none">{day}</span>
                      <span className="text-[9px] text-green-500 font-semibold mt-0.5 uppercase">{month}</span>
                    </div>

                    {/* Order number watermark */}
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold text-white/60">
                      #{String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className={`font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors leading-snug ${isFeatured ? "text-base" : "text-sm"}`}>
                      {activity.title}
                    </h3>

                    {activity.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
                        {activity.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {fullDate}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600
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
                    className="hidden lg:flex flex-col items-center justify-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-200 min-h-70 gap-3"
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
            className="w-full py-3.5 bg-green-50 text-green-700 font-semibold rounded-2xl
                       text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
          >
            ดูกิจกรรมทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}