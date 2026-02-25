import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/about/contact/')({
  component: RouteComponent,
})

function RouteComponent() {
  // 1. State สำหรับเก็บข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'ประชาสัมพันธ์', // ค่า Default
    link: '',
    imgUrl: '',
    fileUrl: ''
  });

  // ฟังก์ชันเวลากรอกข้อมูล แล้วให้ State เปลี่ยนตาม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. ฟังก์ชันกดปุ่ม Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // กันหน้าเว็บ Refresh เอง

    try {
      const response = await fetch('http://localhost:8080/news', { // URL Backend เรา
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // แปลงข้อมูลเป็น JSON ส่งไป
      });

      if (response.ok) {
        alert('✅ บันทึกข่าวสำเร็จ!');
        // เคลียร์ฟอร์มหลังส่งเสร็จ
        setFormData({ title: '', description: '', date: '', type: 'ประชาสัมพันธ์', link: '', imgUrl: '', fileUrl: '' });
      } else {
        alert('❌ เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ เชื่อมต่อ Server ไม่ได้');
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Admin: เพิ่มข่าวใหม่</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* หัวข้อข่าว */}
        <div>
          <label className="block text-sm font-medium text-gray-700">หัวข้อข่าว</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="เช่น เปิดบริการฉีดวัคซีน..."
          />
        </div>

        {/* ประเภทข่าว */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ประเภท</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="ประชาสัมพันธ์">ประชาสัมพันธ์</option>
            <option value="กิจกรรม">กิจกรรม</option>
            <option value="ประกาศจัดซื้อจัดจ้าง">ประกาศจัดซื้อจัดจ้าง</option>
          </select>
        </div>

        {/* วันที่ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">วันที่</label>
          <input
            type="text" // หรือใช้ type="date" ก็ได้
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="เช่น 25 ก.พ. 67"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        {/* รายละเอียด */}
        <div>
          <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="รายละเอียดข่าว..."
          />
        </div>

        {/* ลิงก์รูปภาพ (แบบ URL ไปก่อน) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ลิงก์รูปภาพ (URL)</label>
          <input
            type="text"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

         {/* ลิงก์ไฟล์เอกสาร */}
         <div>
          <label className="block text-sm font-medium text-gray-700">ลิงก์เอกสาร (ถ้ามี)</label>
          <input
            type="text"
            name="fileUrl"
            value={formData.fileUrl}
            onChange={handleChange}
            placeholder="https://example.com/doc.pdf"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        {/* ปุ่ม Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}
