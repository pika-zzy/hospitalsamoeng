import { createFileRoute } from '@tanstack/react-router'
import { requestAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Download, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

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

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-screen">
      <div className="mb-10">
        <p className="text-xs font-medium text-emerald-600 tracking-widest uppercase mb-1">
          Integrity & Transparency Assessment
        </p>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span className="w-1 h-7 bg-emerald-500 rounded-full inline-block" />
          งาน ITA
        </h1>
        <p className="text-sm text-gray-400 mt-1 ml-4">
          การประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ
        </p>
      </div>

      {isLoading && (
        <div className="py-20 text-center text-gray-400 text-sm">กำลังโหลดข้อมูล...</div>
      )}

      {!isLoading && (
        <>
          {years.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              {years.map((y) => (
                <button key={y} onClick={() => { setSelectedYear(y); setOpenMoit(null); }}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${activeYear === y ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  ปีงบ {y}
                </button>
              ))}
            </div>
          )}

          {grouped.length === 0 && (
            <div className="py-20 text-center text-gray-400 text-sm">ยังไม่มีข้อมูล ITA สำหรับปีนี้</div>
          )}

          <div className="flex flex-col gap-3">
            {grouped.map((moit) => {
              const isOpen = openMoit === moit.moit_id;
              const totalFiles = moit.topics.flatMap((t) => t.items).flatMap((i) => i.files).length;
              return (
                <div key={moit.moit_id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenMoit(isOpen ? null : moit.moit_id)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left">
                  
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 line-clamp-1 text-xl">{moit.moit_name} : {moit.moit_description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{totalFiles} เอกสาร</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-50 divide-y divide-gray-50">
                      {moit.topics.map((topic) => (
                        <div key={topic.topic_id} className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-700 mb-3">{topic.topic_label}</p>
                          <div className="flex flex-col gap-2 ml-2">
                            {topic.items.map((item) => (
                              <div key={item.item_id}>
                                <p className="text-xs text-gray-500 mb-1.5 leading-relaxed">{item.item_label}</p>
                                {item.files.map((file) => (
                                  <a key={file.ID}
                                    href={`${API_URL}${file.FileURL}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50
                                               hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-150 group mb-1.5">
                                    <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                      <span className="text-[9px] font-bold text-red-500">PDF</span>
                                    </div>
                                    <span className="flex-1 text-xs text-gray-600 group-hover:text-emerald-700 transition-colors">
                                      {file.Title || item.item_label}
                                    </span>
                                    <Download className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
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
  );
}