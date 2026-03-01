
import type { NewInfo } from '@/interface/newinfo'
import { requestAPI } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react'




export const Route = createFileRoute('/news/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const { data} = useQuery<NewInfo>({
    queryKey: ["news", id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<NewInfo>({
        method: "GET",
        url: `/news/${id}`,
      });
      if (resp.success) {
        return resp.data;
      }
      throw new Error("Failed to fetch news");
    },
  });

  const  news = data || null;

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-lg">
        ไม่พบข่าว
      </div>
    )
  }

  const isJob = news.type === 'ประกาศจัดซื้อจัดจ้าง';
  // สมมติว่าในฐานข้อมูลตอนนี้ใช้ชื่อ field ว่า fileUrl (หรือถ้ายังใช้ imgUrl ก็เปลี่ยนชื่อตัวแปรตรงนี้ได้ครับ)

  console.log(news.fileUrl);

  // 1. สร้างตัวแปร URL แบบเต็มๆ เตรียมไว้
// ดึง Base URL มาจาก .env หรือใช้ localhost:8080 เป็นค่า default
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// เช็คว่า fileUrl มีคำว่า http ไหม? ถ้าไม่มี ให้เอา apiBase ไปแปะข้างหน้า
const fullFileUrl = news.fileUrl?.startsWith('http') 
  ? news.fileUrl 
  : `${apiBase}${news.fileUrl}`;

// ---------------------------------------------------

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      
      {/* Header Section */}
      <div className={`pt-10 pb-20 ${isJob ? 'bg-green-600' : 'bg-blue-600'}`}>
        <div className="max-w-4xl mx-auto px-6 text-white">
          <p className="text-sm opacity-90 mb-1">ข่าวสาร / รายละเอียดเอกสาร</p>
          <h2 className="text-3xl font-semibold">
            {isJob ? `${news.type}` : `${news.type}`}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-12">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          
          {/* Text Content (ย้ายข้อความมาไว้ด้านบนเอกสาร) */}
          <div className="p-8 md:p-10 border-b border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-snug">
              {news.title}
            </h1>
            <p className="text-sm text-gray-500 border-b border-gray-200 mb-4 pb-2">
              เผยแพร่เมื่อ: {news.date}
            </p>

            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg bg-gray-50 p-6 rounded-2xl">
              {news.description}
            </div>
          </div>
          { news.fileUrl ? 
          (<>
            {/* PDF Viewer Section */}
            <div className="bg-gray-100 p-4 px-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <FileText size={20} className="text-red-500" />
                <span>เอกสารแนบ (PDF)</span>
              </div>
              
              {/* ปุ่มสำหรับเปิด PDF แถบใหม่ (จำเป็นมากสำหรับมือถือที่มักจะแสดง iframe PDF ไม่ค่อยดี) */}
              <a 
                href={fullFileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 shadow-sm"
              >
                เปิดดูเต็มจอ <ExternalLink size={16} />
              </a>
            </div>

            <div className="relative w-full h-150 bg-gray-200">
              {/* ใช้ Iframe ในการฝัง PDF */}
              <iframe
                src={`${fullFileUrl}#toolbar=0`} 
                title={news.title}
                className="w-full h-full border-0"
              />
            </div>
          </> ) : (<></>)}

          {/* Back Button */}
          <div className="p-8 md:p-10 bg-white">
            <Link
              to="/news"
              className={`inline-flex items-center gap-2 text-base font-medium text-gray-600 ${isJob ? 'hover:text-green-600' : 'hover:text-blue-600'} transition-colors bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-xl`}
            >
              <ArrowLeft size={18} />
              ย้อนกลับ
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}