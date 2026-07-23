import { ArrowRight, Megaphone, Briefcase, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { requestAPI } from "@/lib/api";
import { NEWS_TABS, type NewsInfo, type NewsTabKey } from "@/interface/newinfo";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

// ไอคอน/ข้อความว่างต่อหมวด — เฉพาะของหน้าแรก (layout คนละแบบกับหน้า /news)
// ส่วน key/type/label มาจาก NEWS_TABS ที่เดียว. Record<NewsTabKey, …> บังคับว่าเพิ่ม
// ประเภทข่าวใหม่ต้องมาใส่ที่นี่ ไม่งั้น TypeScript error (ไม่พังเงียบ)
// NOTE: เดิมแยกสีต่อหมวด (teal/green/slate) — ตอนนี้การ์ดใช้โทนเขียวชุดเดียวทั้งหมด
// แยกหมวดด้วย "ไอคอน" อย่างเดียว สีจึงถูกถอดออกจาก TAB_STYLE
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
  // 4 ใบ = เต็มกริด 2 คอลัมน์พอดี ไม่เหลือการ์ดโดดใบเดียวบนแถวสุดท้าย
  const latest = useMemo(
    () =>
      [...(data?.filter((n) => n.type === activeTab.type) ?? [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [data, activeTab.type],
  );

  return (
    // REFACTOR: layout ใหม่ตาม mockup "แบบ G" (2026-07-15) — section โปร่งใสวางบนพื้น mint
    // ของหน้าแรก การ์ดข่าวเป็นแถวแนวตั้งมีปฏิทินวันที่ซ้าย, ปุ่ม "ดูทั้งหมด" ย้ายขึ้นหัว section
    // logic query/tabs/navigate เดิมทั้งหมด
    <section className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ─── Section Header ─── */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs tracking-widest text-green-500 uppercase font-semibold mb-0.5">
              Latest Updates
            </p>
            <h2 className="text-3xl font-black text-gray-900 leading-none">
              ข่าวสาร &amp; <span className="text-green-500">ประกาศ</span>
            </h2>
          </div>
          <button
            onClick={() => navigate({ to: "/news", search: { tab: activeKey } })}
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-green-100
                       text-xs font-bold text-green-700 shadow-sm
                       hover:bg-green-600 hover:border-green-600 hover:text-white
                       transition-all duration-200"
          >
            ดูทั้งหมด
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>

        <div>

        {/* ─── Tabs (pill) ─── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {NEWS_TABS.map(({ key, label, type }) => {
            const { Icon } = TAB_STYLE[key];
            const selected = key === activeKey;
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200
                  ${selected
                    ? "bg-green-600 border-green-600 text-white shadow-sm shadow-green-600/20"
                    : "bg-white border-green-100/70 text-gray-500 hover:border-green-300 hover:text-green-700"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none transition-colors duration-200
                    ${selected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {countByType[type] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── Cards: แถวแนวตั้ง ปฏิทินวันที่ซ้าย (แบบ G) ─── */}
        {latest.length > 0 ? (
          <div className="flex flex-col gap-3">
            {latest.map((info) => {
              const dateObj = new Date(info.date);
              const day = dateObj.toLocaleDateString("th-TH", { day: "numeric" });
              const month = dateObj.toLocaleDateString("th-TH", { month: "short" });
              return (
                <div
                  key={info.id}
                  onClick={() => navigate({ to: "/news/$id", params: { id: String(info.id) } })}
                  className="group flex items-center gap-4 bg-white border border-green-100/60 rounded-2xl p-4 pr-5
                             shadow-sm shadow-green-900/5 cursor-pointer
                             hover:-translate-y-0.5 hover:shadow-md hover:shadow-green-900/10 hover:border-green-200
                             transition-all duration-200"
                >
                  {/* ปฏิทินวันที่ — แทนไอคอนหมวดแบบเดิม (หมวดดูได้จากแท็บที่เลือกอยู่แล้ว) */}
                  <div className="shrink-0 w-14 text-center bg-green-50 rounded-xl py-2
                                  group-hover:bg-green-100 transition-colors duration-200">
                    <p className="text-lg font-black text-green-700 leading-none">{day}</p>
                    <p className="text-[10px] font-semibold text-green-500 mt-0.5">{month}</p>
                  </div>

                  <p className="flex-1 min-w-0 text-[15px] font-bold text-gray-800 leading-snug line-clamp-2
                                group-hover:text-green-700 transition-colors duration-200">
                    {info.title}
                  </p>

                  <ArrowRight className="shrink-0 w-4 h-4 text-green-400 group-hover:text-green-600
                                         group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-green-100 bg-white/60 text-gray-300">
            <activeStyle.Icon className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm italic">{activeStyle.empty}</p>
          </div>
        )}

        </div>

      </div>
    </section>
  );
}
