import { Card, CardContent } from '@/components/ui/card'
import { ContactInfo } from '@/interface/contact'
import { createFileRoute } from '@tanstack/react-router'
import { Facebook, MapPin, Phone, PhoneCall } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_user/about/contact/')({
  component: RouteComponent,
})


function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const selectedGroup = ContactInfo.find(
    (g) => g.category === selectedCategory
  );
  return (
    <div className="min-h-screen mt-20 px-4 pb-10">
      {/* เพิ่ม Container ครอบเพื่อไม่ให้การ์ดกว้างเกินไปบนจอใหญ่ */}
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl mb-8 font-bold text-center tracking-wide text-primary">
          ติดต่อสอบถาม
        </h1>

        {/* ปรับให้ Responsive: มือถือ 1 คอลัมน์, แท็บเล็ตขึ้นไป 2 คอลัมน์ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Card 1: ข้อมูลที่อยู่และเบอร์หลัก */}
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow border-none">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              ข้อมูลการติดต่อ
            </h2>
            <ul className="space-y-4 text-[14px] font-medium text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>1766 1269 ต.สะเมิงใต้ อ.สะเมิง จ.เชียงใหม่ 50250</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <span>053-487-114</span>
              </li>
              <li className="flex items-center gap-3">
                <Facebook className="w-4 h-4 shrink-0 text-blue-600" />
                <a 
                  href="https://www.facebook.com/p/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%AA%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%87-%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88-100066989703921/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600">Facebook Page</a>
              </li>
            </ul>
          </Card>

          {/* Card 2: เบอร์ต่อภายใน */}
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow border-none ">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-500" />
              เบอร์ติดต่อภายใน
            </h2>
            <ul className="space-y-3 text-[14px] font-medium">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <span>053-487-114</span>
              </li>
              <select 
                className="w-full p-3 border rounded-lg mb-4"
                onChange={(e)=>setSelectedCategory(e.target.value)}
                defaultValue=""
              >
                <option >
                  เลือกแผนก
                </option>
                {ContactInfo.map((group) => (
                  <option key={group.category} value={group.category}>
                    {group.category}
                  </option>
                ))}
              </select>
              {selectedGroup && selectedGroup.items.map((item) => (
                <CardContent key={item.name} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-1"> 
                  <span className="text-muted-foreground">
                    {item.name}
                  </span> 
                  <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs"> 
                    {item.ext}
                  </span> 
                </CardContent>
              ))}   
              
            </ul>
          </Card>

        </div>
      </div>
    </div>
  )
}

