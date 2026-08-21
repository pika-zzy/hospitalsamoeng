import { ArrowRight, Megaphone, Briefcase, FileText, ImageOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { requestAPI } from "@/lib/api";
import { NEWS_TABS, type NewsInfo, type NewsTabKey } from "@/interface/newinfo";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SectionHeading, MoreLink } from "@/components/page/section-heading";

const API_URL = import.meta.env.VITE_API_URL;

// ไอคอน/ข้อความว่างต่อหมวด — เฉพาะของหน้าแรก (layout คนละแบบกับหน้า /news)
// ส่วน key/type/label มาจาก NEWS_TABS ที่เดียว. Record<NewsTabKey, …> บังคับว่าเพิ่ม
// ประเภทข่าวใหม่ต้องมาใส่ที่นี่ ไม่งั้น TypeScript error (ไม่พังเงียบ)
const TAB_STYLE: Record<NewsTabKey, { Icon: LucideIcon; empty: string }> = {
  general: {
    Icon: Megaphone,
    empty: "ไม่มีประกาศในขณะนี้",
  },
  job: {
    Icon: Briefcase,
    empty: "ไม่มีตำแหน่งงานว่างในขณะนี้",
  },
  procurement: {
    Icon: FileText,
    empty: "ไม่มีประกาศจัดซื้อพัสดุในขณะนี้",
  },
};

// วันที่แบบไทย ใช้ซ้ำทั้งการ์ดใหญ่และแถวเล็ก
function thaiDate(value: string) {
  const d = new Date(value);
  return {
    day: d.toLocaleDateString("th-TH", { day: "numeric" }),
    month: d.toLocaleDateString("th-TH", { month: "short" }),
    full: d.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }),
  };
}

export default function News_page() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<NewsTabKey>("general");

  const { data } = useQuery<NewsInfo[]>({
    queryKey: ["news"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    queryFn: async () => {
      const resp = await requestAPI<NewsInfo[]>({
        method: "GET",
        url: "/news",
      });
      if (resp.success) {
        return resp.data;
      }
      throw new Error("Failed to fetch news");
    },
  });

  const activeTab = NEWS_TABS.find((t) => t.key === activeKey) ?? NEWS_TABS[0];
  const activeStyle = TAB_STYLE[activeKey];

  const countByType = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of data ?? []) map[n.type] = (map[n.type] ?? 0) + 1;
    return map;
  }, [data]);

  // โชว์เฉพาะ 4 ข่าวล่าสุดของหมวดที่เลือก (หน้าแรกเป็นตัวอย่าง ไม่ใช่ list เต็ม)
  const latest = useMemo(
    () =>
      [...(data?.filter((n) => n.type === activeTab.type) ?? [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [data, activeTab.type],
  );

  // REDESIGN (โทน sage): เดิมเป็นแถวยาว 4 แถวหน้าตาเหมือนกันหมด และ "ไม่ได้ใช้รูปข่าว"
  // ทั้งที่ NewsInfo มี img_url อยู่แล้ว — ตอนนี้ข่าวล่าสุดเป็นการ์ดใหญ่มีรูป
  // ที่เหลือเป็นแถวเล็กข้าง ๆ. logic query/tabs/navigate เดิมทั้งหมด
  const featured = latest[0];
  const rest = latest.slice(1);

  return (
    <section id="news" className="scroll-mt-24 px-4 pb-20 sm:px-6 lg:scroll-mt-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="News & Announcements"
          title="ข่าวสารและประกาศ"
          description="ประชาสัมพันธ์ รับสมัครงาน และประกาศจัดซื้อจัดจ้างของโรงพยาบาล"
          action={
            <MoreLink onClick={() => navigate({ to: "/news", search: { tab: activeKey } })}>
              ดูข่าวทั้งหมด
            </MoreLink>
          }
        />

        {/* ─── แท็บหมวดข่าว ─── */}
        <div className="mb-7 flex flex-wrap gap-2">
          {NEWS_TABS.map(({ key, label, type }) => {
            const { Icon } = TAB_STYLE[key];
            const selected = key === activeKey;
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 ${
                  selected
                    ? "border-[#3b5546] bg-[#3b5546] text-white"
                    : "border-stone-200 bg-white text-stone-500 hover:border-[#c9dacd] hover:text-[#3b5546]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none font-bold ${
                    selected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {countByType[type] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {featured ? (
          <div className={`grid gap-5 ${rest.length > 0 ? "lg:grid-cols-[1.35fr_1fr]" : ""}`}>
            {/* ─── ข่าวล่าสุด (การ์ดใหญ่พร้อมรูป) ─── */}
            <article
              onClick={() => navigate({ to: "/news/$id", params: { id: String(featured.id) } })}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-[#24352b]/8"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-[#f3f7f3]">
                {featured.img_url ? (
                  <img
                    src={`${API_URL}${featured.img_url}`}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageOff className="h-10 w-10 text-[#c9dacd]" aria-hidden="true" />
                  </div>
                )}
                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[12px] font-semibold text-[#3b5546] backdrop-blur-sm">
                  ล่าสุด
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-[12.5px] font-medium text-stone-400">
                  {thaiDate(featured.date).full}
                </p>
                <h3 className="mt-2.5 text-xl leading-snug font-bold text-[#24352b] transition-colors duration-200 group-hover:text-[#4a6b57] sm:text-[22px]">
                  {featured.title}
                </h3>
                {featured.description && (
                  <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-stone-500">
                    {featured.description}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#4a6b57]">
                  อ่านรายละเอียด
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>

            {/* ─── ข่าวถัดมา (แถวเล็ก) ─── */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-3">
                {rest.map((info) => {
                  const { day, month } = thaiDate(info.date);
                  return (
                    <article
                      key={info.id}
                      onClick={() =>
                        navigate({ to: "/news/$id", params: { id: String(info.id) } })
                      }
                      className="group flex flex-1 cursor-pointer items-center gap-4 rounded-2xl border border-stone-200/80 bg-white p-4 transition-colors duration-200 hover:border-[#c9dacd] hover:bg-[#fdfcf9]"
                    >
                      <div className="w-14 shrink-0 rounded-xl bg-[#f3f7f3] py-2.5 text-center transition-colors duration-200 group-hover:bg-[#e4ece5]">
                        <p className="text-lg leading-none font-bold text-[#3b5546]">{day}</p>
                        <p className="mt-1 text-[11px] font-semibold text-[#8aa893]">{month}</p>
                      </div>

                      <p className="line-clamp-2 min-w-0 flex-1 text-[15px] leading-snug font-semibold text-stone-700 transition-colors duration-200 group-hover:text-[#24352b]">
                        {info.title}
                      </p>

                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-stone-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#4a6b57]"
                        aria-hidden="true"
                      />
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white/60 py-20 text-stone-400">
            <activeStyle.Icon className="mb-3 h-10 w-10 opacity-40" />
            <p className="text-[15px]">{activeStyle.empty}</p>
          </div>
        )}

        {/* ปุ่มดูทั้งหมดสำหรับจอเล็ก (หัว section ซ่อนปุ่มไว้บนจอเล็ก) */}
        <div className="mt-7 flex justify-center sm:hidden">
          <MoreLink onClick={() => navigate({ to: "/news", search: { tab: activeKey } })}>
            ดูข่าวทั้งหมด
          </MoreLink>
        </div>
      </div>
    </section>
  );
}
