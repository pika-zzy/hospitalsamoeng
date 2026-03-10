import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'

import { requestAPI } from '@/lib/api'
import { Calendar, CloudUpload, Loader2, X } from 'lucide-react'
import type { CreateActivityDTO } from '@/interface/create_activity_dto'

export const Route = createFileRoute('/_admin/admin/activity/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [formData, setFormData] = useState<CreateActivityDTO>({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    image: null,
  })

  // สร้าง Preview URL สำหรับรูปภาพ
  const imagePreview = useMemo(() => {
    if (formData.image) return URL.createObjectURL(formData.image)
    return null
  }, [formData.image])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      })
    }
  }

  const addActivity = useMutation({
    mutationFn: async (data: CreateActivityDTO) => {
      const submitData = new FormData()
      submitData.append('title', data.title)
      submitData.append('description', data.description)
      submitData.append('startDate', data.startDate)
      submitData.append('endDate', data.endDate)
      if (data.image) submitData.append('image', data.image)

      return requestAPI({
        url: "/activities",
        method: "POST",
        body: submitData,
      })
    },
    onSuccess: () => {
      setFormData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        image: null,
      })
    },
  })

  return (
    <div className='min-h-screen bg-[#f4f6f8] py-10 px-4 md:px-8 flex justify-center font-sans'>
      <Card className='w-full max-w-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-0 rounded-2xl bg-white h-fit'>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              เพิ่มกิจกรรมใหม่
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              กรอกข้อมูลรายละเอียดกิจกรรมเพื่อประชาสัมพันธ์บนระบบ
            </p>
          </div>
          <div className="bg-green-50 p-2.5 rounded-xl text-green-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <hr className="border-gray-100 mb-6" />

        {/* Form Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addActivity.mutate(formData)
          }}
          className="space-y-6"
        >
          
          {/* File Upload with Preview */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-gray-700">รูปภาพหน้าปกกิจกรรม</Label>
            {imagePreview ? (
              <div className="relative w-full aspect-video md:aspect-21/9 rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 rounded-full h-8 w-8 opacity-90 hover:opacity-100 shadow-md"
                  onClick={() => setFormData({ ...formData, image: null })}
                >
                  <X className="h-4 w-4 bg-red-500  " />
                </Button>
              </div>
            ) : (
              <label 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-green-50/50 hover:border-green-400 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudUpload className="w-7 h-7 text-gray-400 mb-2" strokeWidth={1.5} />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-green-600">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                  </p>
                  <p className="text-[13px] text-gray-400 mt-1">
                    PNG, JPG ขนาดไม่เกิน 5MB
                  </p>
                </div>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png"
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2.5">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">หัวข้อกิจกรรม</Label>
            <Input
              id="title"
              type='text'
              name='title'
              required
              value={formData.title}
              onChange={handleChange}
              placeholder='เช่น กิจกรรมวิ่งมาราธอน 2024'
              className="w-full h-11 rounded-lg border-gray-200 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 focus-visible:border-green-500"
            />
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700">วันที่เริ่มกิจกรรม</Label>
              <Input
                id="startDate"
                type='date'
                name='startDate'
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full h-11 rounded-lg border-gray-200 text-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 focus-visible:border-green-500"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700">วันที่สิ้นสุดกิจกรรม</Label>
              <Input
                id="endDate"
                type='date'
                name='endDate'
                required
                value={formData.endDate}
                onChange={handleChange}
                className="w-full h-11 rounded-lg border-gray-200 text-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 focus-visible:border-green-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2.5">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">รายละเอียดกิจกรรม</Label>
            <textarea
              id="description"
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder="เขียนบรรยายรายละเอียดของกิจกรรมที่นี่..."
              className="flex w-full min-h-40 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-y"
            />
          </div>

          {/* Buttons Area */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="w-1/3 h-12 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
              onClick={() => window.history.back()}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={addActivity.isPending}
              className="w-2/3 h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base rounded-xl transition-all active:scale-[0.98]"
            >
              {addActivity.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  กำลังบันทึกข้อมูล...
                </>
              ) : (
                "บันทึกและเผยแพร่กิจกรรม"
              )}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  )
}