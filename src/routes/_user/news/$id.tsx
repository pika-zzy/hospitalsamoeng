import { type NewsInfo } from '@/interface/newinfo'
import { requestAPI } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, FileText, ExternalLink, Calendar, Newspaper, Download, Info } from 'lucide-react'

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

  // ชื่อไฟล์ตอนดาวน์โหลด — ไฟล์บนดิสก์ชื่อเป็น timestamp ล้วน (1787651181507113500.pdf)
  // ดาวน์โหลดหลายใบแล้วแยกไม่ออกว่าอันไหนคืออะไร ใช้หัวข้อข่าวแทน (backend sanitize ต่อให้)
  const downloadName = news.title.slice(0, 80);

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

          {/* ─── เอกสารแนบ (PDF) ───
              backend อนุญาตไฟล์แนบข่าวเป็น .pdf เท่านั้น (allowedPDFExt) ส่วนรูปเป็นฟิลด์แยก
              เดิมเป็น file_url ? ... : img_url && ... — ข่าวที่มีทั้งสองอย่างจะไม่เห็นรูปเลย
              ตอนนี้แยกเป็นสองบล็อกอิสระ มีอะไรก็แสดงอันนั้น ไม่มีก็ไม่วางกล่องเปล่าไว้ */}
          {news.file_url && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-[#fdfcf9] px-7 py-4 sm:px-10">
                <span className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#24352b]">
                  <FileText size={19} className="text-[#b08968]" />
                  เอกสารแนบ (PDF)
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {/* ดาวน์โหลดจริง: ไฟล์อยู่คนละ origin กับหน้าเว็บ attribute download ของ <a>
                      จึงถูกเบราว์เซอร์เมิน ต้องให้ backend ส่ง Content-Disposition ผ่าน ?download= */}
                  <a
                    href={`${fullFileUrl}?download=${encodeURIComponent(downloadName)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-[13px] font-semibold text-[#3b5546] transition-colors hover:border-[#3b5546] hover:bg-[#3b5546] hover:text-white"
                  >
                    <Download size={15} /> ดาวน์โหลด
                  </a>
                  <a
                    href={`${fullFileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-[13px] font-semibold text-[#3b5546] transition-colors hover:border-[#3b5546] hover:bg-[#3b5546] hover:text-white"
                  >
                    เปิดดูเต็มจอ <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              {/* จอเล็กไม่ฝัง PDF: iframe สูง 600px บนจอกว้าง 390px ทำให้ตัวหนังสือในเอกสาร
                  เล็กจนอ่านไม่ออก ต้องซูมทุกครั้ง — ให้กดเปิดในตัวอ่าน PDF ของเครื่องแทน */}
              <a
                href={`${fullFileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 border-b border-stone-100 px-7 py-6 transition-colors hover:bg-[#fdfcf9] sm:hidden"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3f7f3] text-[#b08968]">
                  <FileText size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-semibold text-[#24352b]">
                    เปิดอ่านเอกสารแนบ
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-stone-500">
                    ไฟล์ PDF · เปิดในแท็บใหม่
                  </span>
                </span>
                <ExternalLink size={17} className="shrink-0 text-stone-400" />
              </a>

              <div className="relative hidden h-150 w-full bg-stone-100 sm:block">
                <iframe
                  src={`${fullFileUrl}#toolbar=0`}
                  title={news.title}
                  className="h-full w-full border-0"
                />
              </div>
            </>
          )}

          {news.img_url && (
            <div className="border-b border-stone-100 p-7 sm:p-10">
              <div className="relative h-100 w-full overflow-hidden rounded-2xl bg-[#f3f7f3] md:h-125">
                <img
                  src={`${fullImageUrl}`}
                  alt={news.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* ประกาศที่เว็บเก่าไม่ได้แนบอะไรมาเลย (15 ข่าวในระบบ) — เดิมได้หน้าว่าง
              มีแค่หัวข้อกับปุ่มย้อนกลับ จนดูเหมือนเว็บพัง */}
          {!news.file_url && !news.img_url && !news.description && (
            <div className="flex items-start gap-3 border-b border-stone-100 bg-[#fdfcf9] px-7 py-6 sm:px-10">
              <Info size={19} className="mt-0.5 shrink-0 text-[#b08968]" aria-hidden="true" />
              <p className="text-[14.5px] leading-relaxed text-stone-600">
                ประกาศนี้ไม่มีเอกสารแนบหรือรายละเอียดเพิ่มเติม
                <span className="mt-1 block text-[13.5px] text-stone-500">
                  หากต้องการข้อมูลเพิ่มเติม ติดต่อโรงพยาบาลได้ที่ 053-487-114 ในเวลาราชการ
                </span>
              </p>
            </div>
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
