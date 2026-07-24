// interface/hero.ts
// mirror ของ model.HeroSlide ฝั่ง backend (embed gorm.Model → ID เป็นตัวใหญ่ เหมือน ITA)

export interface HeroSlide {
    ID: number;
    image_url: string;
    order: number;
    // ข้อความ overlay ต่อสไลด์ (admin แก้เอง) — show_text=false = โชว์แค่รูป
    badge: string;
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    show_text: boolean;
}
