export interface Menu {
    title: string;

}


export const Navbarlist = [
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
        link: "/ita/",
    },
    {
        id: 5,
        name: "ข่าวสาร",
        link: "/news/",
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