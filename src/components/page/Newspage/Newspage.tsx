import { ArrowRight, Megaphone, Briefcase, FileText, Paperclip, Image as ImageIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { requestAPI } from "@/lib/api";
import { NEWS_TABS, type NewsInfo, type NewsTabKey } from "@/interface/newinfo";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SectionHeading, MoreLink } from "@/components/page/section-heading";

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
    // th-TH คืน "พ.ศ. 2569" — กล่องวันที่มีที่แค่ตัวเลข ตัดคำนำหน้าออก
    year: d.toLocaleDateString("th-TH", { year: "numeric" }).replace("พ.ศ. ", ""),
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
  // FIX: field date เป็นวันที่ล้วน ไม่มีเวลา — ข่าวที่เพิ่มวันเดียวกันจะ "เท่ากัน" ในสายตา
  // sort ทำให้ข่าวที่เพิ่งเพิ่มไม่ขึ้นเป็นล่าสุดจริง ๆ (sort เสถียร คงลำดับเดิมตาม id จากฝั่ง
  // backend ไว้) เลยเติม id มากกว่า = เพิ่มทีหลัง เป็นตัวตัดสินรองตอนวันที่เท่ากัน
  const latest = useMemo(
    () =>
      [...(data?.filter((n) => n.type === activeTab.type) ?? [])]
        .sort((a, b) => {
          const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();
          return byDate !== 0 ? byDate : b.id - a.id;
        })
        .slice(0, 4),
    [data, activeTab.type],
  );

  // REDESIGN 2026-08-26: กลับมาเป็น "แถวรายการ" ทุกข่าวหน้าตาเดียวกัน
  // เหตุผล: ข่าวของโรงพยาบาลเป็นประกาศราชการ — ทั้ง 47 ข่าวในระบบไม่มีรูปปกและไม่มีคำโปรย
  // แต่หัวข้อยาว 80-202 ตัวอักษร โครงการ์ดใหญ่+แถวเล็กเดิมจึงเหลือแต่กล่องว่างกับหัวข้อที่โดนตัด
  // แถวรายการให้พื้นที่หัวข้อเต็ม และบอกได้ตั้งแต่ยังไม่คลิกว่ามีเอกสารแนบไหม
  // logic query/tabs/navigate เดิมทั้งหมด

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

        {latest.length > 0 ? (
          <div className="flex flex-col gap-3">
            {latest.map((info) => {
              const { day, month, year } = thaiDate(info.date);
              return (
                <article
                  key={info.id}
                  onClick={() => navigate({ to: "/news/$id", params: { id: String(info.id) } })}
                  className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-stone-200/80 bg-white p-4 transition-colors duration-200 hover:border-[#c9dacd] hover:bg-[#fdfcf9] sm:gap-5 sm:p-5"
                >
                  {/* กล่องวันที่แทนรูป — ข่าวประกาศไม่มีรูปปก แต่ "วันที่" คือสิ่งที่คนมองหาก่อน */}
                  <div className="w-16 shrink-0 rounded-xl border border-[#c9dacd] bg-[#f3f7f3] py-2.5 text-center transition-colors duration-200 group-hover:bg-[#e4ece5]">
                    <p className="text-[22px] leading-none font-bold text-[#24352b]">{day}</p>
                    <p className="mt-1 text-[11.5px] leading-none font-semibold text-[#4a6b57]">{month}</p>
                    <p className="mt-1 text-[10.5px] leading-none text-stone-400">{year}</p>
                  </div>

                  {/* ไม่โชว์ภาพย่อ — รูปข่าวของจริงเป็นสแกนประกาศ A4 แนวตั้ง ย่อลงกล่องนอนแล้ว
                      เหลือแต่แถบหัวกระดาษ อ่านไม่ออก (เหตุผลเดียวกับหน้า /news)
                      บอกด้วยป้าย "รูปภาพ" แทน ของจริงไปดูเต็ม ๆ ที่หน้ารายละเอียด */}

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="text-[15.5px] leading-relaxed font-semibold text-[#24352b] transition-colors duration-200 group-hover:text-[#4a6b57]">
                      {info.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9dacd] bg-[#f3f7f3] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#3b5546]">
                        <activeStyle.Icon className="h-3 w-3" aria-hidden="true" />
                        {activeTab.label}
                      </span>
                      {/* ข่าวที่มีแต่รูป (ประกาศสแกน) ต้องบอกให้รู้ว่ามีของให้ดู ไม่งั้นดูเหมือนข่าวเปล่า */}
                      {info.file_url ? (
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] text-stone-500">
                          <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                          เอกสารแนบ
                        </span>
                      ) : info.img_url ? (
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] text-stone-500">
                          <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          รูปภาพ
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <span className="hidden shrink-0 items-center gap-1.5 self-center text-[13.5px] font-semibold text-[#4a6b57] lg:inline-flex">
                    อ่านรายละเอียด
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </article>
              );
            })}
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
