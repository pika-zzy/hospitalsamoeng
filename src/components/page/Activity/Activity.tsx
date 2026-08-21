import type ActivityInfo from "@/interface/activity_info";
import { requestAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ArrowRight, ImageOff } from "lucide-react";
import { SectionHeading, MoreLink } from "@/components/page/section-heading";

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

  // REDESIGN (โทน sage): การ์ดทุกใบขนาดเท่ากัน สัดส่วนรูปคงที่ 4:3
  // ถอด watermark "#01" มุมรูป และการ์ดหลอก "กำลังจะมาเร็วๆ นี้" ที่ทำให้ดูเหมือนเว็บยังไม่เสร็จ
  // logic query/sort/slice/navigate เดิมทั้งหมด
  return (
    <section id="activity" className="scroll-mt-24 px-4 pb-20 sm:px-6 lg:scroll-mt-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Activities & Events"
          title="กิจกรรมล่าสุด"
          description="ภาพบรรยากาศงานและกิจกรรมเพื่อสุขภาพของชุมชนสะเมิง"
          action={<MoreLink onClick={() => navigate({ to: "/activity" })}>ดูกิจกรรมทั้งหมด</MoreLink>}
        />

        {/* ─── ยังไม่มีข้อมูล ─── */}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-stone-300 bg-white/60 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f7f3]">
              <Calendar className="h-8 w-8 text-[#c9dacd]" />
            </div>
            <p className="text-[15px] text-stone-400">ยังไม่มีกิจกรรมในขณะนี้</p>
          </div>
        )}

        {/* ─── ตารางการ์ด ─── */}
        {activities.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => {
              const dateObj = new Date(activity.start_date);
              const day = dateObj.toLocaleDateString("th-TH", { day: "numeric" });
              const month = dateObj.toLocaleDateString("th-TH", { month: "short" });
              const fullDate = dateObj.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              });

              return (
                <article
                  key={activity.id}
                  onClick={() => navigate({ to: `/activity/${activity.id}` })}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#24352b]/8"
                >
                  {/* รูป */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#f3f7f3]">
                    {activity.img_url ? (
                      <img
                        src={`${API_URL}${activity.img_url}`}
                        alt={activity.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-9 w-9 text-[#c9dacd]" aria-hidden="true" />
                      </div>
                    )}

                    {/* ป้ายวันที่ */}
                    <div className="absolute top-3.5 left-3.5 flex min-w-12 flex-col items-center rounded-xl bg-white/95 px-2.5 py-1.5 backdrop-blur-sm">
                      <span className="text-[17px] leading-none font-bold text-[#3b5546]">
                        {day}
                      </span>
                      <span className="mt-0.5 text-[10.5px] font-semibold text-[#8aa893]">
                        {month}
                      </span>
                    </div>
                  </div>

                  {/* เนื้อหา */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-[15.5px] leading-snug font-bold text-[#24352b] transition-colors duration-200 group-hover:text-[#4a6b57]">
                      {activity.title}
                    </h3>

                    {activity.description && (
                      <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-stone-500">
                        {activity.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-stone-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {fullDate}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-stone-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#4a6b57]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ปุ่มดูทั้งหมดสำหรับจอเล็ก (หัว section ซ่อนปุ่มไว้บนจอเล็ก) */}
        <div className="mt-7 flex justify-center sm:hidden">
          <MoreLink onClick={() => navigate({ to: "/activity" })}>ดูกิจกรรมทั้งหมด</MoreLink>
        </div>
      </div>
    </section>
  );
}
