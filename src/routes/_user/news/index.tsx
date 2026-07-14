import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react';
import { Megaphone, Briefcase, Calendar, ArrowRight, FileText, Newspaper } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { requestAPI } from '@/lib/api';
import { NEWS_TABS, type NewsInfo, type NewsTabKey } from '@/interface/newinfo';

// สี/ไอคอนต่อหมวด — เป็นเรื่องเฉพาะหน้านี้ (layout คนละแบบกับหน้าแรก) ส่วนตัว key/type/label
// มาจาก NEWS_TABS ที่เดียว. Record<NewsTabKey, …> บังคับว่าเพิ่มประเภทข่าวใหม่ต้องมาใส่สไตล์ที่นี่
// ไม่งั้น TypeScript error (กันแท็บโผล่มาแบบไม่มีสไตล์)
// ใช้ class เต็มสตริงเสมอ — ห้าม interpolate ชื่อสี ไม่งั้น Tailwind purge ทิ้ง
const TAB_STYLE: Record<NewsTabKey, { Icon: LucideIcon; strip: string; iconBox: string }> = {
  general: { Icon: Megaphone, strip: 'bg-linear-to-r from-teal-500 to-teal-600', iconBox: 'bg-teal-50 text-teal-600' },
  job: { Icon: Briefcase, strip: 'bg-linear-to-r from-green-500 to-green-600', iconBox: 'bg-green-50 text-green-600' },
  procurement: { Icon: FileText, strip: 'bg-linear-to-r from-slate-500 to-slate-600', iconBox: 'bg-slate-100 text-slate-600' },
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

  const activeList = useMemo(() => {
    return [...(data?.filter((n) => n.type === activeTab.type) ?? [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [data, activeTab.type]);

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20">

      {/* ─── Hero Header ─── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-5">
            <Newspaper className="w-3.5 h-3.5 text-green-600" />
            <span className="text-[11px] font-semibold text-green-700 tracking-wider uppercase">ข่าวสารและประกาศ</span>
          </div>

          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
            ศูนย์ข้อมูลข่าวสาร<span className="text-green-600">โรงพยาบาล</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-[15px] leading-relaxed">
            ติดตามข่าวประชาสัมพันธ์ ประกาศรับสมัครงาน และจัดซื้อพัสดุต่างๆ ของโรงพยาบาลสะเมิง
          </p>

          {/* ─── Tabs ─── */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex flex-wrap justify-center p-1 bg-gray-100 rounded-2xl gap-1">
              {NEWS_TABS.map(({ key, label, type }) => {
                const { Icon } = TAB_STYLE[key]
                const selected = key === activeKey
                return (
                  <button
                    key={key}
                    onClick={() => navigate({ to: '/news', search: { tab: key } })}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                      ${selected
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-600'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                      ${selected ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {countByType[type] ?? 0}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-5xl mx-auto px-6 pt-10">

        {/* count label */}
        {activeList.length > 0 && (
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
            {activeTab.label} · {activeList.length} รายการ
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeList.length > 0 ? (
            activeList.map((info) => (
              <div
                key={info.id}
                onClick={() => navigate({ to: "/news/$id", params: { id: String(info.id) } })}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden
                           cursor-pointer hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-1
                           transition-all duration-300"
              >
                {/* Colored top strip */}
                <div className={`h-1.5 w-full ${activeStyle.strip}`} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + Date row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeStyle.iconBox}`}>
                      <activeStyle.Icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(info.date).toLocaleDateString("th-TH", {
                        day: 'numeric', month: 'short', year: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-[14.5px] font-bold text-gray-900 leading-snug line-clamp-2 mb-2
                                 group-hover:text-green-700 transition-colors flex-1">
                    {info.title}
                  </h2>

                  {/* Description */}
                  <p className="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {info.description}
                  </p>

                  {/* Footer */}
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">
                      อ่านรายละเอียด
                    </span>
                    <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center
                                    group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty state */
            <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                <FileText className="w-7 h-7 text-gray-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-500">ยังไม่มีข้อมูลในหมวดนี้</p>
                <p className="text-xs text-gray-300 mt-1">โปรดติดตามประกาศใหม่เร็วๆ นี้</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
