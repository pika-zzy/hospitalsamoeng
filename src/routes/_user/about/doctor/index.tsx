import { Button } from '@/components/ui/button'
import { Card, CardDescription,  CardHeader, CardTitle } from '@/components/ui/card'
import { departments, personnelData } from '@/interface/employee'
import { createFileRoute } from '@tanstack/react-router'
import {  Stethoscope, User, ChevronRight, MenuIcon, X } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_user/about/doctor/')({
component: RouteComponent,
})

function RouteComponent() {
const [activeTab, setActiveTab] = useState(departments[0].id)
const filteredPersonnel = personnelData.filter(person => person.deptId === activeTab)
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">ทำเนียบบุคลากรทางการแพทย์</h2>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            ทำความรู้จักกับทีมแพทย์และบุคลากรผู้เชี่ยวชาญที่พร้อมดูแลคุณ
        </p>
        </div>

        {/* -----------------------------------------------------
            Main Layout: แบ่ง 2 ฝั่ง (Sidebar ซ้าย / Cards ขวา) 
            ----------------------------------------------------- */}
        <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 1. Sidebar Section */}
<div className="w-full lg:w-72 shrink-0">
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col gap-1 lg:sticky lg:top-8">
    
    {/* ส่วนหัวของ Sidebar (ปรับใช้ flex เพื่อแยกซ้าย-ขวา) */}
    <div className="flex items-center justify-between px-3 pt-2 pb-3 border-b mb-2">
    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        หมวดหมู่แผนก
    </h3>
    
    {/* ปุ่มเปิด/ปิดเมนูมือถือ (แสดงเฉพาะหน้าจอเล็ก) */}
    <Button
        variant="ghost" // ถ้าใช้ shadcn แนะนำให้ใส่ variant ghost เพื่อไม่ให้มีพื้นหลังทึบ
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden h-8 w-8 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
    >
        {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
    </Button>
    </div>

    {/* ส่วนรายชื่อแผนก 
        - จอมือถือ: จะถูกซ่อนไว้ (hidden) และแสดง (flex) เมื่อ isMobileMenuOpen เป็น true
        - จอคอม (lg): จะแสดงเสมอ (lg:flex) 
    */}
    <div className={`flex-col gap-1 ${isMobileMenuOpen ? `flex` : `hidden`} lg:flex`}>
    {departments.map((dept) => {
        const isActive = activeTab === dept.id
        return (
        <button
            key={dept.id}
            onClick={() => {
            setActiveTab(dept.id)
            setIsMobileMenuOpen(false) // พอกดเลือกแผนกปุ๊บ ให้ปิดเมนูมือถืออัตโนมัติ
            }}
            className={`
            w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between
            ${isActive 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }
            `}
        >
            {dept.name}
            {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
        </button>
        )
    })}
    </div>

</div>
</div>
        {/* 2. Cards Section (ส่วนการ์ดด้านขวาตามรูป) */}
        <div className="flex-1">
            <div  className={`grid gap-6 ${
    filteredPersonnel.length === 1
    ? 'grid-cols-1 justify-center'
    : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
}`}>
            {filteredPersonnel.length > 0 ? (
                filteredPersonnel.map((person) => (
                <Card key={person.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-2xl cursor-pointer bg-white ">
                    
                    {/* ส่วนรูปภาพ */}
                    <div className="px-6 pt-6 flex flex-col items-center">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-50 shadow-sm bg-gray-100 flex items-center justify-center">
                        {person.imageUrl ? (
                            <img 
                            src={person.imageUrl} 
                            alt={person.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <User className="w-12 h-12 text-gray-400" />
                        )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-white text-white">
                        <Stethoscope className="w-4 h-4" />
                        </div>
                    </div>
                    </div>

                    {/* ส่วนหัว (ชื่อและตำแหน่ง) */}
                    <CardHeader className="text-center justify-items-center pt-4 pb-0">
                    <CardTitle className="text-xl">
                        {person.prefix} {person.name}
                    </CardTitle>
                    <CardDescription className="text-blue-600 font-medium mt-1">
                        {person.specialty}
                    </CardDescription>
                    </CardHeader>

                    {/* ส่วนเนื้อหา (เวลาออกตรวจ) 
                    <CardContent className="border-t mx-6 px-0 pt-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-start text-left gap-3">
                        <Calendar className="w-5 h-5 mt-0.5 text-gray-400 shrink-0" />
                        <span>
                        <strong className="font-semibold text-gray-800">เวลาออกตรวจ:</strong><br/>
                        {person.schedule}
                        </span>
                    </div>
                    </CardContent> 
                    */}

                    {/* ส่วนท้าย (ปุ่ม Action) 
                    <CardFooter className="pb-6">
                    <button className="w-full py-2.5 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4" />
                        ดูตารางแพทย์
                    </button>
                    </CardFooter>
                    */}
                </Card>
                ))
            ) : (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                <User className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg">ยังไม่มีข้อมูลบุคลากรในแผนกนี้</p>
                </div>
            )}
            </div>
        </div>

        </div>
    </div>
    </div>
)
}