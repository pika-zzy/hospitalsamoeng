import { getIconColor } from "@/components/icon/colors";
import { Ambulance, CigaretteOff, Leaf, Pill, Smile, Stethoscope, type LucideIcon } from "lucide-react";

// NOTE: รายการบริการสำหรับประชาชนคงที่ในโค้ด (ไม่ได้ดึงจาก API) แบบเดียวกับ Vision
// เพราะแทบไม่เปลี่ยน — ถ้าวันหนึ่งต้องให้ admin แก้เองค่อยทำเป็น resource ใหม่ทั้งชุด
// สีไอคอนอ้าง label ใน ICON_COLORS (source of truth เดียวกับเมนูเจ้าหน้าที่)
type PublicService = {
  title: string;
  /** แยกเป็นบรรทัด ๆ ตามต้นฉบับ — บรรทัดแรกคือประเภทบริการ บรรทัดถัดมาคือเวลา/ช่องทาง */
  details: string[];
  icon: LucideIcon;
  color: string;
};

const SERVICES: PublicService[] = [
  {
    title: "บริการตรวจรักษาโรคทั่วไป",
    details: ["บริการตรวจรักษาโรคทั่วไปในเวลาราชการ", "ตั้งแต่เวลา 08.00น. – 16.00น."],
    icon: Stethoscope,
    color: "green",
  },
  {
    title: "บริการด้านปฐมภูมิและองค์รวม",
    details: ["บริการคลินิกประจำวัน", "สามารถตรวจสอบวันให้บริการได้ตามตารางให้บริการคลินิก"],
    icon: Pill,
    color: "teal",
  },
  {
    title: "ห้องอุบัติเหตุและฉุกเฉิน",
    details: ["เปิดบริการตลอด 24 ชั่วโมง", "สายด่วนฉุกเฉิน 1669"],
    icon: Ambulance,
    color: "red",
  },
  {
    title: "บริการคลินิกทันตกรรม",
    details: ["บริการคลินิกทันตกรรมในเวลาราชการ", "ตั้งแต่เวลา 08.00น. – 16.00น."],
    icon: Smile,
    color: "blue",
  },
  {
    title: "บริการแพทย์แผนไทย และกายภาพบำบัด",
    details: ["บริการแพทย์แผนไทย และกายภาพบำบัดในเวลาราชการ", "ตั้งแต่เวลา 08.00น. – 16.00น."],
    icon: Leaf,
    color: "purple",
  },
  {
    title: "บริการคลินิกฟ้าใส",
    details: ["บริการคลินิกฟ้าใส", "บริการทุกวันจันทร์ถึงศุกร์ ตั้งแต่เวลา 8.30 น. – 16.30 น."],
    icon: CigaretteOff,
    color: "orange",
  },
];

export default function PublicServices() {
  return (
    // NOTE: ใช้โครง section เดียวกับ StaffPortal ที่อยู่ถัดลงไป (kicker + h2, การ์ดขาวบนพื้น mint)
    // เพื่อให้สอง section ที่ติดกันอ่านเป็นชุดเดียว — การ์ดเป็น div ไม่ใช่ลิงก์ เพราะยังไม่มีหน้าปลายทาง
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ─── Header ─── */}
        <div className="mb-6">
          <p className="text-xs tracking-widest text-green-500 uppercase font-semibold mb-0.5">
            Services for Public
          </p>
          <h2 className="text-3xl font-black text-gray-900 leading-none">
            สำหรับ<span className="text-green-500">ประชาชน</span>
          </h2>
        </div>

        {/* ─── Grid ─── */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(({ title, details, icon: Icon, color }) => {
            const c = getIconColor(color);

            return (
              <li
                key={title}
                className="flex items-start gap-3.5 bg-white border border-green-100/60 rounded-2xl p-5 shadow-sm shadow-green-900/5 hover:border-green-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300"
              >
                <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${c.bgClass} ${c.textClass}`}>
                  <Icon size={21} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-[13.5px] font-bold text-gray-900 leading-snug">
                    {title}
                  </p>
                  <p className="mt-1 text-[11.5px] text-gray-500 leading-relaxed">
                    {details.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}
