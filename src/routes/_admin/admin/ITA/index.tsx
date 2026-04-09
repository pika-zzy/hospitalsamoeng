import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { ItaCreat } from '@/interface/create_ita'
import { requestAPI } from '@/lib/api'
import { useMutation} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useRef, useState } from 'react'

export const Route = createFileRoute('/_admin/admin/ITA/')({
  component: RouteComponent,
})

function RouteComponent() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    file: null as File | null,
  })
  const addITA = useMutation({
      mutationFn: async (data: ItaCreat) => {
        const submitData = new FormData()
        submitData.append('title', data.title)
        submitData.append('year', data.year)
        if (data.file) {
          submitData.append('file', data.file); // ส่งไฟล์ไปในชื่อ 'file'
        }
       
  
        return requestAPI({
          url: "/ita/upload",
          method: "POST",
          body: submitData,
        })
      },
      onSuccess: () => {
        setFormData({
          title: '',
          year: '',
          file: null,
        })
      },
    })

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <>
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
            addITA.mutate(formData);
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
              placeholder="เช่น งาน ITA ประจำปี..."
            />
          </div>

          {/* ปี */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">ปี</Label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="เช่น 2567"
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
          

          {/* ปุ่ม Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={addITA.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              {addITA.isPending ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
