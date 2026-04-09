import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { requestAPI } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { CloudUpload, X } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">เพิ่มข่าวสารสำหรับเว็บไซต์</h2>
            <p className="text-sm text-gray-500 mt-1">กรอกข้อมูลเพื่อประกาศข่าวสารใหม่ลงบนหน้าเว็บไซต์</p>
          </div>
          {/* Icon ตกแต่งเล็กน้อย (Optional) */}
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addnews.mutate(formData);
          }}
          className="p-8 space-y-6"
        >
          {/* ส่วนบน: หัวข้อ */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">หัวข้อข่าว</Label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="เช่น แจ้งกำหนดการฉีดวัคซีนประจำปี..."
            />
          </div>

          {/* Grid: ประเภท และ วันที่ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">ประเภทข่าว</Label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">-- เลือกประเภท --</option>
                  <option value="ประชาสัมพันธ์">📢 ประชาสัมพันธ์</option>
                  <option value="ประกาศจัดซื้อจัดจ้าง">📑 ประกาศจัดซื้อจัดจ้าง</option>
                </select>
                {/* Custom Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">วันที่เผยแพร่</Label>
              {/* Type date: เลือกจากปฏิทินได้ และพิมพ์เองได้ */}
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700"
              />
              <p className="text-xs text-gray-400">รูปแบบ: วว/ดด/ปปปป หรือเลือกจากปฏิทิน</p>
            </div>
          </div>

          {/* รายละเอียด */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">รายละเอียดเนื้อหา</Label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="กรอกรายละเอียดข่าวสารที่นี่..."
            />
          </div>

          {/* อัปโหลดไฟล์ */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">ไฟล์แนบ (PDF)</Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {formData.file ? (
                     // แสดงชื่อไฟล์เมื่อเลือกแล้ว
                     (<div className="text-center relative w-full">
                       <svg className="w-8 h-8 mb-2 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <p className="text-sm text-gray-900 font-medium">{formData.file.name}</p>
                       <p className="text-xs text-gray-500">พร้อมอัปโหลด</p>
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
                      <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <p className="text-sm text-gray-500"><span className="font-semibold text-blue-600">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง</p>
                      <p className="text-xs text-gray-400 mt-1">เฉพาะไฟล์ .PDF เท่านั้น</p>
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
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-gray-700">รูปภาพหน้าปกกิจกรรม</Label>
            {formData.img ? (
              <div className="relative w-full aspect-video md:aspect-21/9 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                <img src={URL.createObjectURL(formData.img)} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 rounded-full h-8 w-8 opacity-90 hover:opacity-100 shadow-md"
                  onClick={() => setFormData({ ...formData, img: null })}
                >
                  <X className="h-4 w-4 bg-red-500  " />
                </Button>
              </div>
            ) : (
              <label 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-green-50/50 hover:border-green-400 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudUpload className="w-7 h-7 text-gray-400 mb-2" strokeWidth={1.5} />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-green-600">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                  </p>
                  <p className="text-[13px] text-gray-400 mt-1">
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

          {/* ปุ่ม Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={addnews.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              {addnews.isPending ? 'กำลังบันทึก...' : 'บันทึกข้อมูลข่าว'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}