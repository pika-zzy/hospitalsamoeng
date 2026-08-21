import { CalendarDays, LayoutGrid, Megaphone, Stethoscope, type LucideIcon } from "lucide-react";

// แถบทางลัดใต้ hero — กดแล้วเลื่อนลงไปยัง section นั้นในหน้าแรก (ไม่ได้เปลี่ยนหน้า)
// id ที่อ้างถึงต้องตรงกับ id ที่ตั้งไว้บน <section> ของแต่ละบล็อก:
//   Newspage / Activity / Publicpage / Staffpage
// section เหล่านั้นมี scroll-mt-* กันหัวข้อโดน navbar (sticky) บังตอนเลื่อนถึง
type SectionLink = {
  id: string;
  icon: LucideIcon;
  title: string;
  detail: string;
};

const SECTIONS: SectionLink[] = [
  {
    id: "news",
    icon: Megaphone,
    title: "ข่าวสารและประกาศ",
    detail: "ประชาสัมพันธ์ · รับสมัครงาน · จัดซื้อ",
  },
  {
    id: "activity",
    icon: CalendarDays,
    title: "กิจกรรมล่าสุด",
    detail: "ภาพบรรยากาศงานและกิจกรรม",
  },
  {
    id: "public-services",
    icon: Stethoscope,
    title: "บริการสำหรับประชาชน",
    detail: "คลินิกและวันเวลาทำการ",
  },
  {
    id: "staff-portal",
    icon: LayoutGrid,
    title: "บริการสำหรับเจ้าหน้าที่",
    detail: "ระบบภายในสำหรับบุคลากร",
  },
];

export default function QuickActions() {
  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    // เคารพผู้ใช้ที่ตั้งค่า "ลดการเคลื่อนไหว" ในระบบ (a11y / WCAG 2.3.3) — เลื่อนทันทีไม่ต้องไถ
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    // -mt-* ดึงการ์ดขึ้นไปคาบเกี่ยวกับ hero ด้านบน (z-30 ให้อยู่เหนือ overlay ของ hero)
    <section className="relative z-30 -mt-12 px-4 sm:px-6 lg:-mt-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="sr-only">ทางลัดไปยังหัวข้อในหน้านี้</h2>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-200/80 shadow-xl shadow-[#24352b]/10 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map(({ id, icon: Icon, title, detail }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className="group flex h-full w-full items-center gap-4 bg-white px-5 py-6 text-left transition-colors duration-300 hover:bg-[#f3f7f3]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3f7f3] text-[#4a6b57] transition-colors duration-300 group-hover:bg-[#3b5546] group-hover:text-white">
                  <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold text-[#24352b]">{title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-stone-500">
                    {detail}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
