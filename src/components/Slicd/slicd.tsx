import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";


export default function Slider() {
    const slides = [
        { id: 1, title: "Slide 1" },
        { id: 2, title: "Slide 2" },
        { id: 3, title: "Slide 3" },
        { id: 4, title: "Slide 4" },
        { id: 5, title: "Slide 5" },
    ];

    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Auto slide
    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
        nextSlide();
        }, 4000);

        return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [current, nextSlide]);

    return (
        <div className="relative w-full overflow-hidden">

        {/* Slides Container */}
        <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
        >
            {slides.map((slide) => (
            <div key={slide.id} className="w-full shrink-0 flex items-center justify-center">
                <Card className="w-200 h-80  p-8  text-3xl font-bold rounded-md border-0 bg-gray-100 shadow">
                {slide.title}
                </Card>
            </div>
            ))}
        </div>

        {/* ปุ่มซ้าย */}
        <Button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full px-3 py-2"
        >
            ◀
            </Button>

        {/* ปุ่มขวา */}
            <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full px-3 py-2"
        >
            ▶
        </button>
        </div>
        );
};

