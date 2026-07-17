// interface/hero.ts
// mirror ของ model.HeroSlide ฝั่ง backend (embed gorm.Model → ID เป็นตัวใหญ่ เหมือน ITA)

export interface HeroSlide {
    ID: number;
    image_url: string;
    order: number;
}
