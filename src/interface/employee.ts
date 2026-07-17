// กลุ่มงาน (ฝ่ายงาน) — sync ตาม Excel รายชื่อเจ้าหน้าที่โรงพยาบาลสะเมิง 4 มิ.ย. 2569
export const departments = [
    { id: 'hospital-director', name: 'ผู้อำนวยการโรงพยาบาล' },
    { id: 'medical', name: 'กลุ่มงานการแพทย์' },
    { id: 'nursing', name: 'กลุ่มงานการพยาบาล' },
    { id: 'primary-care', name: 'กลุ่มงานบริการด้านปฐมภูมิและองค์รวม' },
    { id: 'dentistry', name: 'กลุ่มงานทันตกรรม' },
    { id: 'pharmacy', name: 'กลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค' },
    { id: 'thai-medicine', name: 'กลุ่มงานการแพทย์แผนไทยและการแพทย์ทางเลือก' },
    { id: 'rehabilitation', name: 'กลุ่มงานเวชกรรมฟื้นฟู' },
    { id: 'radiology', name: 'กลุ่มงานรังสีวิทยา' },
    { id: 'medical-technology', name: 'กลุ่มงานเทคนิคการแพทย์' },
    { id: 'insurance-strategy', name: 'กลุ่มงานประกันสุขภาพ ยุทธศาสตร์และสารสนเทศทางการแพทย์' },
    { id: 'administration', name: 'กลุ่มงานบริหารงานทั่วไป' },
]

