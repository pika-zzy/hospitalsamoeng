import { ArrowRight, ArrowUpRight, Megaphone, Briefcase, FileText, Calendar } from "lucide-react";
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    // พื้น section ขาวล้วน — เดิมเป็นเทาไล่เฉด พอวางกล่องเขียวอ่อนทับแล้วสีตีกัน
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* ─── Section Header ─── */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1.5 h-12 rounded-full bg-linear-to-b from-green-400 to-green-600 shrink-0" />
          <div>
            <p className="text-xs tracking-widest text-green-500 uppercase mb-0.5">
              Latest Updates
            </p>
            <h2 className="text-3xl font-black text-gray-900 leading-none">
              ข่าวสาร &amp; <span className="text-green-500">ประกาศ</span>
            </h2>
          </div>
        </div>

        {/* ─── กล่องครอบ ─── */}
        {/* กล่องครอบเป็นพื้นเทาอ่อน แล้วให้การ์ดข่าวข้างในเป็นสีขาว+เงา
            การ์ดจะได้ "ลอยขึ้นมา" จากพื้น ไม่ใช่ยุบจมลงไป (สลับจากรอบก่อน) */}
        {/* เขียวเข้มสุดด้านบนแล้วจางลงหาขาว — ขอบล่างกล่องกลืนกับพื้นหน้า ไม่เป็นแผ่นสีตัดกันทื่อ ๆ
            ขอบกล่องใช้ green-100 ให้เป็นโทนเดียวกับพื้นข้างใน */}
        <div className="rounded-3xl border border-green-100/80 bg-linear-to-b from-green-50 via-green-50/50 to-white p-6 sm:p-8">

        {/* ─── Tabs (pill) ─── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {NEWS_TABS.map(({ key, label, type }) => {
            const { Icon } = TAB_STYLE[key];
            const selected = key === activeKey;
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200
                  ${selected
                    ? "bg-green-600 border-green-600 text-white shadow-sm shadow-green-600/20"
                    : "bg-white border-gray-200 text-gray-500 hover:border-green-200 hover:text-green-700"
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

        {/* ─── Cards ─── */}
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {latest.map((info) => (
              <div
                key={info.id}
                onClick={() => navigate({ to: "/news/$id", params: { id: String(info.id) } })}
                className="group flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm shadow-gray-900/5 cursor-pointer
                           hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/10 hover:border-green-200
                           transition-all duration-300"
              >
                {/* ไอคอนบอกหมวด — สีเขียวชุดเดียวทุกหมวด */}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center
                                group-hover:bg-green-100 transition-colors duration-200">
                  <activeStyle.Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2
                                group-hover:text-green-700 transition-colors duration-200">
                    {info.title}
                  </p>

                  {info.date && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(info.date)}
                    </div>
                  )}
                </div>

                {/* ปุ่ม "ดู" — เป็นแค่ affordance ทั้งการ์ดกดได้อยู่แล้ว จึงไม่ทำเป็น <button> ซ้อน */}
                <div className="shrink-0 self-center inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full
                                border border-green-100 bg-green-50 text-green-700 text-xs font-semibold
                                group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white
                                transition-all duration-200">
                  ดู
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 text-gray-300">
            <activeStyle.Icon className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm italic">{activeStyle.empty}</p>
          </div>
        )}

        {/* ─── ดูทั้งหมด (จุดเดียว) ─── */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate({ to: "/news", search: { tab: activeKey } })}
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white border border-gray-200
                       text-sm font-bold text-gray-700 shadow-sm
                       hover:border-green-600 hover:bg-green-600 hover:text-white hover:shadow-md hover:shadow-green-600/20
                       transition-all duration-200"
          >
            ดู{activeTab.label}ทั้งหมด
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>

        </div>
        {/* ─── จบกล่องครอบ ─── */}

      </div>
    </section>
  );
}
