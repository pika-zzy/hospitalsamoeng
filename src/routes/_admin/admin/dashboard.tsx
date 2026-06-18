import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { 
  Plus, 
  FileText, 
  Calendar, 
  Megaphone, 
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
          <Link to={'/admin/ITA'}>
            <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-24 h-24 text-gray-600" />
            </div>
            <div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">เพิ่มงาน ITA</h3>
              <p className="text-sm text-gray-500 mt-1">เพิ่มงาน ITA เป็นไฟล์ .pdf </p>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
              ลงงาน ITA <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
            </div>
          </Link>
          <Link to={'/admin/moit'}>
            <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-24 h-24 text-gray-600" />
            </div>
            <div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">เพิ่มหัวข้อ MOIT</h3>
              <p className="text-sm text-gray-500 mt-1">เพิ่มหัวข้อย่อยของ MOIT </p>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
              เพิ่มหัวข้อ MOIT <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
            </div>
          </Link>
          <Link to={'/admin/staffservice'}>
            <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-24 h-24 text-gray-600" />
            </div>
            <div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">เพิ่มเมนูสำหรับเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-500 mt-1">เพิ่มเมนูสำหรับแสดงบนระบบบริการเจ้าหน้าที่</p>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
              เพิ่มเมนูสำหรับเจ้าหน้าที่ <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}