import { getIconColor } from "@/components/icon/colors";
import { SectionHeading } from "@/components/page/section-heading";
import {
  Ambulance,
  CigaretteOff,
  Leaf,
  Pill,
  Smile,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

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

// REDESIGN (โทน sage): section นี้เป็น "แถบเขียวเข้มเต็มความกว้าง" ตัวเดียวของหน้าแรก
// ทำหน้าที่เป็นจุดพักสายตากลางหน้า ไม่ให้เลื่อนยาว ๆ แล้วเจอการ์ดขาวบนพื้นครีมซ้ำไม่จบ
// เนื้อหาบริการ 6 รายการและสีไอคอนเดิมคงไว้ครบ
export default function PublicServices() {
  return (
    <section id="public-services" className="scroll-mt-24 bg-[#2f4438] px-4 py-20 sm:px-6 lg:scroll-mt-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Services for Public"
          title="บริการสำหรับประชาชน"
          description="คลินิกและหน่วยบริการที่เปิดให้ประชาชนเข้ารับบริการ พร้อมวันและเวลาทำการ"
          tone="dark"
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ title, details, icon: Icon, color }) => {
            const c = getIconColor(color);

            return (
              <li
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/6 p-5 transition-colors duration-300 hover:border-white/25 hover:bg-white/10"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.bgClass} ${c.textClass}`}
                >
                  <Icon size={22} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-[15px] leading-snug font-semibold text-white">{title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#a7bfad]">
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
