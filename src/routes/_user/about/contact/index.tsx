import { ContactInfo } from '@/interface/contact'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronDown, Facebook, MapPin, Phone, PhoneCall, Siren } from 'lucide-react'
import { useState } from 'react'
import { PageHero } from '@/components/page/page-hero'

export const Route = createFileRoute('/_user/about/contact/')({
  component: RouteComponent,
})

const FACEBOOK_URL =
  "https://www.facebook.com/p/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%AA%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%87-%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88-100066989703921/"

// REDESIGN (โทน sage): เดิมเป็นการ์ด 2 ใบสีฟ้า/เขียวมรกตปนกัน และ dropdown เบอร์ต่อภายใน
// ซ้อนอยู่ใน <ul> จนโครงสร้างเพี้ยน — จัดใหม่เป็นสองคอลัมน์ชัด ๆ โทนเดียวกับทั้งเว็บ
// logic เดิมทั้งหมด (selectedCategory / selectedGroup / รายการเบอร์ต่อจาก ContactInfo)
function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const selectedGroup = ContactInfo.find(
    (g) => g.category === selectedCategory
  );

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Contact Us"
        title="ติดต่อสอบถาม"
        description="ที่อยู่ เบอร์โทรศัพท์ และเบอร์ต่อภายในของแต่ละหน่วยงานในโรงพยาบาลสะเมิง"
      />

      <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">

          {/* ─── ข้อมูลการติดต่อ ─── */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7">
            <h2 className="flex items-center gap-2.5 border-b border-stone-100 pb-4 text-[17px] font-bold text-[#24352b]">
              <MapPin className="h-5 w-5 text-[#b08968]" />
              ข้อมูลการติดต่อ
            </h2>

            <ul className="mt-5 space-y-4 text-[15px] text-stone-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#8aa893]" />
                <span className="leading-relaxed">
                  1766 1269 ต.สะเมิงใต้ อ.สะเมิง จ.เชียงใหม่ 50250
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 shrink-0 text-[#8aa893]" />
                <a href="tel:053487114" className="font-medium transition-colors hover:text-[#3b5546]">
                  053-487-114
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Facebook className="h-4.5 w-4.5 shrink-0 text-[#8aa893]" />
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#3b5546] transition-colors hover:underline"
                >
                  Facebook Page
                </a>
              </li>
            </ul>

            {/* เบอร์ฉุกเฉิน — เน้นแยกออกมาให้เห็นชัดที่สุดในหน้า */}
            <a
              href="tel:1669"
              className="mt-6 flex items-center gap-4 rounded-2xl bg-[#3b5546] p-5 transition-colors hover:bg-[#2f4438]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <Siren className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold tracking-wider text-[#a7bfad] uppercase">
                  สายด่วนฉุกเฉิน 24 ชั่วโมง
                </span>
                <span className="mt-0.5 block text-xl font-bold text-white">1669</span>
              </span>
            </a>
          </div>

          {/* ─── เบอร์ต่อภายใน ─── */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7">
            <h2 className="flex items-center gap-2.5 border-b border-stone-100 pb-4 text-[17px] font-bold text-[#24352b]">
              <PhoneCall className="h-5 w-5 text-[#b08968]" />
              เบอร์ติดต่อภายใน
            </h2>

            <p className="mt-4 text-[13.5px] leading-relaxed text-stone-500">
              โทร 053-487-114 แล้วกดเบอร์ต่อตามหน่วยงานที่ต้องการ
            </p>

            {/* เลือกแผนก */}
            <div className="relative mt-4">
              <select
                className="w-full appearance-none rounded-xl border border-stone-200 bg-[#fdfcf9] px-4 py-3 text-[14.5px] font-medium text-stone-700 transition-colors outline-none focus:border-[#4a6b57]"
                onChange={(e) => setSelectedCategory(e.target.value)}
                defaultValue=""
                aria-label="เลือกแผนก"
              >
                <option value="">เลือกแผนก</option>
                {ContactInfo.map((group) => (
                  <option key={group.category} value={group.category}>
                    {group.category}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-stone-400"
                aria-hidden="true"
              />
            </div>

            {/* รายการเบอร์ต่อของแผนกที่เลือก */}
            {selectedGroup ? (
              <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
                {selectedGroup.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[#fdfcf9] px-4 py-3"
                  >
                    <span className="min-w-0 text-[14.5px] text-stone-600">{item.name}</span>
                    <span className="shrink-0 rounded-full bg-[#e4ece5] px-3 py-1 text-[12.5px] font-bold text-[#3b5546]">
                      {item.ext}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed border-stone-300 py-10 text-center text-[13.5px] text-stone-400">
                เลือกแผนกด้านบนเพื่อดูเบอร์ต่อภายใน
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
