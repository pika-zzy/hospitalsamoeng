export const departments = [
    { id: 'hospital-director', name: 'ผู้อำนวยการโรงพยาบาล' },

    { id: 'medical-doctor', name: 'แพทย์เฉพาะทาง' },
    { id: 'dentistry', name: 'ทันตกรรม' },
    { id: 'nursing', name: 'พยาบาลวิชาชีพ' },
    { id: 'pharmacy', name: 'เภสัชกรรม' },
    { id: 'medical-technology', name: 'เทคนิคการแพทย์' },
    { id: 'radiology', name: 'รังสีวิทยา' },
    { id: 'rehabilitation', name: 'เวชศาสตร์ฟื้นฟู' },
    { id: 'traditional-medicine', name: 'การแพทย์แผนไทย' },

    { id: 'support-services', name: 'ฝ่ายสนับสนุนทางการแพทย์' },
    { id: 'administration', name: 'ฝ่ายบริหาร' },
    { id: 'insurance-coordination', name: 'ประสานงานประกันสุขภาพ' },
    { id: 'customer-services', name: 'งานบริการผู้ป่วย' },
]


export const personnelData = [
    // ================= HOSPITAL DIRECTOR =================
    {
        id: 1,
        deptId: 'hospital-director',
        prefix: 'นาย',
        name: 'ฐิติกานต์ ณ ปั่น',
        specialty: 'ผู้อำนวยการโรงพยาบาลสะเมิง',
        schedule: 'จันทร์ - ศุกร์ (08:30 - 16:30)',
        imageUrl: '/src/assets/aumnoykarn.jpg',
    },

    // ================= MEDICAL DOCTOR =================
    {
        id: 2,
        deptId: 'medical-doctor',
        prefix: 'นพ.',
        name: 'สมชาย ใจดี',
        specialty: 'อายุรแพทย์โรคหัวใจ',
        schedule: 'จันทร์, พุธ, ศุกร์ (08:00 - 12:00)',
        imageUrl: '',
    },
    {
        id: 3,
        deptId: 'medical-doctor',
        prefix: 'พญ.',
        name: 'สมหญิง รักษาเก่ง',
        specialty: 'กุมารแพทย์',
        schedule: 'อังคาร, พฤหัสบดี (09:00 - 16:00)',
        imageUrl: '',
    },

    // ================= DENTISTRY =================
    {
        id: 4,
        deptId: 'dentistry',
        prefix: 'ทพ.',
        name: 'กิตติชัย มั่นคง',
        specialty: 'ทันตกรรมทั่วไป',
        schedule: 'จันทร์ - เสาร์ (09:00 - 17:00)',
        imageUrl: '',
    },
    {
        id: 5,
        deptId: 'dentistry',
        prefix: 'ทพญ.',
        name: 'วรรณิศา ยิ้มสวย',
        specialty: 'ทันตกรรมจัดฟัน',
        schedule: 'เสาร์ - อาทิตย์ (10:00 - 16:00)',
        imageUrl: '',
    },

    // ================= NURSING =================
    {
        id: 6,
        deptId: 'nursing',
        prefix: 'พย.',
        name: 'สุดารัตน์ พรหมมา',
        specialty: 'พยาบาลประจำหอผู้ป่วยใน',
        schedule: 'กะเช้า (07:00 - 15:00)',
        imageUrl: '',
    },
    {
        id: 7,
        deptId: 'nursing',
        prefix: 'พย.',
        name: 'อรทัย สุขสันต์',
        specialty: 'พยาบาลห้องฉุกเฉิน',
        schedule: 'กะดึก (23:00 - 07:00)',
        imageUrl: '',
    },

    // ================= PHARMACY =================
    {
        id: 8,
        deptId: 'pharmacy',
        prefix: 'ภก.',
        name: 'ธนกฤต วัฒนกิจ',
        specialty: 'เภสัชกรคลินิก',
        schedule: 'จันทร์ - ศุกร์ (08:00 - 17:00)',
        imageUrl: '',
    },

    // ================= MEDICAL TECHNOLOGY =================
    {
        id: 9,
        deptId: 'medical-technology',
        prefix: 'นท.',
        name: 'พิชญา สุวรรณ',
        specialty: 'นักเทคนิคการแพทย์',
        schedule: 'จันทร์ - ศุกร์ (08:00 - 16:00)',
        imageUrl: '',
    },

    // ================= RADIOLOGY =================
    {
        id: 10,
        deptId: 'radiology',
        prefix: 'นร.',
        name: 'วรพล อินทร์ทอง',
        specialty: 'นักรังสีการแพทย์',
        schedule: 'จันทร์ - เสาร์ (08:00 - 15:00)',
        imageUrl: '',
    },

    // ================= REHABILITATION =================
    {
        id: 11,
        deptId: 'rehabilitation',
        prefix: 'กภ.',
        name: 'ชลธิชา รัตนชัย',
        specialty: 'นักกายภาพบำบัด',
        schedule: 'จันทร์ - ศุกร์ (09:00 - 17:00)',
        imageUrl: '',
    },

    // ================= TRADITIONAL MEDICINE =================
    {
        id: 12,
        deptId: 'traditional-medicine',
        prefix: 'พท.',
        name: 'ประภัสสร ไทยรักษ์',
        specialty: 'แพทย์แผนไทยประยุกต์',
        schedule: 'จันทร์ - เสาร์ (09:00 - 16:00)',
        imageUrl: '',
    },

    // ================= SUPPORT SERVICES =================
    {
        id: 13,
        deptId: 'support-services',
        prefix: '',
        name: 'มนัส เทคโน',
        specialty: 'เจ้าหน้าที่เทคโนโลยีสารสนเทศ',
        schedule: 'จันทร์ - ศุกร์',
        imageUrl: '',
    },

    // ================= ADMINISTRATION =================
    {
        id: 14,
        deptId: 'administration',
        prefix: '',
        name: 'กมลวรรณ บริหาร',
        specialty: 'ผู้จัดการฝ่ายบริหาร',
        schedule: 'จันทร์ - ศุกร์',
        imageUrl: '',
    },

    // ================= INSURANCE =================
    {
        id: 15,
        deptId: 'insurance-coordination',
        prefix: '',
        name: 'ศุภชัย ประกันดี',
        specialty: 'เจ้าหน้าที่ประสานงานประกันสุขภาพ',
        schedule: 'จันทร์ - ศุกร์',
        imageUrl: '',
    },

  // ================= CUSTOMER SERVICES =================
    {
        id: 16,
        deptId: 'customer-services',
        prefix: '',
        name: 'ณัฐกานต์ บริการดี',
        specialty: 'เจ้าหน้าที่ประชาสัมพันธ์',
        schedule: 'ทุกวัน (08:00 - 20:00)',
        imageUrl: '',
    },
]
