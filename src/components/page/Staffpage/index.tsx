import { systems } from "@/interface/staff_info";
import { ExternalLink, Shield, } from "lucide-react";


export default function StaffPortal() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* ─── Hero ─── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-3.5 h-3.5 text-green-700" />
            <span className="text-[11px] font-semibold text-green-700 tracking-wider">เจ้าหน้าที่</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            สำหรับเจ้าหน้าที่
          </h2>
          <p className="mt-3 text-sm text-gray-400 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-400 inline-block" />
              ระบบที่เกี่ยวกับงานภายใน
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-400 inline-block" />
              แจ้งซ่อม
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-400 inline-block" />
              SMART OFFICE และอื่นๆ
            </span>
          </p>
        </div>

        {/* ─── Grid ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {systems.map((sys) => (
            <a
              key={sys.name}
              href={sys.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center bg-white border border-gray-100
                         rounded-2xl p-5 hover:border-green-200 hover:-translate-y-1
                         hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${sys.color}`}>
                <i className={`ti ${sys.icon} text-[22px]`} aria-hidden="true" />
              </div>

              {/* Text */}
              <p className="text-[13.5px] font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-green-700 transition-colors">
                {sys.name}
              </p>
              <p className="text-[11.5px] text-gray-400 leading-relaxed flex-1">
                {sys.desc}
              </p>

              {/* Button */}
              <div className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-full
                              border border-green-100 bg-green-50 text-green-700 text-xs font-semibold
                              group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600
                              transition-all duration-200">
                <ExternalLink className="w-3 h-3" />
                เปิด
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}