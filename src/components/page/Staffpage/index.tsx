import { getIconColor } from "@/components/icon/colors";
import { SectionHeading } from "@/components/page/section-heading";
import type { StaffMenu } from "@/interface/staffmenu";
import { requestAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, icons } from "lucide-react";

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

  // REDESIGN (โทน sage): การ์ดแน่นขึ้นแบบแผงเมนู (app launcher) แทนการ์ดใหญ่โปร่ง ๆ
  // logic query / skeleton / empty / isExternal เดิมทั้งหมด
  return (
    <section id="staff-portal" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:scroll-mt-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Staff Portal"
          title="บริการสำหรับเจ้าหน้าที่"
          description="ระบบและเครื่องมือภายในสำหรับบุคลากรโรงพยาบาลสะเมิง"
        />

        {/* ─── ยังไม่มีเมนูใน DB — คงหัวข้อ section ไว้ ไม่ซ่อนทั้งบล็อก ─── */}
        {isEmpty && (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white/60 py-16 text-center">
            <p className="text-[15px] text-stone-400">ยังไม่มีเมนูบริการสำหรับเจ้าหน้าที่</p>
          </div>
        )}

        {/* ─── ตารางเมนู ─── */}
        {!isEmpty && (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-2xl border border-stone-200/80 bg-white"
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
                      className="group relative flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9dacd] hover:shadow-lg hover:shadow-[#24352b]/8"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color.bgClass} ${color.textClass}`}
                        >
                          {Icon ? <Icon size={21} aria-hidden="true" /> : null}
                        </div>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-stone-300 transition-colors duration-200 group-hover:text-[#4a6b57]"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[14.5px] leading-snug font-semibold text-[#24352b] transition-colors duration-200 group-hover:text-[#4a6b57]">
                          {menu.menu_name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-stone-500">
                          {menu.description}
                        </p>
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
