import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { requestAPI } from "@/lib/api";
import type { HeroSlide } from "@/interface/hero";
import { Leaf } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const SLIDE_INTERVAL_MS = 5000;

export default function Main_page() {
    // รูป hero มาจากหลังบ้าน (admin จัดการเอง) — backend เรียงตามลำดับมาให้แล้ว
    const { data: slides = [] } = useQuery<HeroSlide[]>({
        queryKey: ["hero"],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const resp = await requestAPI<HeroSlide[]>({ method: "GET", url: "/hero" });
            if (resp.success) return resp.data;
            throw new Error("Failed to fetch hero slides");
        },
    });

    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    // เลื่อนอัตโนมัติเฉพาะตอนมีมากกว่า 1 รูป (รูปเดียวไม่ต้องมี timer)
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(next, SLIDE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [slides.length, next]);

    // กันกรณี admin ลบรูปจน index ที่เก็บไว้หลุดขอบ array — clamp ตอน render
    // (ไม่ใช้ useEffect + setState เพราะจะทำให้ render ซ้อนโดยไม่จำเป็น)
    const activeIndex = slides.length > 0 ? current % slides.length : 0;

    // REFACTOR: hero โฉมใหม่ตาม mockup "แบบ G" ที่ user เลือก (2026-07-15) —
    // รูปสไลด์เต็มจอ ขอบล่างเฟดละลายเข้าพื้น mint (green-50) ของหน้า ไม่มีเส้นตัด
    // logic สไลด์ (query/autoplay/dots/clamp) คงเดิมทั้งหมด เปลี่ยนเฉพาะ layout/overlay
    return (
        <div className="relative w-full h-105 md:h-125 overflow-hidden bg-linear-to-br from-green-800 via-green-600 to-green-400">

            {/* ชั้นรูปสไลด์ — ไล่ opacity เพื่อ cross-fade ระหว่างรูป */}
            {slides.map((slide, i) => (
                <div
                    key={slide.ID}
                    aria-hidden={i !== activeIndex}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out
                                ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
                    style={{ backgroundImage: `url(${API_URL}${slide.image_url})` }}
                />
            ))}

            {/* overlay เขียวเข้มจาง ๆ ฝั่งซ้าย — กันตัวหนังสือขาวกลืนกับรูปโทนสว่าง */}
            <div className="absolute inset-0 bg-linear-to-r from-green-950/50 via-green-950/15 to-transparent" />

            {/* หัวใจของดีไซน์: ขอบล่าง hero ละลายเข้าพื้น green-50 ของหน้า (ต้องตรงกับ bg ใน _user/index.tsx) */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-b from-transparent via-green-50/30 to-green-50" />

            <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center">
                <div className="max-w-2xl pb-14">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm mb-4">
                        <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                        โรงพยาบาลชุมชน อ.สะเมิง จ.เชียงใหม่
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-sarabun font-bold text-white leading-tight drop-shadow-lg mb-4">
                        ยินดีต้อนรับสู่ <br />
                        โรงพยาบาลสะเมิง
                    </h2>
                    <p className="text-lg md:text-xl font-sarabun text-green-50 leading-relaxed drop-shadow">
                        เราให้บริการทางการแพทย์ที่หลากหลาย <br />
                        เข้าถึงง่าย ด้วยมาตรฐานสากล เพื่อสุขภาวะที่ดีของชุมชน
                    </p>
                    <Link to={"/about/contact"}>
                        <button className="mt-7 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg shadow-green-600/25 transition-all duration-300 active:scale-95">
                            ติดต่อเรา
                        </button>
                    </Link>
                </div>
            </div>

            {/* จุดบอกตำแหน่งสไลด์ + กดข้ามได้ — โชว์เฉพาะตอนมีหลายรูป
                (อยู่บนโซนเฟด mint จึงใช้เม็ดสีเขียวแทนขาว ให้มองเห็นชัด) */}
            {slides.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.ID}
                            onClick={() => setCurrent(i)}
                            aria-label={`ไปที่สไลด์ที่ ${i + 1}`}
                            aria-current={i === activeIndex}
                            className={`h-2.5 rounded-full transition-all duration-300
                                        ${i === activeIndex
                                            ? "w-8 bg-green-600"
                                            : "w-2.5 bg-green-300 hover:bg-green-400"
                                        }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
