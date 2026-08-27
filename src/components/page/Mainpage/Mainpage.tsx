import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { requestAPI } from "@/lib/api";
import type { HeroSlide } from "@/interface/hero";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const SLIDE_INTERVAL_MS = 5000;

// NOTE: respect ผู้ใช้ที่ตั้งค่า "ลดการเคลื่อนไหว" ในระบบ (a11y / WCAG 2.3.3)
// ใช้ปิด autoplay + ตัด cross-fade ให้เปลี่ยนรูปทันที
function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return reduced;
}

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
    const [isPaused, setIsPaused] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prev = useCallback(() => {
        setCurrent((p) => (p - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // เลื่อนอัตโนมัติเฉพาะตอนมีมากกว่า 1 รูป (รูปเดียวไม่ต้องมี timer)
    // NOTE: หยุดเมื่อ user hover/focus (a11y WCAG 2.2.2 — content ที่ขยับเองต้องหยุดได้)
    // หรือเมื่อตั้งค่าลด motion ในระบบ
    useEffect(() => {
        if (slides.length <= 1 || isPaused || prefersReducedMotion) return;
        const timer = setInterval(next, SLIDE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [slides.length, next, isPaused, prefersReducedMotion]);

    // กันกรณี admin ลบรูปจน index ที่เก็บไว้หลุดขอบ array — clamp ตอน render
    // (ไม่ใช้ useEffect + setState เพราะจะทำให้ render ซ้อนโดยไม่จำเป็น)
    const activeIndex = slides.length > 0 ? current % slides.length : 0;
    // ข้อความ overlay ต่อสไลด์ — อ่านจากสไลด์ที่กำลังแสดง (admin กำหนดเอง)
    const activeSlide = slides[activeIndex];

    // REDESIGN (โทน sage): เดิมขอบล่าง hero ไล่เฟดเป็นสีมิ้นต์กลืนพื้นหน้า ทำให้รูปหายไปครึ่งใบ
    // ตอนนี้ให้รูปเต็มกรอบ ใช้ overlay เขียวเข้มไล่จากซ้ายแทน — ตัวหนังสืออ่านออกโดยไม่กินรูป
    // logic สไลด์ (query / autoplay / dots / clamp) คงเดิมทั้งหมด
    return (
        <section
            className="relative h-[480px] w-full overflow-hidden bg-[#24352b] md:h-[600px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
        >
            {/* ชั้นรูปสไลด์ — ไล่ opacity เพื่อ cross-fade ระหว่างรูป
                (reduced motion = เปลี่ยนทันที ไม่ fade) */}
            {slides.map((slide, i) => (
                <div
                    key={slide.ID}
                    aria-hidden={i !== activeIndex}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity ease-in-out
                                ${prefersReducedMotion ? "duration-0" : "duration-1000"}
                                ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
                    style={{ backgroundImage: `url(${API_URL}${slide.image_url})` }}
                />
            ))}

            {/* overlay: เข้มฝั่งซ้ายให้ตัวหนังสืออ่านออก + คลุมขอบล่างบาง ๆ ให้จุดสไลด์เด่น */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#16211a]/85 via-[#16211a]/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#16211a]/70 to-transparent" />

            {/* ข้อความ overlay — แสดงเฉพาะเมื่อสไลด์นี้เปิด show_text (บางรูปเอาแค่รูปเปล่าได้) */}
            {activeSlide?.show_text && (
                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 md:px-10">
                    <div className="max-w-2xl pb-10">
                        {activeSlide.badge && (
                            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur-sm">
                                <Leaf className="h-3.5 w-3.5 text-[#c9a184]" aria-hidden="true" />
                                {activeSlide.badge}
                            </span>
                        )}
                        {activeSlide.title && (
                            <h1 className="mb-5 text-4xl leading-[1.15] font-bold tracking-tight whitespace-pre-line text-white drop-shadow-md md:text-5xl lg:text-[56px]">
                                {activeSlide.title}
                            </h1>
                        )}
                        {activeSlide.subtitle && (
                            <p className="max-w-xl text-[17px] leading-relaxed whitespace-pre-line text-[#c9dacd] drop-shadow md:text-lg">
                                {activeSlide.subtitle}
                            </p>
                        )}
                        {activeSlide.button_text && (
                            <Link to={activeSlide.button_link || "/"}>
                                <button className="mt-8 rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-[#24352b] shadow-lg transition-colors duration-300 hover:bg-[#f2eee4]">
                                    {activeSlide.button_text}
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* ปุ่มเลื่อนซ้าย/ขวา — โชว์เฉพาะจอใหญ่ตอนมีหลายรูป (จอเล็กใช้จุดด้านล่างพอ) */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="สไลด์ก่อนหน้า"
                        className="absolute top-1/2 left-5 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 md:inline-flex"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="สไลด์ถัดไป"
                        className="absolute top-1/2 right-5 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 md:inline-flex"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* จุดบอกตำแหน่งสไลด์ + กดข้ามได้ — โชว์เฉพาะตอนมีหลายรูป */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.ID}
                            onClick={() => setCurrent(i)}
                            aria-label={`ไปที่สไลด์ที่ ${i + 1}`}
                            aria-current={i === activeIndex}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                i === activeIndex ? "w-10 bg-white" : "w-5 bg-white/40 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
