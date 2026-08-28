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
    /**
     * true = เอา "หน้าเนื้อหา" ที่สร้างจาก /admin/content มาต่อท้าย submenu ให้เอง
     * (Navbar เป็นคนไปดึง GET /content/sections มาต่อ ดู useNavbarList)
     *
     * ที่ต้องมีเพราะ: หน้าเนื้อหาสร้างเพิ่มได้จากหลังบ้าน ถ้าเมนูเป็นโค้ดล้วน
     * หน้าที่เพิ่งสร้างจะเข้าได้เฉพาะคนที่รู้ URL — เท่ากับสร้างแล้วไม่มีใครหาเจอ
     */
    appendContentSections?: boolean;
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
        appendContentSections: true,
        submenu: [
            // ซ่อนชั่วคราว: หน้า /about/history ยังไม่มีเนื้อหาประวัติจริงของโรงพยาบาลสะเมิง
            // ได้เนื้อหามาแล้วเอาบรรทัดนี้กลับมา (route ยังอยู่ ไม่ได้ลบ)
            // { name: "ประวัติ", link: "/about/history" },
            { name: "ทีมแพทย์", link: "/about/doctor" },
            // หน้าเนื้อหา (ความปลอดภัยด้านยา / ชมรมจริยธรรม / PDPA / ที่สร้างเพิ่มทีหลัง)
            // **ไม่ต้องเขียนไว้ตรงนี้** — appendContentSections ดึงจาก DB มาต่อให้เอง
            //
            // เคยเขียนไว้เป็น fallback ตอน backend ล่ม แล้วถอดออก 2026-08-28:
            // มันทำให้เมนูมี "ความจริง 2 ชุด" ที่ไม่ตรงกัน — ลบหน้าในหลังบ้านแล้วเมนูยังโชว์
            // ลิงก์ตาย · เปลี่ยนชื่อหน้าแล้วเมนูยังเป็นชื่อเก่า · ตั้ง slug ไม่ตรงแล้วขึ้น 2 อัน
            // ส่วนเหตุผลเดิมก็อ่อน: backend ล่มทีข่าว/กิจกรรม/ITA ก็ตายหมดทั้งเว็บอยู่แล้ว
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