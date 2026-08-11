export interface Menu {
    title: string;

}

export interface SubMenuItem {
    name: string;
    link: string;
    search?: Record<string, string>; // query params เช่น { tab: "procurement" } ไว้ deep-link เข้าแท็บ
}

export interface MenuItem {
    id: number;
    name: string;
    link?: string;          // มีเมื่อไม่มี submenu
    submenu?: SubMenuItem[]; // มีเมื่อเป็นเมนู dropdown
}

export const Navbarlist: MenuItem[] = [
    {
        id: 1,
        name: "หน้าหลัก",
        link: "/",
    },
    {
        id: 2,
        name: "เกี่ยวกับเรา",
        submenu: [
            // ซ่อนชั่วคราว: หน้า /about/history ยังไม่มีเนื้อหาประวัติจริงของโรงพยาบาลสะเมิง
            // ได้เนื้อหามาแล้วเอาบรรทัดนี้กลับมา (route ยังอยู่ ไม่ได้ลบ)
            // { name: "ประวัติ", link: "/about/history" },
            { name: "ทีมแพทย์", link: "/about/doctor" },
            /*{ name: "ข้อมูลความปลอดภัยด้านยา", link: "/about" },*/
        ],
    },
    {
        id: 3,
        name: "ITA",
        link: "/ita/",
    },
    {
        id: 5,
        name: "ข่าวสาร",
        submenu: [
            { name: "ประชาสัมพันธ์", link: "/news", search: { tab: "general" } },
            { name: "รับสมัครงาน", link: "/news", search: { tab: "job" } },
            { name: "จัดซื้อพัสดุ", link: "/news", search: { tab: "procurement" } },
        ],
    },
    {
        id: 6,
        name: "เอกสาร",
        link: "/document/",
    },
    {
        id: 7,
        name: "แจ้งเรื่องร้องเรียน",
        link: "https://docs.google.com/forms/d/e/1FAIpQLSf-eXzBupBhvbSV38ODgt41RCn9zEA6DdBP5FcJtpG9yAtddA/viewform?usp=send_form",
    },
];