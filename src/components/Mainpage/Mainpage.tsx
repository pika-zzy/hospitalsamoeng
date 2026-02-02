export default function Main_page() {
    return (
        <>
            <div className="container mx-auto mt-10">
                <div className="mt-4">
                            <h2 className="text-2xl font-semibold mb-4 text-center">ยินดีต้อนรับสู่โรงพยาบาลสะเมิง</h2>
                            <p className="text-gray-700 text-center">
                                เราให้บริการทางการแพทย์ที่หลากหลายเพื่อความสมบูรณ์ของคุณ
                            </p>
                        </div>
                <div className="px-2 mb-28 flex justify-center">
                    <div className="w-250 min-h-105 group relative bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300">

                        <img
                        src="/src/assets/iioo.jpg"
                        alt="Hospital"
                        className="w-full h-60 object-cover rounded-lg group-hover:scale-[1.02] transition duration-300"
                        />

                        <div className="mt-4">
                        <h3 className="text-lg font-semibold">
                            โรงพยาบาลสะเมิง
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            ข้อมูลเบื้องต้นเกี่ยวกับโรงพยาบาล
                        </p>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}