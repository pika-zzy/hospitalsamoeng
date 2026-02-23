import { newInfoList } from '@/interface/newinfo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/new/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const news = newInfoList.find(
    (item) => item.id === Number(id)
  )

  if (!news) {
    return <div className="p-6">ไม่พบข่าว</div>
  }

  return (
    <>
    <div className='bg-gray-100 min-h-screen'>
      {news.type === 'job' && ( <p className="text-2xl text-blue-600 font-semibold text-center py-4">ข่าวรับสมัครงาน</p> )}
      {news.type === 'general' && ( <p className="text-2xl text-green-600 font-semibold text-center py-4">ข่าวประชาสัมพันธ์ทั่วไป</p> )}
      <div className="max-w-3xl mx-auto p-6">
        
        <div className="bg-white rounded-2xl shadow-md p-6">
          <img src={news.imgUrl} alt={news.title} className="w-full h-auto rounded-2xl mb-6" />
          <h1 className="text-xl font-bold mb-4">{news.title}</h1>
          <p className="text-gray-500 mb-2">เผยแพร่เมื่อ: {news.date}</p>
          <p className="text-lg text-gray-700">รายละเอียด/เงื่อนไข: {news.description}</p>
        </div>
    </div>
    </div>
      
    </>
    
  )
}
