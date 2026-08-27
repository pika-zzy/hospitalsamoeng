// เรียงชื่อหัวข้อ/ข้อรองภาษาไทยให้ตรงกับที่คนอ่านคาดหวัง
//
// ใช้ร่วมกันระหว่างหน้า ITA สาธารณะกับหน้าจัดการ ITA หลังบ้าน — สองที่นี้ต้องเรียง
// เหมือนกัน ไม่งั้น admin เห็นลำดับหนึ่ง ประชาชนเห็นอีกลำดับหนึ่ง
//
// ทำไมต้องมีไฟล์นี้: `localeCompare` เรียงชื่อเดือนไทยตาม "ตัวอักษร" ไม่ใช่ตามเวลา
//   ต < ธ < พ  =>  ตุลาคม, ธันวาคม, พฤศจิกายน   (ผิด)
//   ที่ถูกคือ    =>  ตุลาคม, พฤศจิกายน, ธันวาคม
// เจอของจริง 5 กลุ่มใน MOIT5 (เอกสาร แบบ สขร. 1 รายเดือน)

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
] as const

/** เลขนำหน้าชื่อ: "3. มีแบบฟอร์ม..." -> 3 · "1.2 ..." -> 1.2 · ไม่มีเลข -> ท้ายสุด */
export function leadingNumber(label: string): number {
  const m = label.match(/^\s*(\d+(?:\.\d+)?)/)
  return m ? parseFloat(m[1]) : Number.MAX_SAFE_INTEGER
}

/**
 * คีย์เวลาจากชื่อเดือนไทยในข้อความ = (พ.ศ. * 12 + เลขเดือน)
 * คืน null ถ้าไม่มีชื่อเดือน — ผู้เรียกจะได้รู้ว่าเทียบแบบเวลาไม่ได้
 * เอาปีมาคิดด้วยเพราะไตรมาสงบประมาณคร่อมปฏิทิน (ต.ค. 2567 ต้องมาก่อน ม.ค. 2568)
 */
export function thaiMonthKey(label: string): number | null {
  const idx = THAI_MONTHS.findIndex((m) => label.includes(m))
  if (idx < 0) return null
  const year = label.match(/25\d{2}/)
  return (year ? Number(year[0]) : 0) * 12 + idx
}

/**
 * ลำดับที่ใช้กับชื่อข้อรอง/หัวข้อย่อยของ ITA:
 *   1) เลขนำหน้าก่อน (1. -> 2. -> 3.)
 *   2) ถ้าไม่มีเลข (หรือเลขเท่ากัน) และทั้งคู่มีชื่อเดือน -> เรียงตามเวลาจริง
 *   3) ที่เหลือ -> localeCompare แบบ numeric ตามเดิม
 */
export function compareThaiLabels(a: string, b: string): number {
  const na = leadingNumber(a)
  const nb = leadingNumber(b)
  if (na !== nb) return na - nb

  const ka = thaiMonthKey(a)
  const kb = thaiMonthKey(b)
  if (ka !== null && kb !== null && ka !== kb) return ka - kb

  return a.localeCompare(b, undefined, { numeric: true })
}
