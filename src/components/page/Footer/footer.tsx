import { Phone, MapPin, Monitor, ShieldCheck, Facebook, Heart, Mail, Clock3 } from "lucide-react";

const FACEBOOK_URL =
  "https://www.facebook.com/p/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%AA%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%87-%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88-100066989703921/";

// NOTE: previous code embedded a Google Maps *share* link (maps.app.goo.gl),
// which Google blocks from rendering inside an iframe. This uses the public
// `output=embed` form so the map renders without an API key. Replace the `q`
// with precise coordinates, or paste the official "Share → Embed a map" URL,
// for a pin-accurate location.
const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%AA%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%87&output=embed";
const MAP_LINK_URL = "https://maps.app.goo.gl/AnAQwPAHe7StQ35w5";
const EMAIL = "samoenghospital.moph@gmail.com";

// ทีมผู้ดูแล — โครงเดียวกันสองรายการ วนแทนการ copy บล็อกซ้ำ
const TEAMS = [
  { icon: Monitor, th: "นักวิชาการคอมพิวเตอร์", en: "Digital Health & Infrastructure" },
  { icon: ShieldCheck, th: "งานประกันสุขภาพ", en: "Health Insurance & Benefits" },
];

// REDESIGN (โทน sage): เดิมฟุตเตอร์เป็น slate-900 สีน้ำเงินเทา ซึ่งหลุดจากโทนเขียวทั้งเว็บ
// เปลี่ยนเป็นเขียวหม่นเข้ม + accent น้ำตาลไม้ ให้จบเป็นชุดเดียวกับหัวเว็บ
// ข้อมูลทุกตัว (ที่อยู่ เบอร์ อีเมล Facebook แผนที่ ทีมผู้ดูแล เครดิต) คงไว้ครบ
const Footer = () => {
  return (
    <footer className="w-full bg-[#24352b] pt-16 pb-8 text-[#a7bfad] sm:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">

          {/* ── แบรนด์ ── */}
          <div className="space-y-6 lg:col-span-4">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight text-white">
                โรงพยาบาลสะเมิง
              </h2>
              <p className="mt-1.5 text-[10.5px] font-semibold tracking-[0.22em] text-[#8aa893] uppercase">
                Samoeng Hospital
              </p>
              <span className="mt-4 block h-px w-12 bg-[#b08968]" aria-hidden="true" />
            </div>

            <p className="max-w-sm text-[15px] leading-relaxed">
              โรงพยาบาลสะเมิง มุ่งมั่นให้บริการทางการแพทย์ที่ได้มาตรฐาน
              เข้าถึงง่าย เพื่อสุขภาวะที่ดีของพี่น้องชาวสะเมิง
            </p>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2f4438] px-4 py-2.5 text-[13.5px] font-medium text-[#c9dacd] transition-colors hover:bg-[#3b5546] hover:text-white"
              >
                <Facebook className="h-4 w-4" />
                ติดตามบน Facebook
              </a>
              {/* FIX: ปุ่มนี้เคย href ไป FACEBOOK_URL (ก๊อปจากปุ่มบน) และสะกดผิด
                  เปลี่ยนเป็น mailto: อีเมลจริงของโรงพยาบาล — mailto ไม่ต้องมี target/rel */}
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2f4438] px-4 py-2.5 text-[13.5px] font-medium text-[#c9dacd] transition-colors hover:bg-[#3b5546] hover:text-white"
              >
                <Mail className="h-4 w-4" />
                ติดต่อทางอีเมล
              </a>
            </div>
          </div>

          {/* ── ติดต่อ ── */}
          <div className="space-y-6 lg:col-span-4">
            <h3 className="text-[11px] font-semibold tracking-[0.2em] text-white uppercase">
              ติดต่อสอบถาม
            </h3>

            <ul className="space-y-4 text-[15px]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a184]" />
                <span className="leading-relaxed">
                  1766 1269 ต.สะเมิงใต้ <br />
                  อ.สะเมิง จ.เชียงใหม่ 50250
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#c9a184]" />
                <a href="tel:053487114" className="transition-colors hover:text-white">
                  053-487-114
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 shrink-0 text-[#c9a184]" />
                <span>เปิดบริการในเวลาราชการ 08.00 – 16.00 น.</span>
              </li>
            </ul>

            {/* ทีมผู้ดูแลระบบ */}
            <div className="space-y-3 pt-2">
              {TEAMS.map(({ icon: Icon, th, en }) => (
                <div key={th} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2f4438] text-[#c9a184]">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[13.5px] font-semibold text-white">{th}</p>
                    <p className="text-[11.5px] text-[#6b8c76]">{en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── แผนที่ ── */}
          <div className="space-y-4 lg:col-span-4">
            <h3 className="text-[11px] font-semibold tracking-[0.2em] text-white uppercase">
              สถานที่ตั้ง
            </h3>
            <div className="overflow-hidden rounded-2xl border border-[#3b5546]">
              <iframe
                title="แผนที่โรงพยาบาลสะเมิง"
                src={MAP_EMBED_URL}
                width="100%"
                height="240"
                className="block border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={MAP_LINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#c9a184] transition-colors hover:text-white"
            >
              <MapPin className="h-3.5 w-3.5" />
              เปิดใน Google Maps
            </a>
          </div>
        </div>

        {/* ── แถบล่างสุด ── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#2f4438] pt-7 md:flex-row">
          <div className="flex items-center gap-2 text-[11.5px] font-medium tracking-wider text-[#6b8c76] uppercase">
            <span>© 2026 Samoeng Hospital</span>
            <span className="hidden text-[#3b5546] md:inline">|</span>
            <span className="inline-flex items-center gap-1">
              Dedicated to Community
              <Heart className="h-3 w-3 text-[#b08968]" />
            </span>
          </div>
          <p className="text-center text-[11.5px] font-medium tracking-wider text-[#6b8c76] uppercase md:text-right">
            System Design by IT Team &amp; Health Insurance Department
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
