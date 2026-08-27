import { createFileRoute } from '@tanstack/react-router'
import { requestAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Download, ShieldCheck, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { PageHero } from '@/components/page/page-hero';
import { compareThaiLabels, leadingNumber } from '@/lib/thai-label-sort';

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
  // ข้อรองซ้อนได้ 1 ชั้น — null = ข้อชั้นบนสุด
  // Parent ถูก preload มาจาก backend เพราะข้อแม่มักไม่มีไฟล์ของตัวเอง
  // (เช่น "2. มีแบบสรุปผลฯ" ที่มีแต่ลูกรายเดือน) จึงไม่โผล่ในลิสต์ไฟล์เลย
  ParentID: number | null;
  Parent: MoitItem | null;
}

interface ITAFile {
  ID: number;
  Title: string;
  FileURL: string;
  YearID: number;
  Year: ITAYear;   // gorm preload → nested struct
  // ไฟล์แนบได้ 2 แบบ — มีอย่างใดอย่างหนึ่ง อีกอันเป็น null
  //   Item  = แนบกับข้อรอง (1.1, 1.2)
  //   Topic = แนบกับหัวข้อตรง ๆ (หัวข้อที่ไม่มีข้อรอง)
  ItemID: number | null;
  Item: MoitItem | null;
  TopicID: number | null;
  Topic: MoitTopic | null;
}

// --------- Grouped types ---------
interface GroupedItem {
  item_id: number;
  item_label: string;
  files: ITAFile[];
  parent_id: number | null;
  parent_label: string;
}
// files = ไฟล์ที่แนบกับหัวข้อตรง ๆ แสดงก่อนรายการข้อรอง
interface GroupedTopic { topic_id: number; topic_label: string; files: ITAFile[]; items: GroupedItem[] }
interface GroupedMoit { moit_id: number; moit_name: string; moit_description: string; topics: GroupedTopic[] }

// ── ชั้นซ้อนของข้อรอง ───────────────────────────────────────────────────────
// โครงจริงของ ITA บางข้อมี 3 ชั้น เช่น MOIT5:
//     ไตรมาสที่ 1                       <- MoitTopic
//       1. มีบันทึกข้อความฯ   [ไฟล์]     <- MoitItem (ParentID = null)
//       2. มีแบบสรุปผลฯ                  <- MoitItem (ParentID = null) ไม่มีไฟล์ของตัวเอง
//            แสดงแบบ สขร. 1 เดือนตุลาคม  <- MoitItem (ParentID = ข้อ 2)
//       3. มีแบบฟอร์มการเผยแพร่ฯ [ไฟล์]  <- MoitItem (ParentID = null)
//
// NOTE (2026-08-27): เดิมชั้นที่ 3 ถูกยัดไว้ในชื่อหัวข้อคั่นด้วย "›" แล้วแตกเอาตอน render
// ตอนนี้ backend มี moit_items.parent_id แล้ว จึงอ่านชั้นจากข้อมูลตรง ๆ ไม่ต้องเดาจากข้อความ
// (ข้อมูลเก่าแปลงด้วย _migration/convert_arrow_topics.sql — ไม่เหลือ › ในระบบแล้ว)
interface SectionEntry {
  key: string;
  label: string;
  order: number;           // เลขนำหน้า label ใช้เรียง 1 -> 2 -> 3
  files: ITAFile[];        // ไฟล์ของข้อนี้เอง
  children: GroupedItem[]; // ข้อย่อย (ถ้ามี)
  isGroup: boolean;
}

interface GroupedSection {
  key: string;
  label: string;
  files: ITAFile[];        // ไฟล์ที่แขวนกับหัวข้อตรง ๆ
  entries: SectionEntry[];
}

