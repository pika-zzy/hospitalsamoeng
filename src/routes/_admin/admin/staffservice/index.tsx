
import IconPicker from "@/components/icon/icon";
import { requestAPI } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { icons } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/staffservice/")({
    component: RouteComponent,
});

function RouteComponent() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("");
    const [selectedColor, setSelectedColor] = useState("green");
    const navigate = useNavigate ();

    const PreviewIcon =
        selectedIcon && selectedIcon in icons
        ? icons[selectedIcon as keyof typeof icons]
        : null;
    

    const mutation = useMutation({
        mutationFn: (data: {
            title: string;
            description: string;
            link: string;
            icon: string;
            color: string;
        }) => {
        return requestAPI({
            url: "/",
            method: "POST",
            body: data,
            });
            
        },
        onSuccess:()=>{
          toast.success("บันทึกข้อมูลสำเร็จ");
          setTimeout(() => {
            navigate({ to: "/admin/dashboard" }); 
          }, 800);
        },
        onError: (error) => {
          toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
          console.error("Error saving staff service menu:", error);
        },
        
    });

const handleSubmit = () => {
    const payload = {
        title,
        description,
        link,
        icon: selectedIcon,
        color: selectedColor,
    };
    mutation.mutate(payload);
    console.log("Submitting data:", payload);
};

    return (
        <div className="px-6 py-10 text-ink">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                <h1 className="font-sarabun text-3xl font-bold text-gray-800">
                    เพิ่มเมนูบริการเจ้าหน้าที่
                </h1>

                <p className="mt-2 font-sarabun text-gray-500">
                    เพิ่มเมนูสำหรับแสดงบนระบบบริการเจ้าหน้าที่
                </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                {/* ================= Form ================= */}

                <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
                    <h2 className="mb-6 font-sarabun text-2xl font-bold">
                    ข้อมูลเมนู
                    </h2>

                    <div className="space-y-6">
                    <div>
                        <label className="mb-2 block font-sarabun text-base font-semibold text-gray-700">
                        ชื่อเมนู
                        </label>

                        <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="เช่น ระบบแจ้งซ่อม"
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-sarabun text-base font-semibold text-gray-700">
                        รายละเอียดเมนู
                        </label>

                        <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="อธิบายการทำงานของเมนู"
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-sarabun text-base font-semibold text-gray-700">
                        ลิงก์
                        </label>

                        <input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="/maintenance หรือ https://..."
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block font-sarabun text-base font-semibold text-gray-700">
                        เลือกไอคอน
                        </label>

                        <div className="rounded-2xl border border-line bg-gray-50 p-4">
                        <IconPicker
                            value={selectedIcon}
                            onSelect={setSelectedIcon}
                            color={selectedColor}
                            onColorSelect={setSelectedColor}
                        />
                        </div>
                    </div>
                    </div>
                </div>

                {/* ================= Preview ================= */}

                <div className="h-fit lg:sticky lg:top-6">
                    <div className="rounded-3xl border border-line bg-white p-8 shadow-sm">
                    <h2 className="mb-6 font-sarabun text-2xl font-bold">
                        ตัวอย่างการแสดงผล
                    </h2>

                    <div className="rounded-3xl border bg-linear-to-br from-teal-50 to-white p-5  border-teal-200">
                        <div className="rounded-2xl bg-white p-5 shadow-md transition hover:shadow-xl">
                        <div className="flex items-center gap-5">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border bg-gray-50 shadow-sm border-amber-50">
                            {PreviewIcon ? (
                                <PreviewIcon
                                size={34}
                                color={selectedColor}
                                />
                            ) : (
                                <div className="h-8 w-8 rounded bg-gray-300" />
                            )}
                            </div>

                            <div className="flex-1">
                            <h3 className="font-sarabun text-xl font-bold text-gray-800">
                                {title || "ชื่อเมนู"}
                            </h3>

                            <p className="mt-2 font-sarabun text-sm text-gray-500">
                                {description || "รายละเอียดเมนูจะแสดงบริเวณนี้"}
                            </p>

                            <div className="mt-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
                                {link || "/example"}
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button className="rounded-xl border border-line px-6 py-3 font-medium transition hover:bg-gray-100">
                        ยกเลิก
                        </button>
                        <button 
                            className="rounded-xl bg-teal-600 px-8 py-3 font-medium text-white shadow transition hover:bg-teal-700"
                            onClick={handleSubmit}
                        >
                            บันทึกเมนู
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

