import { Leaf } from "lucide-react";

// NOTE: เนื้อหาวิสัยทัศน์/พันธกิจ/ค่านิยม คงที่ในโค้ด (ไม่ได้ดึงจาก API)
// เพราะแทบไม่เปลี่ยน — ถ้าวันหนึ่งต้องให้ admin แก้เองค่อยทำเป็น resource ใหม่ทั้งชุด
const VISION =
  "โรงพยาบาลคุณภาพ สิ่งแวดล้อมดี เจ้าหน้าที่สุขใจ บริการทันสมัย ด้วยหัวใจแห่งการดูแล";

const SLOGAN = "บนดอยที่ห่างไกล เราใส่ใจไม่ห่างกัน";

const MISSIONS = [
  "ให้บริการด้านส่งเสริม ป้องกัน รักษา และฟื้นฟูสุขภาพประชาชนอย่างครบวงจร มีคุณภาพ มาตรฐาน ปลอดภัย และเข้าถึงได้ทุกกลุ่มประชาชน",
  "สร้างและพัฒนาสภาพแวดล้อมทางกายภาพในโรงพยาบาลที่ปลอดภัย สะอาด และส่งเสริมการบริการที่มีคุณภาพ",
  "พัฒนาศักยภาพบุคลากรทุกระดับ ให้มีความรู้ ความสามารถ มีคุณธรรมจริยธรรม และมีความสุขในการทำงาน",
  "ส่งเสริมการใช้เทคโนโลยีสารสนเทศ มาบริหารจัดการงานและระบบรายได้อย่างมีประสิทธิภาพ โปร่งใส ตรวจสอบได้",
];

const VALUES = [
  { letter: "L", en: "Learning", th: "องค์กรแห่งการเรียนรู้" },
  { letter: "O", en: "Organization of happiness", th: "องค์กรมีความสุข" },
  { letter: "V", en: "Voluntary", th: "จิตบริการ" },
  { letter: "E", en: "Environment", th: "สิ่งแวดล้อมดี" },
  { letter: "S", en: "Smart hospital", th: "โรงพยาบาลอัจฉริยะ" },
  { letter: "M", en: "Management", th: "จัดการระบบอย่างมีมาตรฐาน" },
];

export default function VisionSection() {
  return (
    // NOTE: ตาม mockup "แบบ B" ที่ user เลือก (2026-08-10) — การ์ดขาวใบใหญ่ใบเดียว
    // จบครบทุกหัวข้อในหน้าแรก ไม่มีหน้าแยก; วางระหว่าง hero กับ "ข่าวสาร & ประกาศ"
    // ไม่ใส่ padding ล่าง เพราะ Newspage มี pt-24 ของตัวเองอยู่แล้ว
    <section className="pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* หัวข้อสำหรับ screen reader — ลำดับ heading ของหน้าไม่ขาดช่วง
            แต่ดีไซน์แบบ B ไม่มีหัว section แบบตัวโตเหมือน section อื่น */}
        <h2 className="sr-only">วิสัยทัศน์ พันธกิจ และค่านิยมองค์กร</h2>

        <div className="bg-white border border-green-100/60 rounded-3xl shadow-lg shadow-green-900/5 p-6 sm:p-9 lg:p-10">
          {/* ─── วิสัยทัศน์ ─── */}
          <div className="text-center pb-7 mb-7 border-b border-dashed border-green-100">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-xs font-bold tracking-widest uppercase text-green-700">
              <Leaf className="w-3.5 h-3.5" />
              วิสัยทัศน์ · Vision
            </p>
            <blockquote className="mt-4 text-xl sm:text-2xl lg:text-3xl font-bold leading-relaxed text-green-800 text-balance">
              “{VISION}”
            </blockquote>
          </div>

          {/* ─── พันธกิจ + ค่านิยม ─── */}
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
            {/* พันธกิจ */}
            <div>
              <h3 className="flex items-center gap-2.5 mb-4 text-lg font-bold text-gray-900">
                <span className="w-1 h-5 rounded-full bg-green-600" aria-hidden="true" />
                พันธกิจ
              </h3>
              <ol className="flex flex-col gap-3">
                {MISSIONS.map((mission, i) => (
                  <li key={i} className="flex gap-3 text-base leading-relaxed text-gray-600">
                    <span
                      className="shrink-0 w-6 h-6 rounded-lg bg-green-100 text-green-700 text-xs font-extrabold flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {mission}
                  </li>
                ))}
              </ol>
            </div>

            {/* ค่านิยมองค์กร */}
            <div>
              <h3 className="flex items-center gap-2.5 mb-4 text-lg font-bold text-gray-900">
                <span className="w-1 h-5 rounded-full bg-green-600" aria-hidden="true" />
                ค่านิยมองค์กร — LOVE SM
              </h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {VALUES.map(({ letter, en, th }) => (
                  <li
                    key={letter}
                    className="flex flex-col items-center text-center bg-green-50 border border-green-100 rounded-xl px-3 py-3.5"
                  >
                    <span className="text-2xl font-black leading-none text-green-600">{letter}</span>
                    <span className="mt-1 text-[11px] font-semibold text-green-700">{en}</span>
                    <span className="mt-0.5 text-sm text-gray-600">{th}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ─── คำขวัญ ─── */}
          <p className="mt-7 pt-6 border-t border-dashed border-green-100 text-center text-lg font-semibold text-green-700">
            “{SLOGAN}”
          </p>
        </div>
      </div>
    </section>
  );
}
