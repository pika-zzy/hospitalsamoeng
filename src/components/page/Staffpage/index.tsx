import { getIconColor } from "@/components/icon/colors";
import type { StaffMenu } from "@/interface/staffmenu";
import { requestAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, icons } from "lucide-react";

export default function StaffPortal() {
  const { data: menus = [], isLoading } = useQuery<StaffMenu[]>({
    queryKey: ["menu"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<StaffMenu[]>({ method: "GET", url: "/menu" });
      return resp.success ? resp.data : [];
    },
  });

  const isEmpty = !isLoading && menus.length === 0;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* ─── Header ─── */}
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 rounded-full bg-linear-to-b from-green-400 to-green-600 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-green-500 uppercase mb-0.5">
                Staff &amp; Portal
              </p>
              <h2 className="text-3xl font-black text-gray-900 leading-none">
                สำหรับเจ้าหน้าที่<span className="text-green-500"></span>
              </h2>
            </div>
          </div>
        </div>

        {/* ─── Empty ─── */}
        {/* ยังไม่มีเมนูใน DB — คงหัวข้อ section ไว้ ไม่ซ่อนทั้งบล็อก */}
        {isEmpty && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-14 text-center">
            <p className="text-sm text-gray-400">ยังไม่มีเมนูบริการสำหรับเจ้าหน้าที่</p>
          </div>
        )}

        {/* ─── Grid ─── */}
        {!isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse"
                />
              ))
            : menus.map((menu) => {
                const color = getIconColor(menu.color);
                // icon เก็บเป็นชื่อไอคอน lucide ที่ IconPicker ส่งมา (เช่น "Wrench")
                const Icon = menu.icon in icons ? icons[menu.icon as keyof typeof icons] : null;
                // ลิงก์ภายนอกเปิดแท็บใหม่, ลิงก์ภายในเว็บ (เช่น /maintenance) เปิดในแท็บเดิม
                const isExternal = /^https?:\/\//i.test(menu.link);

                return (
                  <a
                    key={menu.id}
                    href={menu.link || "#"}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300"
                  >
                    {/* Icon + Text (ไอคอนซ้าย ข้อความชิดซ้าย — อ่านง่ายกว่าจัดกึ่งกลางสำหรับข้อความไทย) */}
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${color.bgClass} ${color.textClass}`}>
                        {Icon ? <Icon size={21} aria-hidden="true" /> : null}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[13.5px] font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors">
                          {menu.menu_name}
                        </p>
                        <p className="mt-1 text-[11.5px] text-gray-500 leading-relaxed">
                          {menu.description}
                        </p>
                      </div>
                    </div>

                    {/* Chevron — ทั้งการ์ดกดได้อยู่แล้ว ไม่ต้องมีปุ่มซ้ำ */}
                    <div className="mt-auto pt-4 flex justify-end">
                      <ChevronRight
                        className="w-4 h-4 text-gray-300 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all duration-200"
                        aria-hidden="true"
                      />
                    </div>
                  </a>
                );
              })}
        </div>
        )}

      </div>
    </section>
  );
}
