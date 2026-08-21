import { createFileRoute } from '@tanstack/react-router'
import { requestAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Download, ChevronRight, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero } from '@/components/page/page-hero';

// --------- Types (ตรง gorm.Model + no json tag = Pascal Case) ---------
interface ITAYear {
  ID: number;
  Year: number;
}

interface MoitCategory {
  ID: number;
  Name: string;
  Description: string | null;
  YearID: number;
}

interface MoitTopic {
  ID: number;
  Label: string;
  MoitID: number;
  Moit: MoitCategory;
}

interface MoitItem {
  ID: number;
  Label: string;
  TopicID: number;
  Topic: MoitTopic;
}

interface ITAFile {
  ID: number;
  Title: string;
  FileURL: string;
  YearID: number;
  Year: ITAYear;   // gorm preload → nested struct
  ItemID: number;
  Item: MoitItem;  // gorm preload → nested struct
}

// --------- Grouped types ---------
interface GroupedItem { item_id: number; item_label: string; files: ITAFile[] }
interface GroupedTopic { topic_id: number; topic_label: string; items: GroupedItem[] }
interface GroupedMoit { moit_id: number; moit_name: string; moit_description: string; topics: GroupedTopic[] }

export const Route = createFileRoute('/_user/ita/')({
  component: RouteComponent,
})

function RouteComponent() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { data: rawData = [], isLoading } = useQuery<ITAFile[]>({
    queryKey: ["ita"],
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    queryFn: async () => {
      const resp = await requestAPI<ITAFile[]>({ method: "GET", url: "/ita" });
      if (resp.success) return resp.data ?? [];
      return [];
    },
  });

  // Year มาจาก file.Year.Year (nested struct)
  const years = useMemo(() => {
    const all = [...new Set(rawData.map((d) => d.Year.Year))];
    return all.sort((a, b) => b - a);
  }, [rawData]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const activeYear = selectedYear ?? years[0] ?? null;

  const grouped = useMemo((): GroupedMoit[] => {
    if (!activeYear) return [];

    const filtered = rawData.filter((d) => d.Year.Year === activeYear);
    const moitMap = new Map<number, GroupedMoit>();

    filtered.forEach((ita) => {
      const item = ita.Item;
      const topic = item.Topic;
      const moit = topic.Moit;

      if (!moitMap.has(moit.ID)) {
        moitMap.set(moit.ID, {
          moit_id: moit.ID,
          moit_name: moit.Name,
          moit_description: moit.Description ?? '',
          topics: [],
        });
      }
      const moitGroup = moitMap.get(moit.ID)!;

      let topicGroup = moitGroup.topics.find((t) => t.topic_id === topic.ID);
      if (!topicGroup) {
        topicGroup = { topic_id: topic.ID, topic_label: topic.Label, items: [] };
        moitGroup.topics.push(topicGroup);
      }

      let itemGroup = topicGroup.items.find((i) => i.item_id === item.ID);
      if (!itemGroup) {
        itemGroup = { item_id: item.ID, item_label: item.Label, files: [] };
        topicGroup.items.push(itemGroup);
      }

      itemGroup.files.push(ita);
    });

    const result = [...moitMap.values()].sort((a, b) =>
      a.moit_name.localeCompare(b.moit_name)
    );
    result.forEach((m) => {
      m.topics.sort((a, b) => a.topic_label.localeCompare(b.topic_label));
      m.topics.forEach((t) => {
        t.items.sort((a, b) => a.item_label.localeCompare(b.item_label));
      });
    });

    return result;
  }, [rawData, activeYear]);

  const [openMoit, setOpenMoit] = useState<number | null>(null);

  // REDESIGN (โทน sage): หัวหน้าใช้ PageHero + ปุ่มปีงบเป็นชุดเดียวกับหน้าอื่น
  // logic การ group MOIT → Topic → Item → Files และการเลือกปี เดิมทั้งหมด
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Integrity & Transparency Assessment"
        title="งาน ITA"
        description="การประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ โรงพยาบาลสะเมิง"
      />

      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="py-20 text-center text-[15px] text-stone-400">กำลังโหลดข้อมูล...</div>
        )}

        {!isLoading && (
          <>
            {/* ─── เลือกปีงบประมาณ ─── */}
            {years.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => { setSelectedYear(y); setOpenMoit(null); }}
                    className={`rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 ${
                      activeYear === y
                        ? "border-[#3b5546] bg-[#3b5546] text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-[#c9dacd] hover:text-[#3b5546]"
                    }`}
                  >
                    ปีงบ {y}
                  </button>
                ))}
              </div>
            )}

            {grouped.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-stone-300 bg-white/60 py-20">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f7f3]">
                  <ShieldCheck className="h-7 w-7 text-[#c9dacd]" />
                </div>
                <p className="text-[15px] text-stone-400">ยังไม่มีข้อมูล ITA สำหรับปีนี้</p>
              </div>
            )}

            {/* ─── หมวด MOIT ─── */}
            <div className="flex flex-col gap-3">
              {grouped.map((moit) => {
                const isOpen = openMoit === moit.moit_id;
                const totalFiles = moit.topics.flatMap((t) => t.items).flatMap((i) => i.files).length;

                return (
                  <div
                    key={moit.moit_id}
                    className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                      isOpen ? "border-[#c9dacd] shadow-lg shadow-[#24352b]/8" : "border-stone-200/80"
                    }`}
                  >
                    <button
                      onClick={() => setOpenMoit(isOpen ? null : moit.moit_id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-[#fdfcf9]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-[16.5px] font-semibold text-[#24352b]">
                          {moit.moit_name} : {moit.moit_description}
                        </p>
                        <p className="mt-1 text-[12.5px] text-stone-400">{totalFiles} เอกสาร</p>
                      </div>
                      <ChevronRight
                        className={`h-4.5 w-4.5 shrink-0 text-stone-400 transition-transform duration-200 ${
                          isOpen ? "rotate-90 text-[#4a6b57]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="divide-y divide-stone-100 border-t border-stone-100">
                        {moit.topics.map((topic) => (
                          <div key={topic.topic_id} className="px-6 py-5">
                            <p className="mb-3.5 text-[14.5px] font-semibold text-[#3b5546]">
                              {topic.topic_label}
                            </p>

                            <div className="ml-1 flex flex-col gap-3">
                              {topic.items.map((item) => (
                                <div key={item.item_id}>
                                  <p className="mb-2 text-[13px] leading-relaxed text-stone-500">
                                    {item.item_label}
                                  </p>

                                  {item.files.map((file) => (
                                    <a
                                      key={file.ID}
                                      href={`${API_URL}${file.FileURL}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group mb-1.5 flex items-center gap-3 rounded-xl border border-stone-200/80 bg-[#fdfcf9] px-4 py-3 transition-all duration-150 hover:border-[#c9dacd] hover:bg-[#f3f7f3]"
                                    >
                                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#dcc3ab] bg-[#f2eee4]">
                                        <span className="text-[9px] font-bold text-[#96704f]">PDF</span>
                                      </span>
                                      <span className="flex-1 text-[13.5px] text-stone-600 transition-colors group-hover:text-[#24352b]">
                                        {file.Title || item.item_label}
                                      </span>
                                      <Download className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-[#4a6b57]" />
                                    </a>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
