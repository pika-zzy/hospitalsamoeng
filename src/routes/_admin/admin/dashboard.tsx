import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { 
  Plus, 
  FileText, 
  Calendar, 
  Megaphone, 
  Users, 
  LogOut, 
  ChevronRight 
} from 'lucide-react'

export const Route = createFileRoute('/_admin/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const handleLogout = () => {
  localStorage.removeItem("admin_token")
  navigate({ to: "/admin/login", replace: true })
}
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 1. Navbar: เรียบง่าย มีแค่ Logo และ User Profile */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-lg font-semibold text-gray-800 tracking-tight">Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">สวัสดี, Admin</span>
            <Button className="p-2 text-gray-400 hover:text-red-500 transition-colors" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ภาพรวมระบบ</h1>
          <p className="text-gray-500 mt-1">จัดการข่าวสารและกิจกรรมทั้งหมดได้จากที่นี่</p>
        </div>

        {/* 3. Action Grid: ปุ่มเมนูหลัก (เน้นใหญ่ กดง่าย) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: เพิ่มข่าว (Link ไปหน้า form ที่ทำก่อนหน้านี้) */}
          <Link 
            to="/admin/news" // แก้เป็น path ของหน้าฟอร์มข่าวที่คุณทำไว้
            className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Megaphone className="w-24 h-24 text-blue-600" />
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">เพิ่มข่าวประชาสัมพันธ์</h3>
              <p className="text-sm text-gray-500 mt-1">ประกาศข่าว จัดซื้อจัดจ้าง หรือแจ้งเตือนต่างๆ</p>
            </div>
            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
              สร้างโพสต์ใหม่ <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: เพิ่มกิจกรรม */}
          <Link to='/admin/activity'>
          <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar className="w-24 h-24 text-green-600" />
            </div>
            <div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">เพิ่มกิจกรรมใหม่</h3>
              <p className="text-sm text-gray-500 mt-1">ลงรูปกิจกรรม ปฏิทินงาน หรือโครงการ</p>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
              สร้างกิจกรรม <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          </Link>

          {/* Card 3: สรุปข้อมูล (Stat) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center h-48">
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">สถิติวันนี้</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">ข่าวทั้งหมด</span>
              </div>
              <span className="text-xl font-bold text-gray-900">124</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">ผู้เข้าชม (เดือนนี้)</span>
              </div>
              <span className="text-xl font-bold text-gray-900">1,024</span>
            </div>
          </div>

        </div>

        {/* 4. Recent Section: รายการล่าสุด (แบบย่อ) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">รายการล่าสุด</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">ดูทั้งหมด</button>
          </div>
          <div className="divide-y divide-gray-100">
            {/* Mock Data Row 1 */}
            <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">เปิดรับสมัครฉีดวัคซีนป้องกันโรคพิษสุนัขบ้า</p>
                  <p className="text-xs text-gray-500">วันนี้ 10:30 น. • ประชาสัมพันธ์</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">เผยแพร่แล้ว</span>
            </div>
            
            {/* Mock Data Row 2 */}
            <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center text-green-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">กิจกรรมวันเด็กแห่งชาติ 2568</p>
                  <p className="text-xs text-gray-500">เมื่อวานนี้ • กิจกรรม</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">เผยแพร่แล้ว</span>
            </div>

            {/* Empty State (ถ้าไม่มีข้อมูล) - เลือกใช้ได้ */}
            {/* <div className="p-8 text-center text-gray-400">ยังไม่มีรายการล่าสุด</div> */}
          </div>
        </div>

      </main>
    </div>
  )
}