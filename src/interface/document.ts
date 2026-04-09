export interface Document {
    id: number;
    title: string;
    items?: Document[];
    fileUrl?: string;
}

export const documentList: Document[] = [
    { 
        id: 1, 
        title: "ใบลาและการขออนุมัติ",
        items: [
            { id: 101, title: "แบบฟอร์มใบลากิจส่วนตัว ลาป่วย ลาคลอดบุตร", fileUrl: "/documents/leavefrom/leave-form.pdf" },
            { id: 102, title: "แบบฟอร์มใบยกเลิกวันลา", fileUrl: "/documents/leavefrom/leave-cancel.pdf" },
            { id: 103, title: "แบบฟอร์มขออนุมัติลาพักผ่อน", fileUrl: "/documents/leavefrom/annual-leave-form.pdf" },
        ],
    },
   {
    id: 3,
    title: "งานการเงิน",
    items: [
        { id: 301, title: "แบบฟอร์มเบิกจ่ายค่ารักษาพยาบาล", fileUrl: "/documents/payment/medical-reimbursement.pdf" },
        { id: 302, title: "แบบฟอร์มเบิกจ่ายค่าเล่าเรียนบุตร", fileUrl: "/documents/payment/education-reimbursement.pdf" },
        { id: 303, title: "แบบฟอร์มขอหนังสือรับรองเงินเดือนและรับรองการทำงาน", fileUrl: "/documents/payment/certificate-request.pdf" },
        { id: 304, title: "แบบฟอร์มเบิกค่าใช้จ่ายเดินทางไปราชการ 1", fileUrl: "/documents/payment/travel-expense-1.pdf" },
        { id: 305, title: "แบบฟอร์มเบิกค่าใช้จ่ายเดินทางไปราชการ 2", fileUrl: "/documents/payment/travel-expense-2.pdf" },
        { id: 306, title: "แบบฟอร์มสัญญายืมเงิน", fileUrl: "/documents/payment/loan-agreement.pdf" },
        { id: 307, title: "แบบฟอร์มใบรับรองแทนใบเสร็จ", fileUrl: "/documents/payment/receipt-replacement.pdf" },
        { id: 308, title: "แบบฟอร์มใบสำคัญรับเงิน", fileUrl: "/documents/payment/payment-voucher.pdf" },
        { id: 309, title: "แบบฟอร์มใบสำคัญรับเงินวิทยากร", fileUrl: "/documents/payment/speaker-payment.pdf" },
    ]
    },
    {
        id: 4,
        title: "งานพัสดุ",
        items: [
            { id: 401, title: "แบบฟอร์มขอซ่อมพัสดุชำรุด", fileUrl: "/documents/parcel/proc-repair.pdf" },
            { id: 402, title: "แบบฟอร์มขออนุมัติจัดดำเนินการจัดหาพัสดุ", fileUrl: "/documents/parcel/proc-request.pdf" },
        ],
    },
    {
        id: 5,
        title: "งานธุรการ",
        items: [
            { id: 501, title: "แบบฟอร์มขออนุมัติเดินทางไปราชการ", fileUrl: "/documents/administrative/admin-travel.pdf" },
            { id: 502, title: "แบบฟอร์มขอใช้รถราชการ", fileUrl: "/documents/administrative/admin-vehicle.pdf" },
        ],
    },
    
];