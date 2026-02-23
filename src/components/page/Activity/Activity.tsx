import { Card } from "@/components/ui/card";
import { sampleActivities } from "@/interface/activity_info";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Tag, ArrowRight } from "lucide-react"; // แนะนำให้ใช้ lucide-react เพิ่มความพรีเมียม

const activities = [...sampleActivities]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 4);

export default function Activity() {
    const navigate = useNavigate();

    const statusMap = {
        'active': { text: 'เปิดรับสมัคร', color: 'bg-green-100 text-green-700' },
        'inactive': { text: 'ปิดรับสมัคร', color: 'bg-gray-100 text-gray-600' },
        'completed': { text: 'เสร็จสิ้นแล้ว', color: 'bg-blue-100 text-blue-700' }
    };

    const typeMap = {
        'health': 'สุขภาพ',
        'charity': 'การกุศล',
        'education': 'การศึกษา',
        'environment': 'สิ่งแวดล้อม',
        'fitness': 'การออกกำลังกาย'
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-10">
                <div className="border-l-4 border-green-500 pl-4">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">กิจกรรมล่าสุด</h1>
                    <p className="text-gray-500 text-sm mt-1">ภาพบรรยากาศและกิจกรรมต่างๆ ของโรงพยาบาล</p>
                </div>
                <button 
                    onClick={() => navigate({ to: '/activity' })}
                    className="hidden md:flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors group"
                >
                    ดูทั้งหมด 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Grid Layout - ปรับจาก 2 เป็น 4 ในจอใหญ่ หรือ 2 ในจอกลาง */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activities.map((activity) => (
                    <Card 
                        key={activity.id} 
                        className="group flex flex-col bg-white rounded-3xl overflow-hidden border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                        onClick={() => navigate({ to: `/activity/${activity.id}` })}
                    >
                        {/* Image Wrap */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={activity.imgUrl}
                                alt={activity.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Status Tag Overlay */}
                            <div className="absolute top-3 right-3">
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-sm ${statusMap[activity.status]?.color || 'bg-gray-100'}`}>
                                    {statusMap[activity.status]?.text}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase tracking-wider mb-2">
                                <Tag className="w-3 h-3" />
                                {typeMap[activity.type as keyof typeof typeMap] || 'ไม่ระบุประเภท'}
                            </div>
                            
                            <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                                {activity.name}
                            </h2>
                            
                            <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                                {activity.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(activity.startDate).toLocaleDateString("th-TH", {
                                        day: "numeric",
                                        month: "short",
                                        year: "2-digit"
                                    })}
                                </div>
                                <span className="group-hover:text-green-600 font-bold">อ่านต่อ</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-10 md:hidden flex justify-center">
                <button className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl">
                    ดูข่าวสารและกิจกรรมทั้งหมด
                </button>
            </div>
        </div>
    );
}