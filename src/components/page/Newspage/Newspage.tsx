import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone, Briefcase, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { requestAPI } from "@/lib/api";
import type { NewsInfo } from "@/interface/newinfo";
import { useQuery } from "@tanstack/react-query";

export default function News_page() {
  const navigate = useNavigate();

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

  const jobNews = data?.filter((n) => n.type === "ประกาศจัดซื้อจัดจ้าง") || [];
  const generalNews = data?.filter((n) => n.type === "ประชาสัมพันธ์") || [];

  const latestJob = [...jobNews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const latestGeneral = [...generalNews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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
        <div className="flex items-end justify-between mb-10">
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
            onClick={() => navigate({ to: "/news" })}
            className="hidden md:inline-flex items-center gap-2 text-xl  text-gray-800 hover:text-green-600 transition-colors group"
          >
            ดูทั้งหมด
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* ─── Two Columns ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ══ ประชาสัมพันธ์ ══ */}
          <div className="flex flex-col rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            {/* Card header strip */}
            <div className="flex items-center gap-3 px-6 py-5 bg-linear-to-r from-blue-600 to-blue-500">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-none">
                  ข่าวประชาสัมพันธ์
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">General Announcement</p>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 divide-y divide-gray-50 overflow-y-auto max-h-80">
              {latestGeneral.length > 0 ? (
                latestGeneral.map((info, idx) => (
                  <div
                    key={info.id}
                    onClick={() => (window.location.href = `/news/${info.id}`)}
                    className="group flex gap-4 px-6 py-4 hover:bg-blue-50/40 transition-colors duration-200 cursor-pointer"
                  >
                    {/* Index number */}
                    <span className="shrink-0 mt-0.5 text-2xl font-black text-blue-100 group-hover:text-blue-200 transition-colors w-7 leading-none select-none">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                        {info.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {info.description}
                      </p>
                      {info.date && (
                        <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatDate(info.date)}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="shrink-0 w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all mt-0.5" />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                  <Megaphone className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm italic">ไม่มีประกาศในขณะนี้</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50">
              <button
                onClick={() => navigate({ to: "/news" })}
                className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
              >
                ดูประกาศทั้งหมด →
              </button>
            </div>
          </div>

          {/* ══ รับสมัครงาน ══ */}
          <div className="flex flex-col rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            {/* Card header strip */}
            <div className="flex items-center gap-3 px-6 py-5 bg-linear-to-r from-green-600 to-green-500">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-none">
                  ข่าวรับสมัครงาน
                </h3>
                <p className="text-xs text-green-100 mt-0.5">Career Opportunities</p>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 divide-y divide-gray-50 overflow-y-auto max-h-80">
              {latestJob.length > 0 ? (
                latestJob.map((info) => (
                  <div
                    key={info.id}
                    onClick={() => (window.location.href = `/news/${info.id}`)}
                    className="group flex gap-4 px-6 py-4 hover:bg-green-50/40 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug">
                          {info.title}
                        </p>
                        <span className="shrink-0 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ใหม่
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{info.description}</p>
                      {info.date && (
                        <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatDate(info.date)}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="shrink-0 w-4 h-4 text-gray-300 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all mt-0.5" />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                  <Briefcase className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm italic">ไม่มีตำแหน่งงานว่างในขณะนี้</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50">
              <button
                onClick={() => navigate({ to: "/news" })}
                className="text-xs font-semibold text-green-600 hover:text-green-800 transition-colors"
              >
                ดูตำแหน่งงานทั้งหมด →
              </button>
            </div>
          </div>

        </div>

        {/* ─── Mobile "ดูทั้งหมด" ─── */}
        <div className="mt-6 flex justify-center md:hidden">
          <Button
            onClick={() => navigate({ to: "/news" })}
            className="flex items-center gap-2 text-green-600 font-bold"
          >
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </section>
  );
}