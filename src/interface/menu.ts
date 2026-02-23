export interface Menu {
    title: string;

}


export const Menu = [
    {
        id: 1,
        name: "หน้าหลัก",
        link: "/",
    },
    {
        id: 2,
        name: "เกี่ยวกับเรา",
        submenu: [
            { name: "ประวัติ", link: "/about/history" },
            { name: "ทีมแพทย์", link: "/about/doctor" },
            { name: "ข้อมูลความปลอดภัยด้านยา", link: "/about" },
        ],
    },
    {
        id: 3,
        name: "ITA",
        submenu: [
            { name: "ITA2569", link: "/menu/info" },
            { name: "ITA2568", link: "/menu/info2" },
            { name: "ITA2567", link: "/menu/info3" },
            { name: "ITA2566", link: "/menu/info4" },
        ],
        link: "/menu",
    },
    {
        id: 4,
        name: "บริการ",
        link: "/services",
    },
    {
        id: 5,
        name: "ข่าวสาร",
        link: "/new/",
    },
    {
        id: 6,
        name: "เอกสาร",
        link: "/document/",
    },
    {
        id: 7,
        name: "แจ้งเรื่องร้องเรียน",
        link: "https://docs.google.com/forms/d/e/1FAIpQLSf-eXzBupBhvbSV38ODgt41RCn9zEA6DdBP5FcJtpG9yAtddA/viewform?usp=send_form",
    },
];