import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/page/section-heading";

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

// REDESIGN (โทน sage): เดิมเป็นการ์ดขาวใบใหญ่ใบเดียวยัดทุกหัวข้อ อ่านแล้วแบนไปหมด
// ตอนนี้แยกเป็น "วิสัยทัศน์" การ์ดเขียวเข้ม (จุดเน้นของหน้า) คู่กับ "พันธกิจ" การ์ดขาว
// แล้วต่อท้ายด้วยแถบค่านิยม LOVE SM — เนื้อหาทุกตัวคงเดิมครบ
export default function VisionSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Vision & Mission"
          title="วิสัยทัศน์และพันธกิจ"
          description="ทิศทางการทำงานของโรงพยาบาลสะเมิง และสิ่งที่เรายึดถือในการดูแลชุมชน"
          align="center"
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          {/* ─── วิสัยทัศน์ (การ์ดเน้น) ─── */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#2f4438] p-8 sm:p-10">
            {/* วงกลมจาง ๆ เป็นพื้นผิว ไม่ให้การ์ดเขียวดูตันเกินไป */}
            <div
              className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#4a6b57]/40 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative">
              <Quote className="h-8 w-8 text-[#b08968]" aria-hidden="true" />
              <p className="mt-5 text-[11px] font-semibold tracking-[0.2em] text-[#8aa893] uppercase">
                วิสัยทัศน์ · Vision
              </p>
              <blockquote className="mt-4 text-2xl leading-snug font-bold text-balance text-white sm:text-[28px]">
                {VISION}
              </blockquote>
            </div>

            <p className="relative mt-10 border-t border-[#4a6b57] pt-6 text-[17px] font-semibold text-[#c9a184]">
              “{SLOGAN}”
            </p>
          </div>

          {/* ─── พันธกิจ ─── */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-10">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#96704f] uppercase">
              พันธกิจ · Mission
            </p>
            <h3 className="mt-3 text-xl font-bold text-[#24352b]">สิ่งที่เรามุ่งมั่นทำให้สำเร็จ</h3>

            <ol className="mt-6 flex flex-col gap-5">
              {MISSIONS.map((mission, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f3f7f3] text-[13px] font-bold text-[#4a6b57]"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-[15px] leading-relaxed text-stone-600">{mission}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ─── ค่านิยมองค์กร ─── */}
        <div className="mt-5 rounded-3xl border border-stone-200/80 bg-white p-8 sm:p-10">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#96704f] uppercase">
              ค่านิยมองค์กร · Core Values
            </p>
            <span className="text-[15px] font-bold tracking-wide text-[#4a6b57]">LOVE SM</span>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {VALUES.map(({ letter, en, th }) => (
              <li
                key={letter}
                className="group rounded-2xl border border-stone-200/70 bg-[#fdfcf9] px-4 py-5 text-center transition-colors duration-300 hover:border-[#c9dacd] hover:bg-[#f3f7f3]"
              >
                <span className="block text-3xl leading-none font-bold text-[#4a6b57]">
                  {letter}
                </span>
                <span className="mt-2 block text-[11.5px] font-semibold text-[#96704f]">{en}</span>
                <span className="mt-1 block text-[13.5px] leading-snug text-stone-600">{th}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
