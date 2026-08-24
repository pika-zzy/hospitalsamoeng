import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react';
import { Megaphone, Briefcase, Calendar, ArrowRight, FileText, ImageOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { requestAPI } from '@/lib/api';
import { NEWS_TABS, type NewsInfo, type NewsTabKey } from '@/interface/newinfo';
import { PageHero } from '@/components/page/page-hero';

const API_URL = import.meta.env.VITE_API_URL;

// ไอคอนต่อหมวด — เป็นเรื่องเฉพาะหน้านี้ ส่วนตัว key/type/label มาจาก NEWS_TABS ที่เดียว
// Record<NewsTabKey, …> บังคับว่าเพิ่มประเภทข่าวใหม่ต้องมาใส่ไอคอนที่นี่ ไม่งั้น TypeScript error
// NOTE: เดิมแต่ละหมวดมีแถบสีของตัวเอง (teal/green/slate) — โทน sage ใช้สีชุดเดียวทั้งหน้า
// แยกหมวดด้วยไอคอนกับแท็บที่เลือกอยู่แทน
const TAB_STYLE: Record<NewsTabKey, { Icon: LucideIcon }> = {
  general: { Icon: Megaphone },
  job: { Icon: Briefcase },
  procurement: { Icon: FileText },
}

export const Route = createFileRoute('/_user/news/')({
  // รับ ?tab= จาก URL เพื่อ deep-link เข้าหมวดที่ต้องการ (เมนู navbar ชี้ตรงมาแท็บ)
  // ค่าที่ไม่รู้จักถูกโยนทิ้ง → ตกกลับไปแท็บ default ไม่พัง
  validateSearch: (search: Record<string, unknown>): { tab?: NewsTabKey } => {
    const tab = NEWS_TABS.find((t) => t.key === search.tab)?.key
    return tab ? { tab } : {}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery<NewsInfo[]>({
    queryKey: ["news"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    queryFn: async () => {
      const resp = await requestAPI<NewsInfo[]>({
        method: "GET",
        url: "/news",
      });
      if (resp.success) return resp.data;
      throw new Error("Failed to fetch news");
    },
  });

  const navigate = useNavigate();
  const { tab } = Route.useSearch();
  const activeKey: NewsTabKey = tab ?? 'general';
  const activeTab = NEWS_TABS.find((t) => t.key === activeKey) ?? NEWS_TABS[0];
  const activeStyle = TAB_STYLE[activeKey];

  // นับจำนวนต่อหมวด (โชว์ badge) + list ของหมวดที่เลือก เรียงใหม่→เก่า
  const countByType = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of data ?? []) map[n.type] = (map[n.type] ?? 0) + 1;
    return map;
  }, [data]);

  // FIX: date เป็นวันที่ล้วนไม่มีเวลา ข่าววันเดียวกันเลย "เท่ากัน" ในสายตา sort — เติม id
  // มากกว่า = เพิ่มทีหลัง เป็นตัวตัดสินรอง (บั๊กเดียวกับ Newspage.tsx บนหน้าแรก)
  const activeList = useMemo(() => {
    return [...(data?.filter((n) => n.type === activeTab.type) ?? [])].sort((a, b) => {
      const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();
      return byDate !== 0 ? byDate : b.id - a.id;
    });
  }, [data, activeTab.type]);

  return (
    <div className="pb-20">
      {/* ─── หัวหน้า + แท็บหมวด ─── */}
      <PageHero
        eyebrow="News & Announcements"
        title="ศูนย์ข้อมูลข่าวสาร"
        description="ติดตามข่าวประชาสัมพันธ์ ประกาศรับสมัครงาน และจัดซื้อพัสดุต่าง ๆ ของโรงพยาบาลสะเมิง"
      >
        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {NEWS_TABS.map(({ key, label, type }) => {
            const { Icon } = TAB_STYLE[key]
            const selected = key === activeKey
            return (
              <button
                key={key}
                onClick={() => navigate({ to: '/news', search: { tab: key } })}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 ${
                  selected
                    ? 'border-white bg-white text-[#2f4438]'
                    : 'border-white/20 bg-white/5 text-[#c9dacd] hover:border-white/40 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none font-bold ${
                    selected ? 'bg-[#e4ece5] text-[#3b5546]' : 'bg-white/15 text-white'
                  }`}
                >
                  {countByType[type] ?? 0}
                </span>
              </button>
            )
          })}
        </div>
      </PageHero>

      {/* ─── รายการข่าว ─── */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        {activeList.length > 0 && (
          <p className="mb-6 text-[13px] font-semibold tracking-wider text-stone-400 uppercase">
            {activeTab.label} · {activeList.length} รายการ
          </p>
        )}

        {activeList.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeList.map((info) => (
              <article
                key={info.id}
                onClick={() => navigate({ to: "/news/$id", params: { id: String(info.id) } })}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#24352b]/8"
              >
                {/* รูปข่าว — NewsInfo มี img_url อยู่แล้ว หน้านี้เดิมไม่ได้เอามาแสดง */}
                <div className="relative aspect-16/10 overflow-hidden bg-[#f3f7f3]">
                  {info.img_url ? (
                    <img
                      src={`${API_URL}${info.img_url}`}
                      alt={info.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageOff className="h-9 w-9 text-[#c9dacd]" aria-hidden="true" />
                    </div>
                  )}
                  <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-semibold text-[#3b5546] backdrop-blur-sm">
                    <activeStyle.Icon className="h-3.5 w-3.5" />
                    {activeTab.label}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-stone-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(info.date).toLocaleDateString("th-TH", {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>

                  <h2 className="mt-2.5 line-clamp-2 text-[15.5px] leading-snug font-bold text-[#24352b] transition-colors duration-200 group-hover:text-[#4a6b57]">
                    {info.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-stone-500">
                    {info.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3.5">
                    <span className="text-[13px] font-semibold text-[#4a6b57]">อ่านรายละเอียด</span>
                    <ArrowRight
                      className="h-4 w-4 text-stone-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#4a6b57]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ยังไม่มีข้อมูลในหมวดนี้ */
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-stone-300 bg-white/60 py-24">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f7f3]">
              <FileText className="h-7 w-7 text-[#c9dacd]" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-stone-500">ยังไม่มีข้อมูลในหมวดนี้</p>
              <p className="mt-1 text-[13px] text-stone-400">โปรดติดตามประกาศใหม่เร็ว ๆ นี้</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
