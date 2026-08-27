import { useState } from "react"
import { Link, useMatchRoute } from "@tanstack/react-router"
import { ChevronDown, Clock3, MapPin, MenuIcon, Phone, Siren, X } from "lucide-react"
import logo from "/src/assets/logo2.png"
import { useNavbarList } from "@/lib/use-navbar-list"

const Navbar = () => {
  const matchRoute = useMatchRoute()
  // เมนู = โครงในโค้ด + หน้าเนื้อหาที่สร้างจากหลังบ้าน (ดู useNavbarList)
  const navbarList = useNavbarList()
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // REDESIGN (โทน sage): เลิกใช้รางเม็ดยาสีเขียวอ่อน เปลี่ยนเป็นเมนูตัวอักษรเรียบ
  // + ขีดใต้สีน้ำตาลไม้บอกหน้าที่เปิดอยู่ — อ่านเป็นเว็บโรงพยาบาลมากกว่าแถบปุ่ม
  // logic ทั้งหมด (matchRoute / openMenuId / isMobileMenuOpen) คงเดิม
  const isActive = (to: string) => Boolean(matchRoute({ to }))

  return (
    <header className="sticky top-0 z-50">
      {/* ── แถบบนสุด: ข้อมูลติดต่อที่คนหาบ่อยสุด (เดิมมีแค่ในฟุตเตอร์ ต้องเลื่อนสุดหน้า) ── */}
      <div className="hidden bg-[#24352b] text-[#c9dacd] lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-[12.5px]">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#c9a184]" aria-hidden="true" />
              เปิดบริการในเวลาราชการ 08.00 – 16.00 น.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#c9a184]" aria-hidden="true" />
              อ.สะเมิง จ.เชียงใหม่
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="tel:053487114"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5 text-[#c9a184]" aria-hidden="true" />
              053-487-114
            </a>
            <a
              href="tel:1669"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#3b5546] px-3 py-1 font-semibold text-white transition-colors hover:bg-[#4a6b57]"
            >
              <Siren className="h-3.5 w-3.5" aria-hidden="true" />
              ฉุกเฉิน 1669
            </a>
          </div>
        </div>
      </div>

      {/* ── แถบเมนูหลัก ── */}
      <nav className="border-b border-stone-200/80 bg-[#fdfcf9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex h-20 items-center justify-between gap-6">
            {/* โลโก้ */}
            <Link to="/" className="group flex shrink-0 items-center gap-3">
              <img
                src={logo}
                alt="ตราโรงพยาบาลสะเมิง"
                className="h-11 w-11 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span className="flex flex-col leading-none">
                <span className="text-[19px] font-bold tracking-tight text-[#24352b]">
                  โรงพยาบาลสะเมิง
                </span>
                <span className="mt-1 text-[10.5px] font-semibold tracking-[0.22em] text-[#8aa893] uppercase">
                  Samoeng Hospital
                </span>
              </span>
            </Link>

            {/* เมนูจอใหญ่ */}
            <ul className="hidden items-center gap-1 lg:flex">
              {navbarList.map((menu) => {
                const active = menu.link ? isActive(menu.link) : openMenuId === menu.id

                return (
                  <li
                    key={menu.id}
                    className="relative" // dropdown ยึดตำแหน่งจาก li นี้
                    onMouseEnter={() => menu.submenu && setOpenMenuId(menu.id)}
                    onMouseLeave={() => setOpenMenuId(null)}
                  >
                    {!menu.submenu ? (
                      <Link
                        to={menu.link!}
                        className={`relative inline-flex items-center px-3.5 py-2 text-[14.5px] transition-colors duration-200 ${
                          active
                            ? "font-semibold text-[#2f4438]"
                            : "font-medium text-stone-500 hover:text-[#3b5546]"
                        }`}
                      >
                        {menu.name}
                        {active && (
                          <span
                            className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-[#b08968]"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    ) : (
                      <>
                        <button
                          className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-[14.5px] transition-colors duration-200 ${
                            active
                              ? "font-semibold text-[#2f4438]"
                              : "font-medium text-stone-500 hover:text-[#3b5546]"
                          }`}
                        >
                          {menu.name}
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              openMenuId === menu.id ? "rotate-180 text-[#6b8c76]" : "text-stone-300"
                            }`}
                          />
                          {active && (
                            <span
                              className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-[#b08968]"
                              aria-hidden="true"
                            />
                          )}
                        </button>

                        {/* กล่อง dropdown — pt-3 เป็นสะพานกันเมาส์หลุดระหว่างทาง */}
                        <div
                          className={`absolute top-full left-1/2 w-64 -translate-x-1/2 pt-3 transition-all duration-200 ease-out ${
                            openMenuId === menu.id
                              ? "visible translate-y-0 opacity-100"
                              : "pointer-events-none invisible -translate-y-2 opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-2 shadow-xl shadow-[#24352b]/10">
                            {menu.submenu.map((sub, i) => (
                              <Link
                                key={i}
                                to={sub.link}
                                search={sub.search}
                                className="group/item flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-stone-600 transition-colors duration-150 hover:bg-[#f3f7f3] hover:text-[#2f4438]"
                              >
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9dacd] transition-colors duration-150 group-hover/item:bg-[#b08968]"
                                  aria-hidden="true"
                                />
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>

            {/* CTA ไปหน้าติดต่อ */}
            <Link
              to="/about/contact"
              className="hidden shrink-0 items-center gap-2 rounded-full bg-[#3b5546] px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#2f4438] lg:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              ติดต่อสอบถาม
            </Link>

            {/* ปุ่มเมนูจอเล็ก */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 text-[#3b5546] transition-colors hover:bg-[#f3f7f3] lg:hidden"
            >
              {isMobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {/* ── เมนูจอเล็ก ── */}
        {isMobileMenuOpen && (
          <div className="absolute w-full border-t border-stone-200 bg-[#fdfcf9] px-5 py-4 shadow-xl lg:hidden">
            {navbarList.map((menu) => (
              <div key={menu.id} className="border-b border-stone-100 last:border-0">
                {!menu.submenu ? (
                  <Link
                    to={menu.link!}
                    onClick={() => setIsMobileMenuOpen(false)} // ปิดเมนูเมื่อคลิก
                    className={`block px-2 py-3.5 text-[16px] transition-colors ${
                      isActive(menu.link!)
                        ? "font-semibold text-[#2f4438]"
                        : "font-medium text-stone-600"
                    }`}
                  >
                    {menu.name}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === menu.id ? null : menu.id)}
                      className={`flex w-full items-center justify-between px-2 py-3.5 text-[16px] transition-colors ${
                        openMenuId === menu.id
                          ? "font-semibold text-[#2f4438]"
                          : "font-medium text-stone-600"
                      }`}
                    >
                      {menu.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          openMenuId === menu.id ? "rotate-180 text-[#6b8c76]" : "text-stone-300"
                        }`}
                      />
                    </button>
                    {openMenuId === menu.id && (
                      <div className="pb-3 pl-2">
                        {menu.submenu.map((sub, i) => (
                          <Link
                            key={i}
                            to={sub.link}
                            search={sub.search}
                            onClick={() => setIsMobileMenuOpen(false)} // ปิดเมนูเมื่อคลิก
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] font-medium text-stone-500 transition-colors hover:bg-[#f3f7f3] hover:text-[#2f4438]"
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9dacd]"
                              aria-hidden="true"
                            />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* ติดต่อ + ฉุกเฉิน — จอเล็กไม่มีแถบบนสุด จึงยกมาไว้ท้ายเมนู */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <a
                href="tel:053487114"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9dacd] px-4 py-3 text-[13.5px] font-semibold text-[#3b5546]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                053-487-114
              </a>
              <a
                href="tel:1669"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3b5546] px-4 py-3 text-[13.5px] font-semibold text-white"
              >
                <Siren className="h-4 w-4" aria-hidden="true" />
                ฉุกเฉิน 1669
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
