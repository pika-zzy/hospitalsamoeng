// interface/newinfo.ts

export interface NewsInfo {
    id: number;
    title: string;
    description: string;
    date: string;
    type: string;
    file_url?: string; // เพิ่มฟิลด์นี้สำหรับลิงก์ไฟล์เอกสาร เช่น PDF
    img_url? : string
}

// ประเภทข่าว + แท็บฝั่ง public — ประกาศไว้ที่เดียวตรงนี้เท่านั้น
//   key  = ค่าใน URL (?tab=) ของหน้า /news
//   type = ค่าที่เก็บจริงในคอลัมน์ News.Type ของ DB
// เพิ่ม/แก้ประเภทข่าวให้แก้ที่นี่ที่เดียว แล้ว dropdown ฝั่ง admin กับแท็บฝั่ง public
// จะตามให้เอง (หน้าไหนลืม map สไตล์ของ key ใหม่ TypeScript จะ error ให้ ไม่พังเงียบ)
export const NEWS_TABS = [
    { key: 'general', type: 'ประชาสัมพันธ์', label: 'ประชาสัมพันธ์' },
    { key: 'job', type: 'รับสมัครงาน', label: 'รับสมัครงาน' },
    { key: 'procurement', type: 'จัดซื้อพัสดุ', label: 'จัดซื้อพัสดุ' },
] as const;

export type NewsTabKey = (typeof NEWS_TABS)[number]['key'];
export type NewsType = (typeof NEWS_TABS)[number]['type'];

// ตัวเลือกใน dropdown ประเภทข่าวฝั่ง admin (หน้าเพิ่มข่าว + modal แก้ข่าว)
export const NEWS_TYPES: readonly NewsType[] = NEWS_TABS.map((t) => t.type);
