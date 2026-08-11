import { Phone, MapPin, Monitor, ShieldCheck, Facebook, Heart, Mail } from "lucide-react";

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

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 pt-20 pb-10 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">

          {/* ── Brand ── */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                Samoeng <span className="text-green-500">Hospital</span>
              </h2>
              <p className="text-[11px] font-bold tracking-[0.3em] text-slate-500 mt-1.5 uppercase">
                Healthcare Center of Excellence
              </p>
            </div>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              โรงพยาบาลสะเมิง มุ่งมั่นให้บริการทางการแพทย์ที่ได้มาตรฐาน
              เข้าถึงง่าย เพื่อสุขภาวะที่ดีของพี่น้องชาวสะเมิง
            </p>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-green-600 hover:text-white px-4 py-2.5 rounded-xl transition-colors"
            >
              <Facebook className="w-4 h-4" />
              ติดตามบน Facebook
            </a>
            {/* FIX: ปุ่มนี้เคย href ไป FACEBOOK_URL (ก๊อปจากปุ่มบน) และสะกดผิด
                เปลี่ยนเป็น mailto: อีเมลจริงของโรงพยาบาล — mailto ไม่ต้องมี target/rel */}
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-green-600 hover:text-white px-4 py-2.5 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4" />
              ติดต่อทางอีเมล
            </a>
          </div>

          {/* ── Contact ── */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              ติดต่อสอบถาม
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                <span className="leading-relaxed">
                  1766 1269 ต.สะเมิงใต้ <br />
                  อ.สะเมิง จ.เชียงใหม่ 50250
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-green-500" />
                <a href="tel:053487114" className="hover:text-green-400 transition-colors">
                  053-487-114
                </a>
              </li>
            </ul>

            {/* Responsible teams */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-green-500 shrink-0">
                  <Monitor className="w-4.5 h-4.5" />
                </div>
                <div className="leading-tight">
                  <p className="text-[13px] font-semibold text-white">นักวิชาการคอมพิวเตอร์</p>
                  <p className="text-xs text-slate-500">Digital Health &amp; Infrastructure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-green-500 shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div className="leading-tight">
                  <p className="text-[13px] font-semibold text-white">งานประกันสุขภาพ</p>
                  <p className="text-xs text-slate-500">Health Insurance &amp; Benefits</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              สถานที่ตั้ง
            </h3>
            <div className="rounded-2xl overflow-hidden border border-slate-800">
              <iframe
                title="แผนที่โรงพยาบาลสะเมิง"
                src={MAP_EMBED_URL}
                width="100%"
                height="220"
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
              className="inline-flex items-center gap-1.5 text-xs font-medium text-green-500 hover:text-green-400 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              เปิดใน Google Maps
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase text-slate-500">
            <span>© 2026 Samoeng Hospital</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="inline-flex items-center gap-1">
              Dedicated to Community
              <Heart className="w-3 h-3 text-green-600" />
            </span>
          </div>
          <p className="text-[11px] font-medium tracking-wider uppercase text-slate-500 text-center md:text-right">
            System Design by IT Team &amp; Health Insurance Department
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
