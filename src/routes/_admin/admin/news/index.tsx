import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { requestAPI } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, ChevronDown, CloudUpload, X } from 'lucide-react';
import { useRef, useState } from 'react';

export const Route = createFileRoute('/_admin/admin/news/')({
  component: RouteComponent,
});

function RouteComponent() {
  // 1. State สำหรับเก็บข้อมูล
  // เปลี่ยน fileUrl เป็น file object เพื่อรองรับการอัพโหลดจริง
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Default เป็นวันปัจจุบัน (Format YYYY-MM-DD)
    type: '',
    file: null as File | null, // เก็บไฟล์ .pdf
    img : null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // เพิ่ม function สำหรับจัดการไฟล์โดยเฉพาะ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    alert("อัปโหลดได้เฉพาะ PDF");
    return;
  }

  setFormData({
    ...formData,
    file: file,
  });
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setFormData({
      ...formData,
      img: e.target.files[0],
    });
  }
};

  const addnews = useMutation({
    mutationFn: async (data: typeof formData) => {
      // *สำคัญ* : การส่งไฟล์ต้องใช้ FormData แทน JSON
      const submitData = new FormData();
      submitData.append('title', data.title);
      submitData.append('description', data.description);
      submitData.append('date', data.date);
      submitData.append('type', data.type);
      if (data.file) {
        submitData.append('file', data.file); // ส่งไฟล์ไปในชื่อ 'file'
      }
      if (data.img) {
        submitData.append('image', data.img);
      }

      return requestAPI({
      url: "/news",
      method: "POST",
      body: submitData,
    });
  },
  onSuccess: () => {
    alert('✅ บันทึกข่าวสำเร็จ!');
  },
  
  });

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto w-full text-ink">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">เพิ่มข่าวประชาสัมพันธ์</h1>
        <p className="text-sm mt-1 text-muted">กรอกข้อมูลเพื่อประกาศข่าวสารใหม่ลงบนหน้าเว็บไซต์</p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addnews.mutate(formData);
        }}
        className="rounded-md border border-line bg-white p-6 sm:p-8 space-y-6"
      >
        {/* ส่วนบน: หัวข้อ */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted">หัวข้อข่าว</Label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
            placeholder="เช่น แจ้งกำหนดการฉีดวัคซีนประจำปี..."
          />
        </div>

        {/* Grid: ประเภท และ วันที่ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">ประเภทข่าว</Label>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full appearance-none px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20 cursor-pointer"
              >
                <option value="">-- เลือกประเภท --</option>
                <option value="ประชาสัมพันธ์">📢 ประชาสัมพันธ์</option>
                <option value="ประกาศจัดซื้อจัดจ้าง">📑 ประกาศจัดซื้อจัดจ้าง</option>
              </select>
              {/* Custom Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-faint">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted">วันที่เผยแพร่</Label>
            {/* Type date: เลือกจากปฏิทินได้ และพิมพ์เองได้ */}
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
            <p className="text-xs text-faint">รูปแบบ: วว/ดด/ปปปป หรือเลือกจากปฏิทิน</p>
          </div>
        </div>

        {/* รายละเอียด */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted">รายละเอียดเนื้อหา</Label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 rounded-sm border border-line bg-white text-ink outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20 resize-none"
            placeholder="กรอกรายละเอียดข่าวสารที่นี่..."
          />
        </div>

        {/* อัปโหลดไฟล์ */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted">ไฟล์แนบ (PDF)</Label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-line rounded-sm cursor-pointer bg-paper/50 hover:bg-paper hover:border-teal transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {formData.file ? (
                   // แสดงชื่อไฟล์เมื่อเลือกแล้ว
                   (<div className="text-center relative w-full">
                     <CheckCircle2 className="w-8 h-8 mb-2 text-teal mx-auto" />
                     <p className="text-sm text-ink font-medium">{formData.file.name}</p>
                     <p className="text-xs text-muted">พร้อมอัปโหลด</p>
                     <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-3 right-3 rounded-full h-8 w-8"
                        onClick={() => {
                          setFormData({ ...formData, file: null });

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                   </div>)
                ) : (
                  // ยังไม่เลือกไฟล์
                  (<>
                    <CloudUpload className="w-7 h-7 text-faint mb-2" strokeWidth={1.5} />
                    <p className="text-sm text-muted"><span className="font-semibold text-teal">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง</p>
                    <p className="text-xs text-faint mt-1">เฉพาะไฟล์ .PDF เท่านั้น</p>
                  </>)
                )}
              </div>
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted">รูปภาพหน้าปกข่าว</Label>
          {formData.img ? (
            <div className="relative w-full aspect-video md:aspect-21/9 rounded-sm overflow-hidden border border-line group">
              <img src={URL.createObjectURL(formData.img)} alt="Preview" className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 rounded-full h-8 w-8 opacity-90 hover:opacity-100 shadow-md"
                onClick={() => setFormData({ ...formData, img: null })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-line rounded-sm cursor-pointer bg-paper/50 hover:bg-paper hover:border-teal transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudUpload className="w-7 h-7 text-faint mb-2" strokeWidth={1.5} />
                <p className="text-sm text-muted">
                  <span className="font-semibold text-teal">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                </p>
                <p className="text-xs text-faint mt-1">
                  PNG, JPG ขนาดไม่เกิน 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* ปุ่ม */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-1/3 h-12 rounded-sm border-line text-muted hover:bg-paper font-medium"
            onClick={() => window.history.back()}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={addnews.isPending}
            className="w-2/3 h-12 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors"
          >
            {addnews.isPending ? 'กำลังบันทึก...' : 'บันทึกข้อมูลข่าว'}
          </Button>
        </div>
      </form>
    </div>
  )
}