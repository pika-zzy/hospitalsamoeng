// interface/newinfo.ts

export interface NewInfo {
    id: number;
    title: string;
    description: string;
    date: string;
    type: string;
    imgUrl?: string; // เก็บไว้เผื่อใช้เป็นหน้าปก (Thumbnail)
    fileUrl?: string; // เพิ่มฟิลด์นี้สำหรับลิงก์ไฟล์เอกสาร เช่น PDF
}
