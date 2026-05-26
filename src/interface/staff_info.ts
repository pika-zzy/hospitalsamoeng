
export interface System {
  name: string;
  desc: string;
  href: string;
  icon: string;
  color: string;
}

export const systems: System[] = [
  {
    name: "ERP Dashboard",
    desc: "ภาพรวมข้อมูลและสถิติของหน่วยงาน",
    href: "#",
    icon: "ti-chart-bar",
    color: "bg-[#eaf3de] text-[#3b6d11]",
  },
  {
    name: "ระบบบริหารความเสี่ยง",
    desc: "รายงานและติดตามอุบัติการณ์",
    href: "#",
    icon: "ti-alert-triangle",
    color: "bg-[#faece7] text-[#993c1d]",
  },
  {
    name: "แจ้งซ่อม",
    desc: "แจ้งซ่อมออนไลน์อุปกรณ์และครุภัณฑ์",
    href: "#",
    icon: "ti-tool",
    color: "bg-[#e1f5ee] text-[#0f6e56]",
  },
  {
    name: "SMART OFFICE",
    desc: "ระบบสำนักงานอิเล็กทรอนิกส์",
    href: "#",
    icon: "ti-building",
    color: "bg-[#e6f1fb] text-[#185fa5]",
  },
  {
    name: "Template",
    desc: "PowerPoint & Onepage",
    href: "#",
    icon: "ti-presentation",
    color: "bg-[#eeedfe] text-[#534ab7]",
  },
  {
    name: "ระบบใบรับรองเงินเดือน",
    desc: "สสจ.เชียงใหม่",
    href: "#",
    icon: "ti-receipt",
    color: "bg-[#faeeda] text-[#854f0b]",
  },
  {
    name: "รายงานงบการเงินหน่วยงาน",
    desc: "รายงานงบประมาณประจำปี",
    href: "#",
    icon: "ti-report-money",
    color: "bg-[#eaf3de] text-[#3b6d11]",
  },
  {
    name: "บริการอื่นๆ",
    desc: "HDC, HA และระบบที่เกี่ยวข้อง",
    href: "#",
    icon: "ti-apps",
    color: "bg-gray-100 text-gray-500",
  },
];