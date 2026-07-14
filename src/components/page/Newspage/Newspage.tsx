import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone, Briefcase, FileText, Clock, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { requestAPI } from "@/lib/api";
import { NEWS_TABS, type NewsInfo, type NewsTabKey } from "@/interface/newinfo";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

// สี/ไอคอน/ข้อความต่อหมวด — เฉพาะของหน้าแรก (layout คนละแบบกับหน้า /news)
// ส่วน key/type/label มาจาก NEWS_TABS ที่เดียว. Record<NewsTabKey, …> บังคับว่าเพิ่ม
// ประเภทข่าวใหม่ต้องมาใส่สไตล์ที่นี่ ไม่งั้น TypeScript error (ไม่พังเงียบ)
// ใช้ class เต็มสตริงเสมอ — ห้าม interpolate ชื่อสี ไม่งั้น Tailwind purge ทิ้ง
const TAB_STYLE: Record<
  NewsTabKey,
  {
    Icon: LucideIcon;
    subtitle: string;
    header: string;
    headerSub: string;
    rowHover: string;
    titleHover: string;
    index: string;
    chevron: string;
    footer: string;
    empty: string;
  }
> = {
  general: {
    Icon: Megaphone,
    subtitle: "General Announcement",
    header: "bg-linear-to-r from-teal-600 to-teal-500",
    headerSub: "text-teal-100",
    rowHover: "hover:bg-teal-50/40",
    titleHover: "group-hover:text-teal-700",
    index: "text-teal-100 group-hover:text-teal-200",
    chevron: "group-hover:text-teal-400",
    footer: "text-teal-600 hover:text-teal-800",
    empty: "ไม่มีประกาศในขณะนี้",
  },
  job: {
    Icon: Briefcase,
    subtitle: "Career Opportunities",
    header: "bg-linear-to-r from-green-600 to-green-500",
    headerSub: "text-green-100",
    rowHover: "hover:bg-green-50/40",
    titleHover: "group-hover:text-green-700",
    index: "text-green-100 group-hover:text-green-200",
    chevron: "group-hover:text-green-400",
    footer: "text-green-600 hover:text-green-800",
    empty: "ไม่มีตำแหน่งงานว่างในขณะนี้",
  },
  procurement: {
    Icon: FileText,
    subtitle: "Procurement Notice",
    header: "bg-linear-to-r from-slate-600 to-slate-500",
    headerSub: "text-slate-200",
    rowHover: "hover:bg-slate-50/60",
    titleHover: "group-hover:text-slate-700",
    index: "text-slate-200 group-hover:text-slate-300",
    chevron: "group-hover:text-slate-400",
    footer: "text-slate-600 hover:text-slate-800",
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

  // โชว์เฉพาะ 3 ข่าวล่าสุดของหมวดที่เลือก (หน้าแรกเป็นตัวอย่าง ไม่ใช่ list เต็ม)
  const latest = useMemo(
    () =>
      [...(data?.filter((n) => n.type === activeTab.type) ?? [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3),
    [data, activeTab.type],
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="py-16 px-4 bg-linear-to-b from-gray-50 to-white ">
      <div className="max-w-7xl mx-auto">

        {/* ─── Section Header ─── */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 rounded-full bg-linear-to-b from-green-400 to-green-600" />
            <div>
              <p className="text-xs  tracking-widest text-green-500 uppercase mb-0.5">
                Latest Updates
              </p>
              <h2 className="text-3xl font-black text-gray-900 leading-none">
                ข่าวสาร &amp;{" "}
                <span className="text-green-500">ประกาศ</span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/news", search: { tab: activeKey } })}
            className="hidden md:inline-flex items-center gap-2 text-xl  text-gray-800 hover:text-green-600 transition-colors group"
          >
            ดูทั้งหมด
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex mb-6">
          <div className="inline-flex flex-wrap p-1 bg-gray-100 rounded-2xl gap-1">
            {NEWS_TABS.map(({ key, label, type }) => {
              const { Icon } = TAB_STYLE[key];
              const selected = key === activeKey;
              return (
                <button
                  key={key}
                  onClick={() => setActiveKey(key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                    ${selected
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-600"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                    ${selected ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                    {countByType[type] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Active category card ─── */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          {/* Card header strip */}
          <div className={`flex items-center gap-3 px-6 py-5 ${activeStyle.header}`}>
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm">
              <activeStyle.Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-none">
                {activeTab.label}
              </h3>
              <p className={`text-xs mt-0.5 ${activeStyle.headerSub}`}>{activeStyle.subtitle}</p>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 divide-y divide-gray-50">
            {latest.length > 0 ? (
              latest.map((info, idx) => (
                <div
                  key={info.id}
                  onClick={() => navigate({ to: "/news/$id", params: { id: String(info.id) } })}
                  className={`group flex gap-4 px-6 py-4 transition-colors duration-200 cursor-pointer ${activeStyle.rowHover}`}
                >
                  {/* Index number */}
                  <span className={`shrink-0 mt-0.5 text-2xl font-black transition-colors w-7 leading-none select-none ${activeStyle.index}`}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold text-gray-800 transition-colors line-clamp-2 leading-snug ${activeStyle.titleHover}`}>
                      {info.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {info.description}
                    </p>
                    {info.date && (
                      <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(info.date)}
                      </div>
                    )}
                  </div>
                  <ChevronRight className={`shrink-0 w-4 h-4 text-gray-300 group-hover:translate-x-0.5 transition-all mt-0.5 ${activeStyle.chevron}`} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <activeStyle.Icon className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm italic">{activeStyle.empty}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50">
            <button
              onClick={() => navigate({ to: "/news", search: { tab: activeKey } })}
              className={`text-xs font-semibold transition-colors ${activeStyle.footer}`}
            >
              ดู{activeTab.label}ทั้งหมด →
            </button>
          </div>
        </div>

        {/* ─── Mobile "ดูทั้งหมด" ─── */}
        <div className="mt-6 flex justify-center md:hidden">
          <Button
            onClick={() => navigate({ to: "/news", search: { tab: activeKey } })}
            className="flex items-center gap-2 text-green-600 font-bold"
          >
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </section>
  );
}
