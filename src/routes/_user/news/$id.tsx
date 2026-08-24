import { type NewsInfo } from '@/interface/newinfo'
import { requestAPI } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, FileText, ExternalLink, Calendar, Newspaper } from 'lucide-react'

export const Route = createFileRoute('/_user/news/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data } = useQuery<NewsInfo>({
    queryKey: ["news", id],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<NewsInfo>({
        method: "GET",
        url: `/news/${id}`,
      });
      if (resp.success) {
        return resp.data;
      }
      throw new Error("Failed to fetch news");
    },
  });

  const news = data || null;

  if (!news) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-stone-400">
        <Newspaper className="h-14 w-14 opacity-30" />
        <p className="text-lg">ไม่พบข่าว</p>
        <Link
          to="/news"
          className="rounded-full bg-[#3b5546] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#2f4438]"
        >
          กลับหน้าข่าวสาร
        </Link>
      </div>
    )
  }

  // 1. สร้างตัวแปร URL แบบเต็มๆ เตรียมไว้
  // ดึง Base URL มาจาก .env หรือใช้ค่าว่างเป็น default
  const apiBase = import.meta.env.VITE_API_URL || ""

  // เช็คว่า file_url มีคำว่า http ไหม? ถ้าไม่มี ให้เอา apiBase ไปแปะข้างหน้า
  const fullFileUrl = news.file_url?.startsWith('http')
    ? news.file_url
    : `${apiBase}${news.file_url}`;

  const fullImageUrl = news.img_url?.startsWith('http')
    ? news.img_url
    : `${apiBase}${news.img_url}`;

  // REDESIGN (โทน sage): เดิมแถบหัวเปลี่ยนสีเขียว/teal ตามประเภทข่าว ทำให้หน้าเดียวกันดูคนละเว็บ
  // ตอนนี้ใช้แถบเขียวเข้มชุดเดียวกับหน้าในอื่น ๆ แล้วบอกประเภทข่าวด้วยป้ายแทน
  // logic query / การประกอบ URL ไฟล์แนบ / iframe PDF เดิมทั้งหมด
  return (
    <div className="pb-20">
      {/* ─── แถบหัว ─── */}
      <div className="relative overflow-hidden bg-[#2f4438] px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#4a6b57]/40 blur-3xl"
          aria-hidden="true"
        />
        {/* FIX: เดิม Link กับป้ายประเภทเป็น inline-flex ทั้งคู่ เลยตกอยู่บรรทัดเดียวกัน
            mt-5 บน inline-flex ไม่ได้ดันลงบรรทัดใหม่ แค่เลื่อนกล่องขึ้น → ป้ายไปทับ breadcrumb
            เปลี่ยนตัวครอบเป็น flex-col ให้แยกบรรทัดจริง ๆ */}
        <div className="relative mx-auto flex max-w-4xl flex-col items-start gap-5">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#a7bfad] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            ข่าวสารและประกาศ
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[12.5px] font-semibold text-white">
            {news.type}
          </span>
        </div>
      </div>

      {/* ─── เนื้อหา ─── */}
      {/* FIX: การ์ดยื่นขึ้นไปทับแถบหัวด้วย -mt-16 แต่ตัวมันเป็น static ส่วนแถบหัวเป็น relative
          element ที่ positioned จะวาดทับ in-flow เสมอ → แถบเขียวกินหัวข้อไปครึ่งบรรทัด
          ใส่ relative z-10 ให้การ์ดขึ้นมาอยู่ชั้นบน (แบบเดียวกับ QuickActions ที่ใช้ z-30) */}
      <div className="relative z-10 mx-auto -mt-16 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-xl shadow-[#24352b]/8">

          <div className="border-b border-stone-100 p-7 sm:p-10">
            <h1 className="text-2xl leading-snug font-bold text-[#24352b] sm:text-[32px]">
              {news.title}
            </h1>

            <p className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] text-stone-400">
              <Calendar className="h-4 w-4" />
              เผยแพร่เมื่อ{" "}
              {new Date(news.date).toLocaleDateString("th-TH", {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>

            {news.description && (
              <div className="mt-6 rounded-2xl bg-[#f3f7f3] p-6 text-[16.5px] leading-relaxed whitespace-pre-line text-stone-700">
                {news.description}
              </div>
            )}
          </div>

          {news.file_url ? (
            <>
              {/* ─── เอกสารแนบ (PDF) ─── */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-[#fdfcf9] px-7 py-4 sm:px-10">
                <span className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#24352b]">
                  <FileText size={19} className="text-[#b08968]" />
                  เอกสารแนบ (PDF)
                </span>

                {/* ปุ่มเปิด PDF แท็บใหม่ (จำเป็นมากบนมือถือที่มักแสดง iframe PDF ไม่ค่อยดี) */}
                <a
                  href={`${fullFileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-[13px] font-semibold text-[#3b5546] transition-colors hover:border-[#3b5546] hover:bg-[#3b5546] hover:text-white"
                >
                  เปิดดูเต็มจอ <ExternalLink size={15} />
                </a>
              </div>

              <div className="relative h-150 w-full bg-stone-100">
                {/* ใช้ Iframe ในการฝัง PDF */}
                <iframe
                  src={`${fullFileUrl}#toolbar=0`}
                  title={news.title}
                  className="h-full w-full border-0"
                />
              </div>
            </>
          ) : (
            news.img_url && (
              <div className="p-7 sm:p-10">
                <div className="relative h-100 w-full overflow-hidden rounded-2xl bg-[#f3f7f3] md:h-125">
                  <img
                    src={`${fullImageUrl}`}
                    alt={news.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )
          )}

          {/* ─── ปุ่มย้อนกลับ ─── */}
          <div className="bg-white p-7 sm:p-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-2.5 text-[14px] font-semibold text-stone-600 transition-colors hover:border-[#3b5546] hover:bg-[#3b5546] hover:text-white"
            >
              <ArrowLeft size={17} />
              ย้อนกลับ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
