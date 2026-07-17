import { useState } from "react"
import { Link, useMatchRoute } from "@tanstack/react-router"
import { ChevronDown, MenuIcon, Phone, X } from "lucide-react"
import logo from "/src/assets/logo2.png"
import { Navbarlist } from "@/interface/menu"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const matchRoute = useMatchRoute()
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  // REFACTOR: navbar แบบเม็ดยา (pill) ตาม mockup "แบบ G" ที่ user เลือก (2026-07-15)
  // ใช้ทั้งเว็บ — active = เม็ดขาวลอยบนรางเขียวอ่อน, logic ทั้งหมดคงเดิม
  const isActive = (to: string) =>
    matchRoute({ to })
      ? "bg-white text-green-700 font-bold shadow-sm"
      : "text-gray-600 font-medium hover:bg-white/70 hover:text-green-700"

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-green-100/50 shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-20 px-6">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group transition-transform duration-300">
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-green-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col uppercase">
              <span className="text-2xl font-black text-gray-800 tracking-tight leading-none">
                Samoeng <span className="text-green-600 font-bold">Hospital</span>
              </span>
              <span className="text-xs text-gray-400 tracking-[0.2em] font-bold mt-1">Healthcare Center</span>
            </div>
          </Link>

          {/* Menu Section */}
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </Button>
          <ul className="hidden lg:flex items-center gap-0.5 bg-green-50/80 border border-green-100/60 rounded-full p-1.5">
            {Navbarlist.map((menu) => (
              <li
                key={menu.id}
                className="relative" // dropdown ยึดตำแหน่งจาก li นี้
                onMouseEnter={() => menu.submenu && setOpenMenuId(menu.id)}
                onMouseLeave={() => setOpenMenuId(null)}
              >
                {!menu.submenu ? (
                  <Link
                    to={menu.link!}
                    className={`inline-block px-4 py-2 text-[13.5px] rounded-full transition-all duration-300 ${isActive(menu.link!)}`}
                  >
                    {menu.name}
                  </Link>
                ) : (
                  <>
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium rounded-full transition-all duration-300
                      ${openMenuId === menu.id
                        ? "bg-white text-green-700 font-bold shadow-sm"
                        : "text-gray-600 hover:bg-white/70 hover:text-green-700"
                      }`}
                    >
                      {menu.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-500 ${
                          openMenuId === menu.id ? "rotate-180 text-green-600" : "opacity-30"
                        }`}
                      />
                    </button>

                    {/* Dropdown Box */}
                    {/* เพิ่มก้อนสี่เหลี่ยมใสๆ ทับช่องว่างระหว่างปุ่มกับเมนู (The Bridge) */}
                    <div
                      className={`absolute left-0 top-full pt-2 w-60 transition-all duration-300 ease-out
                      ${openMenuId === menu.id
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-4 invisible pointer-events-none"
                      }`}
                    >
                      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-2xl shadow-green-900/10 p-2 overflow-hidden">
                        {menu.submenu.map((sub, i) => (
                          <Link
                            key={i}
                            to={sub.link}
                            search={sub.search}
                            className="flex items-center px-4 py-3 text-[14px] font-medium text-gray-500 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}

          </ul>

          {/* CTA: ปุ่มโทรแบบ mockup (ลิงก์ไปหน้าติดต่อเหมือนเดิม) */}
          <Link
            to="/about/contact"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-white border-[1.5px] border-green-200 text-green-700 text-sm font-bold rounded-full shadow-sm hover:bg-green-600 hover:border-green-600 hover:text-white transition-all duration-300 active:scale-95"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            053-487-114
          </Link>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 px-6 py-4 absolute w-full shadow-lg bg-white/90 backdrop-blur-xl">
          
          {Navbarlist.map((menu) => (
            <div key={menu.id} className="mb-4">
              {!menu.submenu ? (
                <Link
                  to={menu.link!}
                  className={`block px-5 py-2.5 text-[16px] rounded-full transition-all duration-300 hover:bg-green-50/80 ${isActive(menu.link!)}`}
                  onClick={() => setIsMobileMenuOpen(false)} // ปิดเมนูเมื่อคลิก
                >
                  {menu.name}
                </Link>
              ) : (
                <div>
                  <button
                    className={`flex items-center justify-between w-full px-5 py-2.5 text-[16px] font-medium rounded-full transition-all duration-300
                    ${openMenuId === menu.id
                      ? "text-green-600 bg-green-50"
                      : "text-gray-600 hover:bg-green-50/80"
                    }`}
                    onClick={() => setOpenMenuId(openMenuId === menu.id ? null : menu.id)} // Toggle submenu
                  >
                    {menu.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-500 ${openMenuId === menu.id ? "rotate-180 text-green-600" : "opacity-30"}`}
                    />
                  </button>
                  {openMenuId === menu.id && (
                    <div className="mt-2 bg-white rounded-[1.5rem] border border-gray-100 shadow-2xl shadow-green-900/10 p-2">
                      {menu.submenu.map((sub, i) => (
                        <Link
                          key={i}
                          to={sub.link}
                          search={sub.search}
                          className="block px-4 py-3 text-[14px] font-medium text-gray-500 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)} // ปิดเมนูเมื่อคลิก
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          

        </div>
      )}
    </nav>
  )
}

export default Navbar