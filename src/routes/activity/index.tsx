import { Card } from '@/components/ui/card'
import { sampleActivities } from '@/interface/activity_info'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/activity/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();
    return (
        <>
            <div className="min-h-screen bg-slate-50 py-12">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 tracking-tight">
                        คลังกิจกรรม <span className="text-green-600">ทั้งหมด</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        รวบรวมภาพบรรยากาศ ความประทับใจ และการดำเนินงานด้านต่างๆ 
                        เพื่อส่งเสริมสุขภาพและความสุขของพี่น้องชาวสะเมิง
                    </p>
                    <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full shadow-sm shadow-green-200"></div>
                </div>

                {/* Gallery Grid */}
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {sampleActivities.map((activity) => (
                            <Card
                                key={activity.id}
                                onClick={() => navigate({ to: `/activity/${activity.id}` })}
                                className="group relative h-100 rounded-[2.5rem] overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out"
                            >
                                {/* Main Image */}
                                <img
                                    src={activity.imgUrl}
                                    alt={activity.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Smart Gradient Overlay: โชว์ข้อมูลแบบโปร่งแสง */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Content on Image */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="inline-block px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full mb-3 uppercase tracking-wider shadow-lg shadow-green-900/20">
                                        {activity.type}
                                    </span>
                                    <h2 className="text-white text-xl font-bold leading-tight mb-2 drop-shadow-md">
                                        {activity.name}
                                    </h2>
                                    
                                    {/* ส่วนที่โผล่มาตอน Hover */}
                                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                                        <p className="text-gray-300 text-xs line-clamp-2 font-light leading-relaxed mb-4">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center text-green-400 text-[10px] font-bold uppercase tracking-widest">
                                            อ่านรายละเอียด <span className="ml-2">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
