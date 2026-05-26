
//import hospitalImg from "/src/assets/iioo.jpg"
import { Link } from "@tanstack/react-router";
import hospitalsamoeng from "../../../assets/S__7766030.jpg"


{/*const Info = [
    
    {
        id: 1,
        name: "บริการตรวจรักษาโรคทั่วไป",
        discription : " บริการตรวจรักษาโรคทั่วไปในเวลาราชการตั้งแต่เวลา 08:00น. - 16:00น."
    },

    {
        id: 2,
        name: "บริการด้านปฐมภูมิและองค์รวม",
        discription : "บริการคลินิกประจำวันสามารถตรวจสอบวันให้บริการได้ตามตารางให้บริการคลินิก"
    },

    {
        id: 3,
        name: "ห้องอุบัติเหตุและฉุกเฉิน",
        discription : "เปิดบริการตลอด 24 ชั่วโมงสายด่วนฉุกเฉิน "
    },
    
    {
        id: 4,
        name: "บริการคลินิกทันตกรรม",
        discription : "บริการคลินิกทันตกรรมในเวลาราชการตั้งแต่เวลา 08:00น. - 16:00น."
    },
    
    {
        id: 5,
        name: "บริการแพทย์แผนไทย",
        discription : "บริการแพทย์แผนไทย และกายภาพบำบัดในเวลาราชการตั้งแต่เวลา 08:00น. - 16:00น."
    },
    {
        id : 6 ,
        name   : "บริการคลินิกตรวจตา",
        discription : "บริการคลินิกตรวจตาในเวลาราชการตั้งแต่เวลา 08:00น. - 16:00น"
    },


];
*/}


export default function Main_page() {

    return (
        <>
            {/* Hero Section - ปรับให้ดูแกรนด์และอ่านง่ายขึ้น */}
            <div 
                className="relative w-full h-125 bg-cover bg-center flex items-center mb-16 overflow-hidden"
                style={{ backgroundImage: `url(${hospitalsamoeng})` }}
            >
                {/* Gradient Overlay: ช่วยให้ข้อความสีขาวเด่นชัดขึ้น */}
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12">
                <div className="max-w-2xl pt-15 ">
  <h2 className="text-5xl md:text-5xl lg:text-7xl font-sarabun font-bold text-white leading-snug drop-shadow-lg mb-4">
    ยินดีต้อนรับสู่ <br />
    <span className="text-green-400 text-5xl md:text-6xl lg:text-7xl leading-none">โรงพยาบาลสะเมิง</span>
  </h2>
  <div className="h-1 w-16 bg-green-400 mb-6 rounded-full"></div>
  <p className="text-3xl md:text-lg lg:text-3xl font-sarabun text-gray-200 leading-none">
    เราให้บริการทางการแพทย์ที่หลากหลาย <br />
    เข้าถึงง่าย ด้วยมาตรฐานสากล เพื่อสุขภาวะที่ดีของชุมชน
  </p>
  <Link to={"/about/contact"}>
    <button className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
      ติดต่อเรา
    </button>
  </Link>
</div>
                </div>
            </div>
        </>
    );
}   