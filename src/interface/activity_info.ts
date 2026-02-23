
export default interface ActivityInfo {
    id: string;
    name: string;
    description: string;
    type: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive' | 'completed';
    updatedAt: string;
    imgUrl: string;
}

export const sampleActivities: ActivityInfo[] = [
    {
        id: '1',
        name: 'กิจกรรมตรวจสุขภาพประจำปี',
        description: 'กิจกรรมตรวจสุขภาพประจำปีสำหรับพนักงานโรงพยาบาลสะเมิง',
        type: 'health', 
        startDate: '2024-06-01',
        endDate: '2024-06-15',
        status: 'active',
        updatedAt: '2024-06-15',
        imgUrl: 'https://panaceehospital.com/uploads/posts/1655433962_WEB-01.png',
    },
    {
        id: '2',
        name: 'กิจกรรมวิ่งการกุศล',
        description: 'กิจกรรมวิ่งการกุศลเพื่อระดมทุนสนับสนุนโครงการสุขภาพชุมชน',
        type: 'charity',
        startDate: '2024-08-10',
        endDate: '2024-08-10',
        status: 'inactive',
        updatedAt: '2024-06-20',
        imgUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
    },
    {
        id: '3',
        name: 'กิจกรรมอบรมการปฐมพยาบาล',
        description: 'กิจกรรมอบรมการปฐมพยาบาลเบื้องต้นสำหรับประชาชนทั่วไป',
        type: 'education',
        startDate: '2024-09-15',
        endDate: '2024-09-15',
        status: 'completed',
        updatedAt: '2024-09-16',
        imgUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    },
    {
        id: '4',
        name: 'กิจกรรมปลูกต้นไม้เพื่อสิ่งแวดล้อม',
        description: 'กิจกรรมปลูกต้นไม้เพื่อส่งเสริมความยั่งยืนและรักษาสิ่งแวดล้อม',
        type: 'environment',
        startDate: '2024-10-01',
        endDate: '2024-10-01',
        status: 'active',
        updatedAt: '2024-06-30',
        imgUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
    },
    {
        id: '5',
        name: 'กิจกรรมสอนการออกกำลังกาย',
        description: 'กิจกรรมสอนการออกกำลังกายเพื่อส่งเสริมสุขภาพและความแข็งแรง',
        type: 'fitness',
        startDate: '2024-11-05',
        endDate: '2024-11-05',
        status: 'inactive',
        updatedAt: '2024-07-05',
        imgUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    },
    {
        id: '6',
        name: 'กิจกรรมบริจาคโลหิต',
        description: 'กิจกรรมบริจาคโลหิตเพื่อช่วยเหลือผู้ป่วยที่ต้องการโลหิต',
        type: 'charity', 
        startDate: '2024-12-10',
        endDate: '2024-12-10',
        status: 'active',
        updatedAt: '2024-07-10',
        imgUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    },
    {
        id: '7',
        name: 'กิจกรรมตรวจสุขภาพฟัน',
        description: 'กิจกรรมตรวจสุขภาพฟันและให้คำแนะนำการดูแลรักษาฟัน',
        type: 'health',
        startDate: '2025-01-15',
        endDate: '2025-01-15',
        status: 'active',
        updatedAt: '2024-07-15',
        imgUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93',
    },
    {
        id: '8',
        name: 'กิจกรรมอบรมการดูแลผู้สูงอายุ',
        description: 'กิจกรรมอบรมการดูแลผู้สูงอายุเพื่อให้ความรู้แก่ประชาชนทั่วไป',
        type: 'education',
        startDate: '2025-02-01',
        endDate: '2025-02-01',
        status: 'inactive',
        updatedAt: '2024-07-20',
        imgUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    },
    {
        id: '9',
        name: 'กิจกรรมทำความสะอาดสวนสาธารณะ',
        description: 'กิจกรรมทำความสะอาดสวนสาธารณะเพื่อส่งเสริมสิ่งแวดล้อมที่ดีขึ้น',
        type: 'environment',
        startDate: '2025-03-15',
        endDate: '2025-03-15',
        status: 'active',
        updatedAt: '2024-07-30',
        imgUrl: 'https://images.unsplash.com/photo-1579684385697-c3a8c9c7c7d4',
    },
    {
        id: '10',
        name: 'กิจกรรมอบรมการจัดการความเสี่ยง',
        description: 'กิจกรรมอบรมการจัดการความเสี่ยงเพื่อเพิ่มประสิทธิภาพในการบริการทางการแพทย์',
        type: 'education',
        startDate: '2025-04-01',
        endDate: '2025-04-01',
        status: 'active',
        updatedAt: '2024-08-01',
        imgUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    },
    {
        id: "   11",
        name: "กิจกรรมอบรมการจัดการความเสี่ยง",
        description: "กิจกรรมอบรมการจัดการความเสี่ยงเพื่อเพิ่มประสิทธิภาพในการบริการทางการแพทย์",
        type: "education",
        startDate: "2025-05-01",
        endDate: "2025-05-01",
        status: "inactive",
        updatedAt: "2024-08-01",
        imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },
    {
        id: "12",
        name: "กิจกรรมอบรมการจัดการความเสี่ยง",
        description: "กิจกรรมอบรมการจัดการความเสี่ยงเพื่อเพิ่มประสิทธิภาพในการบริการทางการแพทย์",
        type: "education",
        startDate: "2025-06-01",
        endDate: "2025-06-01",  
        status: "completed",
        updatedAt: "2024-08-01",
        imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },
    {
        id: "13",
        name: "กิจกรรมอบรมการจัดการความเสี่ยง",
        description: "กิจกรรมอบรมการจัดการความเสี่ยงเพื่อเพิ่มประสิทธิภาพในการบริการทางการแพทย์",
        type: "education",
        startDate: "2025-07-01",
        endDate: "2025-07-01",
        status: "active",
        updatedAt: "2024-08-01",
        imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },
    {
        id: "14",
        name: "กิจกรรมอบรมการจัดการความเสี่ยง",
        description: "กิจกรรมอบรมการจัดการความเสี่ยงเพื่อเพิ่มประสิทธิภาพในการบริการทางการแพทย์",
        type: "education",
        startDate: "2025-08-01",
        endDate: "2025-08-01",
        status: "inactive",
        updatedAt: "2024-08-01",
        imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    }

];