export interface Document {
    id: number;
    title: string;
    items?: Document[];
    fileUrl?: string;
}

export const documentList: Document[] = [
    { 
        id: 1, 
        title: "งานจังหวัด",
        items: [
            { id: 101, title: "ใบลากิจ", fileUrl: "/documents/leave-form.pdf" },
            { id: 102, title: "ใบลาคลอด", fileUrl: "/documents/maternal-leave-form.pdf" },
            ],
    },
    { 
        id: 2, 
        title: "งานบุคคล",
        items: [
            { id: 201, title: "แบบฟอร์มขออนุมัติลาพักผ่อน", fileUrl: "/documents/annual-leave-form.pdf" },
            { id: 202, title: "แบบฟอร์มขออนุมัติลาป่วย", fileUrl: "/documents/sick-leave-form.pdf" },
            ],
    },
    { 
        id: 3,
        title: "งานการเงิน",
        items: [
            { id: 301, title: "แบบฟอร์มขอเบิกค่าใช้จ่าย", fileUrl: "/documents/reimbursement-form.pdf" },
            { id: 302, title: "แบบฟอร์มขออนุมัติซื้อวัสดุ", fileUrl: "/documents/purchase-material-form.pdf" },
            ],
    },
    { 
        id: 4,
        title: "งานพัสดุ",
        items: [
            { id: 401, title: "แบบฟอร์มขออนุมัติจัดซื้อ", fileUrl: "/documents/purchase-request-form.pdf" },
            { id: 402, title: "แบบฟอร์มขออนุมัติจัดจ้าง", fileUrl: "/documents/procurement-request-form.pdf" },
        ],
    },
    
];