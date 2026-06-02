import { Label } from '@/components/ui/label'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/staffservice/')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
    <>
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-500">เพิ่มเมนูสำหรับเจ้าหน้าที่</h1>
                {/* ส่วนบน: หัวข้อ */}

        </div>
        <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">เพิ่มชื่อเมนู</Label>
            <input
                type="text"
                name="title"
                value={""}    
                onChange={ () => {} }
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                placeholder="ชื่อเมนู "
            />
        </div>
        <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">คำอธิบายเมนู</Label>
            <input
                type="text"
                name="description"
                value={""}    
                onChange={ () => {} }
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                placeholder="คำอธิบายเมนู "
            />
        </div>
        <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">เพิ่มลิ้งเว็บไซต์</Label>
            <input
                type="text"
                name="website"
                value={""}    
                onChange={ () => {} }
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                placeholder="ลิ้งเว็บไซต์ "
            />
        </div>
        <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">เลือกไอคอนเมนู</Label>
            <select
                name="category"
                value={""}
                onChange={() => {}}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            >
                <option value="" disabled>เลือกหมวดหมู่</option>
                <option value="health">สุขภาพ</option>
                <option value="education">การศึกษา</option>
                <option value="entertainment">ความบันเทิง</option>
            </select>
        </div>
        <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
            เพิ่มเมนู
        </button>

    </>
  )
}