function buildSections(topics: GroupedTopic[]): GroupedSection[] {
  return topics.map((t) => {
    const byId = new Map<number, SectionEntry>();
    const order: SectionEntry[] = [];

    const ensure = (id: number, label: string, isGroup: boolean) => {
      let e = byId.get(id);
      if (!e) {
        e = {
          key: `i-${id}`,
          label,
          order: leadingNumber(label),
          files: [],
          children: [],
          isGroup,
        };
        byId.set(id, e);
        order.push(e);
      }
      // ข้อแม่อาจถูกสร้างจากลูกก่อน (ตอนนั้นยังไม่รู้ว่ามันเป็นกลุ่ม) — อัปเดตทีหลังได้
      if (isGroup) e.isGroup = true;
      if (!e.label && label) {
        e.label = label;
        e.order = leadingNumber(label);
      }
      return e;
    };

    for (const item of t.items) {
      if (item.parent_id == null) {
        const e = ensure(item.item_id, item.item_label, false);
        e.files.push(...item.files);
      } else {
        const parent = ensure(item.parent_id, item.parent_label, true);
        parent.children.push(item);
      }
    }

    // FIX (2026-08-27): เดิมเรียงด้วย localeCompare ล้วน ๆ ซึ่งเรียงชื่อเดือนไทย
    // ตามตัวอักษร (ตุลาคม, ธันวาคม, พฤศจิกายน) — เอกสาร แบบ สขร. 1 รายเดือนของ MOIT5
    // จึงเรียงผิดลำดับเวลา 5 กลุ่ม ตอนนี้ใช้ตัวเทียบกลางที่รู้จักเดือนไทย
    order.forEach((e) => e.children.sort((a, b) => compareThaiLabels(a.item_label, b.item_label)));
    order.sort((a, b) => compareThaiLabels(a.label, b.label));

    return { key: `t-${t.topic_id}`, label: t.topic_label, files: t.files, entries: order };
  });
}

// แยก "MOIT13" ออกจากชื่อยาว ๆ เพื่อเอาไปทำป้ายเลขข้อด้านซ้าย
// ชื่อ MOIT ยาวเฉลี่ย 127 ตัวอักษร (ยาวสุด 200) การเอาเลขข้อออกมาให้กวาดตาหาได้เร็ว
// คือสิ่งที่ช่วยได้มากที่สุดโดยไม่ต้องรื้อโครงหน้า
function splitMoitName(name: string): { no: string; rest: string } {
  const m = name.match(/^\s*MOIT\s*(\d+)\s*(.*)$/is);
  if (!m) return { no: "", rest: name.trim() };
  return { no: m[1], rest: m[2].trim() };
}

// ป้ายชนิดไฟล์จากนามสกุลใน FileURL — ITA รับได้ทั้ง PDF และรูป
function fileKind(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (ext === "jpg" || ext === "jpeg") return "JPG";
  if (ext === "png") return "PNG";
  return "PDF";
}

