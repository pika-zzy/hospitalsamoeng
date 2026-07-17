// interface/staffmenu.ts
// mirror ของ model.Menu ฝั่ง backend (endpoint /menu) — "เมนูบริการเจ้าหน้าที่"
// NOTE: ตั้งชื่อ StaffMenu ไม่ใช่ Menu เพราะ interface/menu.ts ถูกใช้เป็นเมนู navbar สาธารณะอยู่แล้ว
// NOTE: model นี้ไม่ embed gorm.Model → json key เป็น "id" ตัวเล็ก (ต่าง จาก HeroSlide/ITA ที่เป็น "ID")

export interface StaffMenu {
    id: number;
    menu_name: string;
    description: string;
    link: string;
    icon: string;
    color: string;
    created_at: string;
    updated_at: string;
}

// body ที่ POST /menu และ PUT /menu/:id รับ (backend ไม่อ่าน id/timestamp จาก body)
export type StaffMenuPayload = Omit<StaffMenu, "id" | "created_at" | "updated_at">;
