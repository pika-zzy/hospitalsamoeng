// รูปเพิ่มเติมของกิจกรรม (ตาราง activity_images ฝั่ง backend)
// ไม่รวมรูปปก — ปกอยู่ที่ ActivityInfo.img_url ตัวเดียวเหมือนเดิม
export interface ActivityImage {
    id: number;
    activity_id: number;
    img_url: string;
    sort_order: number;
}

// เพดานรูปต่อกิจกรรม **นับรวมรูปปกแล้ว** — ต้องตรงกับ model.MaxActivityImages ฝั่ง Go
// (backend เป็นคนบังคับจริง ค่านี้ใช้กันไม่ให้ UI ปล่อยให้เลือกเกินแล้วโดนปฏิเสธทีหลัง)
export const MAX_ACTIVITY_IMAGES = 12;

export default interface ActivityInfo {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    img_url: string;
    // backend preload มาให้ทุก endpoint ของ activity — เรียงตาม sort_order แล้ว
    images?: ActivityImage[];
}
