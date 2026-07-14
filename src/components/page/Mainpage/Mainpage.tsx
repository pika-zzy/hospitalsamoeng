import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { requestAPI } from "@/lib/api";
import type { HeroSlide } from "@/interface/hero";

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

    return (
        <>
            {/* Hero Section - ปรับให้ดูแกรนด์และอ่านง่ายขึ้น */}
            {/* ยังไม่มีรูปในระบบ → เหลือแค่พื้นหลังสีทึบ (bg-gray-800) ข้อความยังอ่านออกปกติ */}
            <div className="relative w-full h-125 bg-gray-800 flex items-center mb-16 overflow-hidden">

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

                {/* Gradient Overlay: ช่วยให้ข้อความสีขาวเด่นชัดขึ้น */}
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12">
                <div className="max-w-2xl pt-15 ">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-sarabun font-bold text-white leading-tight drop-shadow-lg mb-4">
                        ยินดีต้อนรับสู่ <br />
                        <span className="text-green-400">โรงพยาบาลสะเมิง</span>
                    </h2>
                    <div className="h-1 w-16 bg-green-400 mb-6 rounded-full"></div>
                    <p className="text-lg md:text-xl lg:text-2xl font-sarabun text-gray-100 leading-relaxed">
                        เราให้บริการทางการแพทย์ที่หลากหลาย <br />
                        เข้าถึงง่าย ด้วยมาตรฐานสากล เพื่อสุขภาวะที่ดีของชุมชน
                    </p>
                    <Link to={"/about/contact"}>
                        <button className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        ติดต่อเรา
                        </button>
                    </Link>
                    </div>
                </div>

                {/* จุดบอกตำแหน่งสไลด์ + กดข้ามได้ — โชว์เฉพาะตอนมีหลายรูป */}
                {slides.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                        {slides.map((slide, i) => (
                            <button
                                key={slide.ID}
                                onClick={() => setCurrent(i)}
                                aria-label={`ไปที่สไลด์ที่ ${i + 1}`}
                                aria-current={i === activeIndex}
                                className={`h-2.5 rounded-full transition-all duration-300
                                            ${i === activeIndex
                                                ? "w-8 bg-green-400"
                                                : "w-2.5 bg-white/50 hover:bg-white/80"
                                            }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
