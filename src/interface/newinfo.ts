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
