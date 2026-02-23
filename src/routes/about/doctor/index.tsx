import { Card } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { Phone } from 'lucide-react'

import aumnoykarn from "@/assets/aumnoykarn.jpg";
import pad2 from "@/assets/pad2.jpg";
import pad3 from "@/assets/pad3.jpg";
import pad4 from "@/assets/pad4.jpg";
import type { Employee } from '@/interface/employee';

const sampleEmployees: Employee[] = [
    { id: 1, name: "นายฐิติกานต์ ณ ปั่น", position: "ผู้อำนวยการโรงพยาบาล", imgUrl: aumnoykarn, contactInfo: "053-xxx-xxx", role: "Director" },
    { id: 2, name: "พญ. สมศรี รักเรียน", position: "กุมารแพทย์", imgUrl: pad2, contactInfo: "ต่อ 102", role: "Doctor" },
    { id: 3, name: "นพ. สมชาย สายเฮลตี้", position: "อายุรแพทย์", imgUrl: pad3, contactInfo: "ต่อ 105", role: "Doctor" },
    { id: 4, name: "พญ. วันดี มีสุข", position: "วิสัญญีแพทย์", imgUrl: pad4, contactInfo: "ต่อ 108", role: "Doctor" },
];

export const Route = createFileRoute('/about/doctor/')({
    component: RouteComponent,
})


function RouteComponent() {
    const directors = sampleEmployees.filter(e => e.role === "Director");
    const doctors = sampleEmployees.filter(e => e.role !== "Director");

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* หัวข้อหน้า */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 inline-block pb-2">
                        ผังบุคลากรทางการแพทย์
                    </h1>
                </div>

                {/* ระดับที่ 1: ผู้อำนวยการ (ตรงกลาง) */}
                <div className="flex justify-center mb-16 relative">
                    {/* เส้นเชื่อมโยง (ขีดลงมา) */}
                    <div className="absolute h-16 w-1 bg-gray-300 -bottom-16 left-1/2 -translate-x-1/2 hidden md:block m"></div>
                    
                    {directors.map((director) => (
                        <Card key={director.id} className="w-72 bg-white border-2 border-green-100 shadow-sm p-0 overflow-hidden text-center">
                            <div className="bg-green-600 py-2 text-white text-sm font-bold">ผู้อำนวยการ</div>
                            <div className="p-4">
                                <img src={director.imgUrl} alt={director.name} className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-gray-50 mb-4" />
                                <h2 className="text-lg font-bold text-gray-800">{director.name}</h2>
                                <p className="text-sm text-gray-600 mb-2">{director.position}</p>
                                <div className="flex items-center justify-center gap-2 text-xs text-green-700 font-medium">
                                    <Phone className="w-3 h-3" /> {director.contactInfo}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* ระดับที่ 2: ทีมแพทย์/บุคลากร */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
                    {doctors.map((employee) => (
                        <Card key={employee.id} className="bg-white border border-gray-200 shadow-sm p-0 overflow-hidden text-center hover:border-green-400 transition-colors">
                            {/* แถบสีระบุบทบาทด้านบนเล็กน้อย */}
                            <div className="h-1.5 bg-green-500 w-full" />
                            <div className="p-6">
                                <img src={employee.imgUrl} alt={employee.name} className="w-32 h-32 mx-auto rounded-full object-cover border-2 border-gray-100 mb-4" />
                                <h3 className="text-md font-bold text-gray-800">{employee.name}</h3>
                                <p className="text-sm text-gray-500 mb-3">{employee.position}</p>
                                <p className="text-[11px] text-gray-400 bg-gray-50 py-1 rounded-full uppercase font-bold">
                                    {employee.role}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Footer จบผัง */}
                <div className="mt-20 text-center text-gray-400 text-sm">
                    <p>โรงพยาบาลสะเมิง จังหวัดเชียงใหม่</p>
                </div>

            </div>
        </div>
    )
}