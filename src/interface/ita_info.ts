// interface/ita_info.ts

export  interface ITAInfo {
  id: number;
  title: string;      // ชื่อเอกสาร เช่น "โครงสร้างองค์กร"
  file_url: string;   // path ไฟล์ PDF เช่น "/uploads/ita/file.pdf"
  year: number;       // ปี พ.ศ. เช่น 2568
  category: string;   // หมวดหมู่ เช่น "ข้อมูลพื้นฐาน", "การป้องกันการทุจริต"
  order: number;      // ลำดับในหมวด เช่น 1, 2, 3
}