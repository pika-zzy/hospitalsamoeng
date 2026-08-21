import type ActivityInfo from '@/interface/activity_info';
import { requestAPI } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Calendar, Info, ChevronLeft, ImageOff } from 'lucide-react'
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL;

export const Route = createFileRoute('/_user/activity/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const { data: activity } = useQuery<ActivityInfo>({
    queryKey: ["activities", id],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    queryFn: async () => {
      const resp = await requestAPI<ActivityInfo>({
        method: "GET",
        url: `/activities/${id}`,
      });
      if (resp.success) {
        return resp.data;
      }
      throw new Error("Failed to fetch news");
    },
  });

  const navigate = useNavigate()
  const [isPortrait, setIsPortrait] = useState(false)

  if (!activity) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-stone-400">
        <Info className="h-14 w-14 opacity-30" />
        <p className="text-lg">ไม่พบข้อมูลกิจกรรม</p>
        <button
          onClick={() => navigate({ to: '/activity' })}
          className="rounded-full bg-[#3b5546] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#2f4438]"
        >
          กลับหน้ากิจกรรม
        </button>
      </div>
    )
  }

  // REDESIGN (โทน sage): จัดหน้าใหม่เป็นคอลัมน์เดียวอ่านง่าย พื้นครีมของเว็บ
  // logic query / isPortrait (รูปแนวตั้งให้ contain ไม่ให้โดน crop) / navigate เดิมทั้งหมด
  return (
    <div className="pb-20">
      {/* ─── ปุ่มย้อนกลับ ─── */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ to: '/activity' })}
          className="group inline-flex items-center gap-2 text-[13.5px] font-medium text-stone-500 transition-colors hover:text-[#3b5546]"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          กลับไปหน้ากิจกรรมทั้งหมด
        </button>
      </div>

      {/* ─── รูปกิจกรรม ─── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={`relative w-full overflow-hidden rounded-3xl border border-stone-200/80 bg-[#f3f7f3] ${
            isPortrait ? 'flex h-128 items-center justify-center' : 'h-96 md:h-112'
          }`}
        >
          {activity.img_url ? (
            <img
              src={`${API_URL}${activity.img_url}`}
              alt={activity.title}
              onLoad={(e) => {
                const img = e.currentTarget
                setIsPortrait(img.naturalHeight > img.naturalWidth)
              }}
              className={isPortrait ? 'h-full w-auto max-w-full object-contain' : 'h-full w-full object-cover'}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff className="h-12 w-12 text-[#c9dacd]" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* ─── เนื้อหา ─── */}
      <div className="mx-auto mt-10 max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="h-px w-8 bg-[#c9a184]" aria-hidden="true" />
          <span className="text-[11px] font-semibold tracking-[0.18em] text-[#96704f] uppercase">
            กิจกรรมโรงพยาบาล
          </span>
        </div>

        <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-[#24352b] md:text-[40px]">
          {activity.title}
        </h1>

        {/* วันที่จัดกิจกรรม */}
        <div className="mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-stone-200/80 bg-white p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3f7f3]">
            <Calendar className="h-5 w-5 text-[#4a6b57]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wider text-[#96704f] uppercase">
              วันที่จัดกิจกรรม
            </p>
            <p className="mt-0.5 text-[14.5px] font-semibold text-stone-700">
              {new Date(activity.start_date).toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}
              {activity.end_date && ` - ${new Date(activity.end_date).toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </p>
          </div>
        </div>

        {/* รายละเอียด */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#24352b]">
            <span className="h-5 w-1 rounded-full bg-[#b08968]" aria-hidden="true" />
            รายละเอียดกิจกรรม
          </h2>
          <p className="mt-4 text-[17px] leading-loose whitespace-pre-line text-stone-600">
            {activity.description}
          </p>
        </div>
      </div>
    </div>
  )
}
