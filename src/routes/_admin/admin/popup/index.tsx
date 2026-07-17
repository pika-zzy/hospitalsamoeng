import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { requestAPI } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CloudUpload, ImageOff, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/popup/')({
  component: RouteComponent,
})

interface Popup {
  ID: number
  Status: boolean
  ImageURL: string
}

const API_URL = import.meta.env.VITE_API_URL

function RouteComponent() {
  const qc = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { data: popup, isLoading } = useQuery<Popup | null>({
    queryKey: ['popup'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const resp = await requestAPI<Popup>({ method: 'GET', url: '/popup' })
      return resp.success ? resp.data : null
    },
  })

  const toggleStatus = useMutation({
    mutationFn: (status: boolean) =>
      requestAPI({ method: 'PATCH', url: '/popup/status', body: { status } }),
    onSuccess: (_data, status) => {
      toast.success(status ? 'เปิดการแสดง Popup แล้ว' : 'ปิดการแสดง Popup แล้ว')
      qc.invalidateQueries({ queryKey: ['popup'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const uploadImage = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData()
      form.append('image', file)
      return requestAPI({ method: 'POST', url: '/popup/image', body: form })
    },
    onSuccess: (resp) => {
      if (!resp.success) {
        toast.error(resp.message || 'อัปโหลดรูปไม่สำเร็จ')
        return
      }
      toast.success('เปลี่ยนรูป Popup สำเร็จ')
      setSelectedFile(null)
      qc.invalidateQueries({ queryKey: ['popup'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('อัปโหลดได้เฉพาะไฟล์รูปภาพ (.jpg/.jpeg/.png)')
      return
    }
    setSelectedFile(file)
  }

  const status = popup?.Status ?? false
  const currentImage = popup?.ImageURL ? `${API_URL}${popup.ImageURL}` : ''
  // แสดง preview จากไฟล์ที่เพิ่งเลือก ถ้ายังไม่เลือกใช้รูปปัจจุบันจาก server
  const previewSrc = selectedFile ? URL.createObjectURL(selectedFile) : currentImage

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto w-full text-ink">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">จัดการ Popup</h1>
        <p className="text-sm mt-1 text-muted">
          ตั้งค่า Popup ประชาสัมพันธ์ที่จะแสดงเมื่อผู้ใช้เข้าหน้าเว็บไซต์ (มีได้ 1 รายการทั้งเว็บ)
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted text-center py-16">กำลังโหลด...</p>
      ) : (
        <div className="space-y-6">
          {/* สวิตช์เปิด/ปิด */}
          <div className="rounded-md border border-line bg-white p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">แสดง Popup บนหน้าเว็บ</p>
              <p className="text-xs text-muted mt-1">
                {status ? 'กำลังแสดง Popup ให้ผู้ใช้เห็น' : 'ปิดอยู่ — ผู้ใช้จะไม่เห็น Popup'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={status}
              disabled={toggleStatus.isPending}
              onClick={() => toggleStatus.mutate(!status)}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                status ? 'bg-teal' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  status ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* รูปภาพ Popup + preview */}
          <div className="rounded-md border border-line bg-white p-6 space-y-4">
            <div>
              <Label className="text-sm font-semibold text-ink">รูปภาพ Popup</Label>
              <p className="text-xs text-muted mt-1">รองรับไฟล์ .jpg .jpeg .png</p>
            </div>

            {previewSrc ? (
              <div className="relative w-full rounded-sm overflow-hidden border border-line bg-paper">
                <img src={previewSrc} alt="ตัวอย่าง Popup" className="w-full max-h-105 object-contain mx-auto" />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full h-8 w-8 shadow-md"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-40 rounded-sm border border-dashed border-line bg-paper/50 text-faint">
                <ImageOff className="w-7 h-7 mb-2" strokeWidth={1.5} />
                <p className="text-sm">ยังไม่มีรูป Popup</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 h-11 rounded-sm border-2 border-dashed border-line cursor-pointer bg-paper/50 hover:bg-paper hover:border-teal transition-colors text-sm text-muted">
                <CloudUpload className="w-5 h-5 text-faint" strokeWidth={1.5} />
                <span>
                  <span className="font-semibold text-teal">เลือกรูปภาพ</span> เพื่อเปลี่ยน Popup
                </span>
                <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleFileChange} />
              </label>

              <Button
                type="button"
                disabled={!selectedFile || uploadImage.isPending}
                className="h-11 px-6 bg-teal hover:bg-teal/90 text-white font-semibold rounded-sm transition-colors disabled:opacity-50"
                onClick={() => selectedFile && uploadImage.mutate(selectedFile)}
              >
                {uploadImage.isPending ? 'กำลังบันทึก...' : 'บันทึกรูป'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
