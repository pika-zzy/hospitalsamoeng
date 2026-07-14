import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'

import { requestAPI } from '@/lib/api'
import { CloudUpload, Loader2, X } from 'lucide-react'
import type { CreateActivityDTO } from '@/interface/create_activity_dto'

export const Route = createFileRoute('/_admin/admin/activity/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [formData, setFormData] = useState<CreateActivityDTO>({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    image: null,
  })

  // เปิด dialog หลังบันทึกสำเร็จ — ให้เลือกว่าจะเพิ่มกิจกรรมต่อ หรือไปดูหน้ารายการ
  const [savedOpen, setSavedOpen] = useState(false)

  const resetForm = () =>
    setFormData({
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
    // FIX: เดิม onSuccess แค่ล้างฟอร์มเฉย ๆ — ไม่มี toast/dialog, ไม่ invalidate cache และ
    // ไม่มี error handling เลย กดบันทึกแล้วเงียบสนิท ไม่รู้ว่าสำเร็จหรือพัง และหน้ารายการ
    // กิจกรรมยังเห็นข้อมูลเก่า. ตอนนี้แจ้งผลครบและเปิด Dialog ให้เลือกทำต่อ
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'บันทึกไม่สำเร็จ')
        return
      }
      qc.invalidateQueries({ queryKey: ['activity'] })
      resetForm()
      setSavedOpen(true)
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto w-full text-ink">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">เพิ่มกิจกรรมใหม่</h1>
        <p className="text-sm mt-1 text-muted">กรอกข้อมูลรายละเอียดกิจกรรมเพื่อประชาสัมพันธ์บนระบบ</p>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addActivity.mutate(formData)
        }}
        className="rounded-md border border-line bg-white p-6 sm:p-8 space-y-6"
      >

        {/* File Upload with Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted">รูปภาพหน้าปกกิจกรรม</Label>
          {imagePreview ? (
            <div className="relative w-full aspect-video md:aspect-21/9 rounded-sm overflow-hidden border border-line group">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 rounded-full h-8 w-8 opacity-90 hover:opacity-100 shadow-md"
                onClick={() => setFormData({ ...formData, image: null })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-line rounded-sm cursor-pointer bg-paper/50 hover:bg-paper hover:border-teal transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudUpload className="w-7 h-7 text-faint mb-2" strokeWidth={1.5} />
                <p className="text-sm text-muted">
                  <span className="font-semibold text-teal">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                </p>
                <p className="text-xs text-faint mt-1">
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
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-muted">หัวข้อกิจกรรม</Label>
          <Input
            id="title"
            type='text'
            name='title'
            required
            value={formData.title}
            onChange={handleChange}
            placeholder='เช่น กิจกรรมวิ่งมาราธอน 2024'
            className="w-full h-11 rounded-sm border-line text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/20 focus-visible:border-teal"
          />
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium text-muted">วันที่เริ่มกิจกรรม</Label>
            <Input
              id="startDate"
              type='date'
              name='startDate'
              required
              value={formData.startDate}
              onChange={handleChange}
              className="w-full h-11 rounded-sm border-line text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/20 focus-visible:border-teal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium text-muted">วันที่สิ้นสุดกิจกรรม</Label>
            <Input
              id="endDate"
              type='date'
              name='endDate'
              required
              value={formData.endDate}
              onChange={handleChange}
              className="w-full h-11 rounded-sm border-line text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/20 focus-visible:border-teal"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-muted">รายละเอียดกิจกรรม</Label>
          <textarea
            id="description"
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder="เขียนบรรยายรายละเอียดของกิจกรรมที่นี่..."
            className="flex w-full min-h-40 rounded-sm border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:ring-2 focus:ring-teal/20 focus:border-teal resize-y"
          />
        </div>

        {/* Buttons Area */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-1/3 h-12 rounded-sm border-line text-muted hover:bg-paper font-medium"
            onClick={() => window.history.back()}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={addActivity.isPending}
            className="w-2/3 h-12 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors"
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

      <Dialog
        open={savedOpen}
        title="บันทึกกิจกรรมสำเร็จ"
        description="กิจกรรมถูกเผยแพร่ขึ้นหน้าเว็บแล้ว ต้องการทำอะไรต่อ?"
        onClose={() => setSavedOpen(false)}
        actions={[
          { label: 'เพิ่มกิจกรรมอีก', variant: 'outline', onClick: () => setSavedOpen(false) },
          { label: 'ไปหน้ารายการกิจกรรม', onClick: () => navigate({ to: '/admin/activity/activity/summary' }) },
        ]}
      />
    </div>
  )
}