import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react';
import { Megaphone, Briefcase, Calendar, ArrowRight, FileText, Newspaper } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { requestAPI } from '@/lib/api';
import type { NewsInfo } from '@/interface/newinfo';

export const Route = createFileRoute('/_user/news/')({
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
  const [tap, setTap] = useState<'job' | 'general'>('general');

  const { latestJob, latestGeneral } = useMemo(() => {
    const sortByDate = (arr: NewsInfo[]) =>
      [...arr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      latestJob: sortByDate(data?.filter(n => n.type === "ประกาศจัดซื้อจัดจ้าง") || []),
      latestGeneral: sortByDate(data?.filter(n => n.type === "ประชาสัมพันธ์") || []),
    };
  }, [data]);

  const latestList = tap === 'job' ? latestJob : latestGeneral;
  const isJob = tap === 'job';

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
            ติดตามข่าวประชาสัมพันธ์ ประกาศจัดซื้อจัดจ้าง และกิจกรรมต่างๆ ของโรงพยาบาลสะเมิง
          </p>

          {/* ─── Tabs ─── */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1 bg-gray-100 rounded-2xl gap-1">
              <button
                onClick={() => setTap('general')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                  ${!isJob
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-600'
                  }`}
              >
                <Megaphone className="w-4 h-4" />
                ประชาสัมพันธ์
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                  ${!isJob ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {latestGeneral.length}
                </span>
              </button>
              <button
                onClick={() => setTap('job')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                  ${isJob
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-600'
                  }`}
              >
                <Briefcase className="w-4 h-4" />
                ประกาศจัดซื้อจัดจ้าง
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                  ${isJob ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {latestJob.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-5xl mx-auto px-6 pt-10">

        {/* count label */}
        {latestList.length > 0 && (
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
            {isJob ? 'ประกาศจัดซื้อจัดจ้าง' : 'ข่าวประชาสัมพันธ์'} · {latestList.length} รายการ
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {latestList.length > 0 ? (
            latestList.map((info) => (
              <div
                key={info.id}
                onClick={() => navigate({ to: "/news/$id", params: { id: String(info.id) } })}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden
                           cursor-pointer hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-1
                           transition-all duration-300"
              >
                {/* Colored top strip */}
                <div className={`h-1.5 w-full ${isJob ? 'bg-linear-to-r from-green-500 to-green-600' : 'bg-linear-to-r from-teal-500 to-teal-600'}`} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + Date row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                      ${isJob ? 'bg-green-50 text-green-600' : 'bg-teal-50 text-teal-600'}`}>
                      {isJob
                        ? <FileText className="w-4 h-4" />
                        : <Megaphone className="w-4 h-4" />
                      }
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