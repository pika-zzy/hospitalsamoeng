import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader } from "@/components/ui/card";

const newsInfo = [
  {
    id: 1,
    title: "รับสมัครพยาบาลวิชาชีพ",
    description: "โรงพยาบาลสะเมิงเปิดรับสมัครพยาบาลวิชาชีพ จำนวน 2 อัตรา ตั้งแต่วันที่ 1–15 กุมภาพันธ์ 2568",
    date: "2025-02-01",
    type: "job",
    link: "/news/1"
  },
  {
    id: 2,
    title: "ปิดปรับปรุงระบบเวชระเบียน",
    description: "งดให้บริการระบบเวชระเบียนชั่วคราว ในวันที่ 5 กุมภาพันธ์ 2568 เวลา 18.00–22.00 น.พะัพะัพะัพะัพะัพะัพะัพะ",
    date: "2025-01-28",
    type: "general",
    link: "/news/2"
  },
  {
    id: 3,
    title: "รับสมัครนักวิชาการคอมพิวเตอร์",
    description: "ประกาศรับสมัครตำแหน่งนักวิชาการคอมพิวเตอร์ 1 อัตรา สังกัดกลุ่มงานเทคโนโลยีสารสนเทศ",
    date: "2025-02-03",
    type: "job",
    link: "/news/3"
  },
  {
    id: 4,
    title: "ฉีดวัคซีนไข้หวัดใหญ่ฟรี",
    description: "โรงพยาบาลสะเมิงให้บริการฉีดวัคซีนไข้หวัดใหญ่ฟรีสำหรับผู้สูงอายุ 60 ปีขึ้นไปัพัพัพัพัพะัพะัพัพะัพะัพะัพ",
    date: "2025-01-20",
    type: "general",
    link: "/news/4"
  },
  {
    id: 5,
    title: "รับสมัครพนักงานบริการ",
    description: "เปิดรับสมัครพนักงานบริการ (รายวัน) จำนวน 3 อัตรา สมัครได้ที่กลุ่มงานบริหารทั่วไป",
    date: "2025-01-30",
    type: "job",
    link: "/news/5"
  },
  {
    id: 6,
    title: "เปลี่ยนแปลงเวลาให้บริการคลินิก",
    description: "ตั้งแต่เดือนมีนาคม 2568 คลินิกโรคเรื้อรังปรับเวลาให้บริการเป็น 08.00–16.00 น.พะัพัพัพัพัพัพัพัพัพะัพัพัพัพ",
    date: "2025-01-18",
    type: "general",
    link: "/news/6"
  }
];

const jobNews = newsInfo.filter(n => n.type === "job");
const generalNews = newsInfo.filter(n => n.type === "general");

const latestJob = [...jobNews]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

const latestGeneral = [...generalNews]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);



export default function News_page (){
    return (
       <>
  {/* Header Section */}
  <div className="max-w-7xl mx-auto px-4 mb-10 border-l-8 border-green-500 pl-6 py-2">
    <h2 className="text-4xl font-black text-gray-800 tracking-tight">
      ข่าวสาร / <span className="text-green-500">ประกาศ</span>
    </h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto mb-10 px-4">
    
    {/* ===== หมวดประชาสัมพันธ์ ===== */}
    <Card className="h-125 flex flex-col border border-gray-100 shadow-xl shadow-blue-900/5 rounded-[2rem] overflow-hidden bg-white">
      <CardHeader className="bg-linear-to-br from-blue-50/50 to-white pb-6 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">
              ข่าวประชาสัมพันธ์ทั่วไป
            </h1>
            <p className="text-sm font-medium text-blue-500/80">
              General Announcement
            </p>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-4 overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-gray-100">
        {latestGeneral.length > 0 ? (
          latestGeneral.map((info) => (
            <div
              key={info.id}
              className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <p className="text-[16px] font-bold text-gray-700 group-hover:text-blue-600 transition-colors mb-1">
                {info.title}
              </p>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {info.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-10 italic">ไม่มีข้อมูลประกาศ</p>
        )}
      </div>
    </Card>

    {/* ===== หมวดรับสมัครงาน ===== */}
    <Card className="h-125 flex flex-col border border-gray-100 shadow-xl shadow-green-900/5 rounded-[2rem] overflow-hidden bg-white">
      <CardHeader className="bg-linear-to-br from-green-50/50 to-white pb-6 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500 text-white rounded-2xl shadow-lg shadow-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">
              ข่าวรับสมัครงาน
            </h1>
            <p className="text-sm font-medium text-green-600/80">
              Career Opportunities
            </p>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-4 overflow-y-auto flex-1 p-6">
        {latestJob.length > 0 ? (
          latestJob.map((info) => (
            <div
              key={info.id}
              className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-green-400 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <p className="text-[16px] font-bold text-gray-700 group-hover:text-green-600 transition-colors mb-1">
                  {info.title}
                </p>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">New</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {info.description}
              </p>
              <CardAction className="mt-2" onClick={() => window.location.href = `/new/${info.id}`}>
                <Button className="text-sm text-green-600 hover:text-green-800 font-medium p-0">
                  ดูรายละเอียดเพิ่มเติม
                </Button>
              </CardAction>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-10 italic">ไม่มีข้อมูลการสมัครงาน</p>
        )}
      </div>
    </Card>
    
  </div>
</>
    )
}