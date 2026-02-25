import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, MapPin, Monitor, ShieldCheck, Facebook, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0f172a] pt-20 pb-10 text-slate-400 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          
          {/* Section 1: Brand & Core Teams */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                SAMOENG <span className="text-green-500">HOSPITAL</span>
              </h2>
              <Label className="text-[10px] text-slate-500 font-bold tracking-[0.3em] mt-1 uppercase">
                Healthcare Center of Excellence
              </Label>
            </div>
            
            <div className="grid gap-6">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">งาน IT</p>
                  <p className="text-xs text-slate-500">Digital Health & Infrastructure</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">งานประกันสุขภาพ</p>
                  <p className="text-xs text-slate-500">Health Insurance & Benefits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Quick Contact */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">
              ติดต่อสอบถาม
            </h4>
            <ul className="space-y-5 text-[13px] font-medium">
              <li className="flex items-start gap-3 hover:text-green-400 transition-colors">
                <MapPin className="w-4 h-4 shrink-0 text-green-500" />
                <span>เลขที่ 168 หมู่ 2 ต.สะเมิงใต้ <br />อ.สะเมิง จ.เชียงใหม่ 50250</span>
              </li>
              <li className="flex items-center gap-3 hover:text-green-400 transition-colors">
                <Phone className="w-4 h-4 shrink-0 text-green-500" />
                <span>053-487-114</span>
              </li>
              <li className="flex items-center gap-3 hover:text-green-400 transition-colors">
                <Facebook className="w-4 h-4 shrink-0 text-green-500" />
                <span>โรงพยาบาลสะเมิง Samoeng Hospital</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Newsletter Card (Using Shadcn Components) */}
          <div className="lg:col-span-5">
            <h3 className="text-xl font-black text-white tracking-tight mb-6">
              สถานที่ใกล้เคียง
            </h3>
            <Card className="bg-slate-800 border-0 rounded-2xl shadow-lg p-6">
              <iframe
                title="Samoeng Hospital Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.1234567890123!2d98.12345678901234!3d18.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da123456789012%3A0xabcdef1234567890!2sSamoeng%20Hospital!5e0!3m2!1sth!2sth!4v1700000000000"
                width="100%"
                height="250"
                className="rounded-2xl border-0"
                allowFullScreen
                loading="lazy"
              />
            </Card>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-600">
            <span>© 2026 Samoeng Hospital</span>
            <span className="hidden md:block">|</span>
            <Heart className="w-3 h-3 text-red-900/40" />
            <span>Dedicated to Community</span>
          </div>
          
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-600 text-center md:text-right">
            System Design by IT Team & Health Insurance Department
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;