function FileLink({ file, apiUrl, fallbackLabel }: {
  file: ITAFile;
  apiUrl: string;
  fallbackLabel?: string;
}) {
  return (
    <a
      href={`${apiUrl}${file.FileURL}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group mb-1.5 flex items-center gap-3 rounded-xl border border-stone-200/80 bg-[#fdfcf9] px-4 py-3 transition-all duration-150 hover:border-[#c9dacd] hover:bg-[#f3f7f3]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#dcc3ab] bg-[#f2eee4]">
        <span className="text-[9px] font-bold text-[#96704f]">{fileKind(file.FileURL)}</span>
      </span>
      <span className="flex-1 text-[13.5px] text-stone-600 transition-colors group-hover:text-[#24352b]">
        {file.Title || fallbackLabel || "ดาวน์โหลดเอกสาร"}
      </span>
      <Download className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-[#4a6b57]" />
    </a>
  );
}

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
      // FIX: เดิมเรียก /ita เปล่า ๆ -> backend default limit=20 ทำให้หน้านี้เห็นแค่ 20 ไฟล์แรก
      // และรายการปีก็หายตามไปด้วย เพราะ years มาจาก rawData เดียวกันนี้
      // วนดึงทีละ 100 จนกว่า batch จะสั้นกว่า limit (pattern เดียวกับหน้า admin ITA)
      const all: ITAFile[] = [];
      const limit = 100;
      let page = 1;
      while (true) {
        const resp = await requestAPI<ITAFile[]>({
          method: "GET",
          url: "/ita",
          query: { page, limit },
        });
        if (!resp.success) break;
        const batch = resp.data ?? [];
        all.push(...batch);
        if (batch.length < limit) break;
        page++;
      }
      return all;
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
      // ไฟล์แนบกับข้อรอง (Item) หรือกับหัวข้อตรง ๆ (Topic) — หา topic ให้ได้จากทั้งสองทาง
      const item = ita.Item;
      const topic = item ? item.Topic : ita.Topic;
      if (!topic) return; // ข้อมูลไม่ครบ (ไม่ควรเกิด) — ข้ามไปดีกว่าพังทั้งหน้า
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
        topicGroup = { topic_id: topic.ID, topic_label: topic.Label, files: [], items: [] };
        moitGroup.topics.push(topicGroup);
      }

      // แนบกับหัวข้อตรง ๆ — ไม่ต้องมีข้อรองมารับ
      if (!item) {
        topicGroup.files.push(ita);
        return;
      }

      let itemGroup = topicGroup.items.find((i) => i.item_id === item.ID);
      if (!itemGroup) {
        itemGroup = {
          item_id: item.ID,
          item_label: item.Label,
          files: [],
          parent_id: item.ParentID ?? null,
          parent_label: item.Parent?.Label ?? "",
        };
        topicGroup.items.push(itemGroup);
      }

      itemGroup.files.push(ita);
    });

    const result = [...moitMap.values()].sort((a, b) =>
      a.moit_name.localeCompare(b.moit_name, undefined, { numeric: true })
    );
    result.forEach((m) => {
      m.topics.sort((a, b) => a.topic_label.localeCompare(b.topic_label, undefined, { numeric: true }));
      m.topics.forEach((t) => {
        t.items.sort((a, b) => compareThaiLabels(a.item_label, b.item_label));
      });
    });

    return result;
  }, [rawData, activeYear]);

  // เลือกทีละข้อ: สารบัญซ้าย -> เนื้อหาขวา (เดิมเป็น accordion กางในหน้าเดียว)
  const [selectedMoit, setSelectedMoit] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // ค้นหาลึกถึงชื่อไฟล์ — ผู้ใช้ส่วนใหญ่จำได้แค่คำในเอกสาร ไม่ได้จำว่าอยู่ MOIT ข้อไหน
  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!q) return grouped;
    return grouped.filter((moit) => {
      if (`${moit.moit_name} ${moit.moit_description}`.toLowerCase().includes(q)) return true;
      return moit.topics.some(
        (t) =>
          t.topic_label.toLowerCase().includes(q) ||
          t.files.some((f) => (f.Title ?? "").toLowerCase().includes(q)) ||
          t.items.some(
            (i) =>
              i.item_label.toLowerCase().includes(q) ||
              i.files.some((f) => (f.Title ?? "").toLowerCase().includes(q)),
          ),
      );
    });
  }, [grouped, q]);

  // ข้อที่กำลังอ่านอยู่ — ถ้าข้อที่เลือกไว้หลุดจากผลค้นหา (หรือเพิ่งสลับปี) ตกกลับไปข้อแรกเอง
  // ไม่ต้องมี useEffect มา sync state ให้พลาดง่าย
  const activeMoit = useMemo(() => {
    if (visible.length === 0) return null;
    return visible.find((m) => m.moit_id === selectedMoit) ?? visible[0];
  }, [visible, selectedMoit]);

  // แตกชั้นซ้อนเฉพาะข้อที่กำลังอ่านอยู่ (หน้านี้แสดงทีละข้อ)
  const sections = useMemo(
    () => (activeMoit ? buildSections(activeMoit.topics) : []),
    [activeMoit],
  );

  const countFiles = (moit: GroupedMoit) =>
    moit.topics.reduce(
      (n, t) => n + t.files.length + t.items.reduce((k, i) => k + i.files.length, 0),
      0,
    );

  // จอเล็กวางสารบัญไว้บน เนื้อหาอยู่ล่าง — กดแล้วเลื่อนลงไปให้เลย ไม่งั้นเหมือนกดไม่ติด
  const chooseMoit = (id: number) => {
    setSelectedMoit(id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      requestAnimationFrame(() =>
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  };

  const totalFilesInYear = useMemo(
    () =>
      grouped.reduce(
        (sum, m) =>
          sum +
          m.topics.reduce(
            (n, t) => n + t.files.length + t.items.reduce((k, i) => k + i.files.length, 0),
            0,
          ),
        0,
      ),
    [grouped],
  );

  // REDESIGN (โทน sage): หัวหน้าใช้ PageHero + ปุ่มปีงบเป็นชุดเดียวกับหน้าอื่น
  // logic การ group MOIT → Topic → Item → Files และการเลือกปี เดิมทั้งหมด
  //
  // REDESIGN รอบสอง (2026-08-27, "แบบ ข" จาก mock 3 แบบ — user เลือกเอง)
  // เดิมเป็น accordion กางในหน้าเดียว ตอนนี้เป็น **สารบัญซ้าย + เอกสารขวา**:
  //   1. สารบัญเห็นครบทั้ง 22 ข้อในตาเดียว บอกจำนวนเอกสารต่อข้อ กระโดดข้ามข้อได้ทันที
  //   2. จอ lg+ สารบัญ sticky — เลื่อนอ่านเอกสารยาวแค่ไหนก็ยังเห็นสารบัญ
  //   3. จอเล็กซ้อนกัน (สารบัญบน จำกัดสูง / เนื้อหาล่าง) กดแล้วเลื่อนลงไปให้เอง
  //   4. ช่องค้นหา ค้นถึงชื่อ MOIT / หัวข้อย่อย / ชื่อเอกสาร -> กรองสารบัญ
  //   5. แยกเลข MOIT ออกมาเป็นป้าย + ชื่อเต็มไม่ตัด (เดิม line-clamp-1 ตัดกลางประโยค)
  //   6. บอกจำนวนหัวข้อ/เอกสารของปีที่เลือก
  // ที่ยัง "ไม่ทำ" โดยตั้งใจ: ข้อความลิงก์ไฟล์ยังเป็น "ดาวน์โหลดเอกสาร" เหมือนเดิม
  // (user ตัดสินใจปล่อยไว้แล้ว) และไม่แตะ logic group / API
  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Integrity & Transparency Assessment"
        title="งาน ITA"
        description="การประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ โรงพยาบาลสะเมิง"
      />

      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="py-20 text-center text-[15px] text-stone-400">กำลังโหลดข้อมูล...</div>
        )}

        {!isLoading && (
          <>
            {/* ─── เลือกปีงบประมาณ ─── */}
            {years.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => { setSelectedYear(y); setSelectedMoit(null); }}
                    className={`rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 ${
                      activeYear === y
                        ? "border-[#3b5546] bg-[#3b5546] text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-[#c9dacd] hover:text-[#3b5546]"
                    }`}
                  >
                    ปีงบ {y}
                  </button>
                ))}
                {grouped.length > 0 && (
                  <span className="w-full self-center text-[12.5px] text-stone-400 sm:ml-auto sm:w-auto sm:text-right">
                    {grouped.length} หัวข้อ · {totalFilesInYear} เอกสาร
                  </span>
                )}
              </div>
            )}

            {/* ─── ค้นหา ─── ค้นถึงชื่อ MOIT / หัวข้อย่อย / ชื่อเอกสาร */}
            {grouped.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white px-4 py-3 focus-within:border-[#c9dacd]">
                  <Search className="h-4.5 w-4.5 shrink-0 text-[#8aa893]" aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ค้นหาหัวข้อ เช่น จัดซื้อ, ร้องเรียน, สขร."
                    aria-label="ค้นหาหัวข้อ ITA"
                    className="flex-1 border-0 bg-transparent text-[14.5px] text-[#24352b] outline-none placeholder:text-stone-400"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="ล้างคำค้นหา"
                      className="shrink-0 rounded-full p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-[#3b5546]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="mt-2 px-1 text-[12.5px] text-stone-400">
                  {q
                    ? `เจอ ${visible.length} หัวข้อจาก ${grouped.length} หัวข้อของปีงบ ${activeYear}`
                    : "พิมพ์คำเดียวก็พอ — ค้นหาจากชื่อ MOIT หัวข้อย่อย และชื่อเอกสาร"}
                </p>
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

            {/* ─── สารบัญซ้าย + เอกสารขวา ───
                จอเล็ก: ซ้อนกัน (สารบัญบน เนื้อหาล่าง) สารบัญจำกัดความสูงไม่ให้ดันเนื้อหาตกจอ
                จอ lg ขึ้นไป: สองคอลัมน์ สารบัญตรึงไว้ เลื่อนอ่านเอกสารยาวแค่ไหนก็ยังเห็นสารบัญ */}
            {grouped.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-[300px_1fr] lg:items-start lg:gap-6">
                <nav
                  aria-label="สารบัญหัวข้อ MOIT"
                  className="max-h-72 overflow-y-auto rounded-2xl border border-stone-200/80 bg-white p-2 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]"
                >
                  {visible.length === 0 ? (
                    <div className="px-3 py-8 text-center">
                      <p className="text-[13.5px] text-stone-400">ไม่พบหัวข้อที่ตรงกับ “{query}”</p>
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="mt-2 text-[13px] font-semibold text-[#4a6b57] hover:underline"
                      >
                        ล้างคำค้นหา
                      </button>
                    </div>
                  ) : (
                    visible.map((moit) => {
                      const { no, rest } = splitMoitName(moit.moit_name);
                      const on = activeMoit?.moit_id === moit.moit_id;
                      return (
                        <button
                          key={moit.moit_id}
                          type="button"
                          onClick={() => chooseMoit(moit.moit_id)}
                          aria-current={on ? "true" : undefined}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 ${
                            on ? "bg-[#3b5546] text-white" : "text-stone-600 hover:bg-[#f3f7f3]"
                          }`}
                        >
                          <span
                            className={`w-12 shrink-0 text-[12.5px] font-bold ${
                              on ? "text-[#c9dacd]" : "text-[#3b5546]"
                            }`}
                          >
                            {no ? `MOIT${no}` : "—"}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[13.5px]">{rest}</span>
                          <span
                            className={`shrink-0 text-[11.5px] tabular-nums ${
                              on ? "text-[#a7bfad]" : "text-stone-400"
                            }`}
                          >
                            {countFiles(moit)}
                          </span>
                        </button>
                      );
                    })
                  )}
                </nav>

                {/* ─── เอกสารของข้อที่เลือก ─── */}
                <div ref={panelRef} className="scroll-mt-24">
                  {activeMoit && (
                    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
                      <div className="border-b border-stone-100 px-5 py-5 sm:px-6">
                        <div className="flex items-start gap-4">
                          {splitMoitName(activeMoit.moit_name).no && (
                            <span className="mt-0.5 flex w-14 shrink-0 flex-col items-center rounded-xl border border-[#c9dacd] bg-[#f3f7f3] px-2 py-1.5 leading-tight">
                              <span className="text-[10.5px] font-semibold tracking-wider text-[#6b8c76]">MOIT</span>
                              <span className="text-[15px] font-bold text-[#3b5546]">
                                {splitMoitName(activeMoit.moit_name).no}
                              </span>
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            {/* ชื่อเต็มไม่ตัด — คอลัมน์ขวามีที่พอ (เดิม line-clamp-1 ตัดกลางประโยค) */}
                            <h2 className="text-[15.5px] leading-relaxed font-semibold text-[#24352b] sm:text-[17px]">
                              {activeMoit.moit_description
                                ? `${splitMoitName(activeMoit.moit_name).rest} : ${activeMoit.moit_description}`
                                : splitMoitName(activeMoit.moit_name).rest}
                            </h2>
                            <p className="mt-1.5 text-[12.5px] text-stone-400">
                              ปีงบ {activeYear} · {activeMoit.topics.length} หัวข้อย่อย · {countFiles(activeMoit)} เอกสาร
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="divide-y divide-stone-100">
                        {sections.map((section) => (
                          <div key={section.key} className="px-5 py-5 sm:px-6">
                            <p className="mb-3.5 text-[14.5px] leading-relaxed font-semibold text-[#3b5546]">
                              {section.label}
                            </p>

                            <div className="ml-1 flex flex-col gap-3">
                              {/* ไฟล์ที่แนบกับหัวข้อตรง ๆ (หัวข้อที่ไม่มีข้อรอง) — แสดงก่อนข้อรองเสมอ */}
                              {section.files.length > 0 && (
                                <div>
                                  {section.files.map((file) => (
                                    <FileLink key={file.ID} file={file} apiUrl={API_URL} />
                                  ))}
                                </div>
                              )}

                              {section.entries.map((entry) =>
                                entry.isGroup ? (
                                  /* ข้อที่มีลูก เช่น "2. มีแบบสรุปผลฯ" ที่ตัวเองไม่มีไฟล์
                                     แต่มีเอกสารรายเดือนอยู่ข้างใน
                                     NOTE: ชื่อข้อใช้สไตล์ "เดียวกันเป๊ะ" กับข้อที่ไม่มีลูก (ข้อ 1, ข้อ 3)
                                     เพราะมันเป็นข้อระดับเดียวกัน — ถ้าทำให้ตัวใหญ่/เข้มกว่าจะดูเหมือน
                                     เป็นหัวข้อคนละชั้น ความเป็น "กลุ่ม" สื่อด้วยการย่อหน้า + เส้นซ้ายของลูกพอแล้ว */
                                  <div key={entry.key}>
                                    <p className="mb-2 text-[13px] leading-relaxed text-stone-500">
                                      {entry.label}
                                    </p>

                                    <div className="ml-3 border-l-2 border-[#e4ece5] pl-3.5">
                                      {entry.files.map((file) => (
                                        <FileLink key={file.ID} file={file} apiUrl={API_URL} />
                                      ))}

                                      {entry.children.map((item) => (
                                        <div key={item.item_id} className="mb-2.5 last:mb-0">
                                          <p className="mb-2 text-[13px] leading-relaxed text-stone-500">
                                            {item.item_label}
                                          </p>
                                          {item.files.map((file) => (
                                            <FileLink
                                              key={file.ID}
                                              file={file}
                                              apiUrl={API_URL}
                                              fallbackLabel={item.item_label}
                                            />
                                          ))}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div key={entry.key}>
                                    <p className="mb-2 text-[13px] leading-relaxed text-stone-500">
                                      {entry.label}
                                    </p>
                                    {entry.files.map((file) => (
                                      <FileLink
                                        key={file.ID}
                                        file={file}
                                        apiUrl={API_URL}
                                        fallbackLabel={entry.label}
                                      />
                                    ))}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