// list ตำแหน่ง (position) — เป็น "ลูก" ของฝ่ายงาน ผูกด้วย deptId (= departments[].id)
// UI ให้เลือกฝ่ายงานก่อน แล้วกรองตำแหน่งด้วย deptId; ความสัมพันธ์นี้เป็นแค่กติกาฝั่ง frontend
// (backend เก็บ role/position เป็น string เฉย ๆ) — sync ตาม Excel รายชื่อเจ้าหน้าที่ 4 มิ.ย. 2569
export const positions = [
    // hospital-director — ผู้อำนวยการโรงพยาบาล
    { id: 'hospital-director-1', deptId: 'hospital-director', name: 'ผู้อำนวยการโรงพยาบาล' },

    // medical — กลุ่มงานการแพทย์
    { id: 'medical-1', deptId: 'medical', name: 'นายแพทย์ชำนาญการพิเศษ' },
    { id: 'medical-2', deptId: 'medical', name: 'นายแพทย์ชำนาญการ' },
    { id: 'medical-3', deptId: 'medical', name: 'นายแพทย์ปฏิบัติการ' },

    // nursing — กลุ่มงานการพยาบาล
    { id: 'nursing-1', deptId: 'nursing', name: 'พยาบาลวิชาชีพชำนาญการพิเศษ' },
    { id: 'nursing-2', deptId: 'nursing', name: 'พยาบาลวิชาชีพชำนาญการ' },
    { id: 'nursing-3', deptId: 'nursing', name: 'พยาบาลวิชาชีพปฏิบัติการ' },
    { id: 'nursing-4', deptId: 'nursing', name: 'พยาบาลวิชาชีพ' },
    { id: 'nursing-5', deptId: 'nursing', name: 'เจ้าพนักงานสาธารณสุข' },
    { id: 'nursing-6', deptId: 'nursing', name: 'พนักงานช่วยเหลือคนไข้ ส 3' },
    { id: 'nursing-7', deptId: 'nursing', name: 'พนักงานช่วยเหลือคนไข้' },
    { id: 'nursing-8', deptId: 'nursing', name: 'พนักงานซักฟอก' },
    { id: 'nursing-9', deptId: 'nursing', name: 'พนักงานบริการ' },
    { id: 'nursing-10', deptId: 'nursing', name: 'พนักงานเปล' },

    // primary-care — กลุ่มงานบริการด้านปฐมภูมิและองค์รวม
    { id: 'primary-care-1', deptId: 'primary-care', name: 'พยาบาลวิชาชีพชำนาญการ' },
    { id: 'primary-care-2', deptId: 'primary-care', name: 'นักวิชาการสาธารณสุขปฏิบัติการ' },
    { id: 'primary-care-3', deptId: 'primary-care', name: 'นักวิชาการสาธารณสุข' },
    { id: 'primary-care-4', deptId: 'primary-care', name: 'นักจิตวิทยา' },
    { id: 'primary-care-5', deptId: 'primary-care', name: 'พนักงานช่วยเหลือคนไข้' },
    { id: 'primary-care-6', deptId: 'primary-care', name: 'พนักงานบริการ' },
    { id: 'primary-care-7', deptId: 'primary-care', name: 'พนักงานบริการเอกสารทั่วไป' },

    // dentistry — กลุ่มงานทันตกรรม
    { id: 'dentistry-1', deptId: 'dentistry', name: 'ทันตแพทย์เชี่ยวชาญ' },
    { id: 'dentistry-2', deptId: 'dentistry', name: 'ทันตแพทย์ชำนาญการ' },
    { id: 'dentistry-3', deptId: 'dentistry', name: 'จพ.ทันตสาธารณสุขชำนาญงาน' },
    { id: 'dentistry-4', deptId: 'dentistry', name: 'จพ.ทันตสาธารณสุขปฏิบัติงาน' },
    { id: 'dentistry-5', deptId: 'dentistry', name: 'พนักงานช่วยเหลือคนไข้' },

    // pharmacy — กลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค
    { id: 'pharmacy-1', deptId: 'pharmacy', name: 'เภสัชกรชำนาญการ' },
    { id: 'pharmacy-2', deptId: 'pharmacy', name: 'เภสัชกร' },
    { id: 'pharmacy-3', deptId: 'pharmacy', name: 'จพ.เภสัชกรรมปฏิบัติงาน' },
    { id: 'pharmacy-4', deptId: 'pharmacy', name: 'พนักงานเภสัชกรรม' },
    { id: 'pharmacy-5', deptId: 'pharmacy', name: 'พนักงานบริการ' },

    // thai-medicine — กลุ่มงานการแพทย์แผนไทยและการแพทย์ทางเลือก
    { id: 'thai-medicine-1', deptId: 'thai-medicine', name: 'แพทย์แผนไทยชำนาญการ' },
    { id: 'thai-medicine-2', deptId: 'thai-medicine', name: 'แพทย์แผนไทยปฏิบัติการ' },
    { id: 'thai-medicine-3', deptId: 'thai-medicine', name: 'จพ.สาธารณสุข(แพทย์แผนไทย)ปฏิบัติงาน' },
    { id: 'thai-medicine-4', deptId: 'thai-medicine', name: 'พนักงานช่วยการพยาบาล' },

    // rehabilitation — กลุ่มงานเวชกรรมฟื้นฟู
    { id: 'rehabilitation-1', deptId: 'rehabilitation', name: 'นักกายภาพบำบัดชำนาญการ' },
    { id: 'rehabilitation-2', deptId: 'rehabilitation', name: 'นักกิจกรรมบำบัดชำนาญการ' },
    { id: 'rehabilitation-3', deptId: 'rehabilitation', name: 'นักกายภาพบำบัดปฏิบัติการ' },
    { id: 'rehabilitation-4', deptId: 'rehabilitation', name: 'ผู้ช่วยนักกายภาพบำบัด' },

    // radiology — กลุ่มงานรังสีวิทยา
    { id: 'radiology-1', deptId: 'radiology', name: 'จพ.รังสีการแพทย์ชำนาญงาน' },
    { id: 'radiology-2', deptId: 'radiology', name: 'พนักงานการแพทย์และรังสีเทคนิค' },

    // medical-technology — กลุ่มงานเทคนิคการแพทย์
    { id: 'medical-technology-1', deptId: 'medical-technology', name: 'นักเทคนิคการแพทย์ชำนาญการ' },
    { id: 'medical-technology-2', deptId: 'medical-technology', name: 'นักเทคนิคการแพทย์ปฏิบัติการ' },
    { id: 'medical-technology-3', deptId: 'medical-technology', name: 'เจ้าพนักงานวิทยาศาสตร์การแพทย์' },
    { id: 'medical-technology-4', deptId: 'medical-technology', name: 'พนักงานบริการ' },

    // insurance-strategy — กลุ่มงานประกันสุขภาพ ยุทธศาสตร์และสารสนเทศทางการแพทย์
    { id: 'insurance-strategy-1', deptId: 'insurance-strategy', name: 'พยาบาลวิชาชีพปฏิบัติการ' },
    { id: 'insurance-strategy-2', deptId: 'insurance-strategy', name: 'นักวิชาการสาธารณสุขปฏิบัติการ' },
    { id: 'insurance-strategy-3', deptId: 'insurance-strategy', name: 'จพ.เวชสถิติปฏิบัติงาน' },
    { id: 'insurance-strategy-4', deptId: 'insurance-strategy', name: 'นักวิชาการเงินและบัญชี' },
    { id: 'insurance-strategy-5', deptId: 'insurance-strategy', name: 'พนักงานบัตรรายงานโรค' },
    { id: 'insurance-strategy-6', deptId: 'insurance-strategy', name: 'เจ้าพนักงานเครื่องคอมพิวเตอร์' },
    { id: 'insurance-strategy-7', deptId: 'insurance-strategy', name: 'นักวิชาการคอมพิวเตอร์' },
    { id: 'insurance-strategy-8', deptId: 'insurance-strategy', name: 'พนักงานบริการ' },

    // administration — กลุ่มงานบริหารงานทั่วไป
    { id: 'administration-1', deptId: 'administration', name: 'นักจัดการงานทั่วไปชำนาญงาน' },
    { id: 'administration-2', deptId: 'administration', name: 'จพ.พัสดุชำนาญงาน' },
    { id: 'administration-3', deptId: 'administration', name: 'นักโภชนาการปฏิบัติการ' },
    { id: 'administration-4', deptId: 'administration', name: 'จพ.ธุรการปฏิบัติงาน' },
    { id: 'administration-5', deptId: 'administration', name: 'นักวิชาการเงินและบัญชี' },
    { id: 'administration-6', deptId: 'administration', name: 'นักวิชาการพัสดุ' },
    { id: 'administration-7', deptId: 'administration', name: 'นักจัดการงานทั่วไป' },
    { id: 'administration-8', deptId: 'administration', name: 'เจ้าพนักงานการเงินและบัญชี' },
    { id: 'administration-9', deptId: 'administration', name: 'ช่างไฟฟ้าและอิเล็กทรอนิกส์ ช2' },
    { id: 'administration-10', deptId: 'administration', name: 'พนักงานขับรถยนต์' },
    { id: 'administration-11', deptId: 'administration', name: 'พนักงานเกษตรพื้นฐาน' },
    { id: 'administration-12', deptId: 'administration', name: 'นายช่างไฟฟ้า' },
    { id: 'administration-13', deptId: 'administration', name: 'พนักงานบริการ' },
]
