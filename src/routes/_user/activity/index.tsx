import type ActivityInfo from '@/interface/activity_info';
import { requestAPI } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Calendar, ImageOff } from 'lucide-react';
import { useMemo } from 'react';
import { PageHero } from '@/components/page/page-hero';

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

    // FIX: หน้านี้เดิม "ไม่ได้ sort เลย" — วาดตามลำดับที่ backend ส่งมา (id น้อย→มาก = เก่าขึ้นก่อน)
    // เรียงใหม่→เก่าด้วย start_date + ตัดสินรองด้วย id (มากกว่า = เพิ่มทีหลัง)
    // เพราะ start_date เป็นวันที่ล้วนไม่มีเวลา กิจกรรมวันเดียวกันจึง "เท่ากัน" ในสายตา sort
    // (ID ใน interface เป็น string ต้องแปลงเป็นเลขก่อนลบกัน ไม่งั้นได้ NaN)
    const activities = useMemo(
        () =>
            [...(data ?? [])].sort((a, b) => {
                const byDate = new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
                return byDate !== 0 ? byDate : Number(b.id) - Number(a.id)
            }),
        [data],
    );

    // REDESIGN (โทน sage): หัวหน้าใช้ PageHero ชุดเดียวกับหน้าในอื่น ๆ
    // การ์ดยังเป็นแผ่นภาพแนวตั้งเหมือนเดิม แต่เพิ่มวันที่ + fallback ตอนไม่มีรูป
    // logic query / skeleton / empty / navigate เดิมทั้งหมด
    return (
        <div className="pb-20">
            <PageHero
                eyebrow="Activities & Events"
                title="คลังกิจกรรมทั้งหมด"
                description="รวบรวมภาพบรรยากาศ ความประทับใจ และการดำเนินงานด้านต่าง ๆ เพื่อส่งเสริมสุขภาพและความสุขของพี่น้องชาวสะเมิง"
            />

            <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
                {/* กำลังโหลด */}
                {data === undefined && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-4/5 animate-pulse rounded-3xl border border-stone-200/80 bg-white"
                            />
                        ))}
                    </div>
                )}

                {/* ยังไม่มีข้อมูล */}
                {data !== undefined && data.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-stone-300 bg-white/60 py-24 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f7f3]">
                            <Calendar className="h-8 w-8 text-[#c9dacd]" />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-stone-500">ยังไม่มีกิจกรรมในขณะนี้</p>
                            <p className="mt-1 text-[13px] text-stone-400">โปรดติดตามกิจกรรมใหม่ ๆ ได้เร็ว ๆ นี้</p>
                        </div>
                    </div>
                )}

                {/* รายการกิจกรรม */}
                {data !== undefined && data.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {activities.map((activity) => (
                            <article
                                key={activity.id}
                                onClick={() => navigate({ to: `/activity/${activity.id}` })}
                                className="group relative aspect-4/5 cursor-pointer overflow-hidden rounded-3xl border border-stone-200/80 bg-[#f3f7f3] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#24352b]/10"
                            >
                                {activity.img_url ? (
                                    <img
                                        src={`${API_URL}${activity.img_url}`}
                                        alt={activity.title}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageOff className="h-10 w-10 text-[#c9dacd]" aria-hidden="true" />
                                    </div>
                                )}

                                {/* ไล่เงาดำจากล่างขึ้น ให้ตัวหนังสือขาวอ่านออกทุกรูป */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#16211a]/90 via-[#16211a]/25 to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-5">
                                    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[#c9dacd]">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(activity.start_date).toLocaleDateString("th-TH", {
                                            day: 'numeric', month: 'short', year: '2-digit'
                                        })}
                                    </span>

                                    <h2 className="mt-1.5 line-clamp-2 text-[15.5px] leading-snug font-semibold text-white drop-shadow-sm">
                                        {activity.title}
                                    </h2>

                                    {/* รายละเอียดโผล่ตอน hover */}
                                    <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                                        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-[#a7bfad]">
                                            {activity.description}
                                        </p>
                                        <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#dcc3ab]">
                                            อ่านรายละเอียด
                                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
