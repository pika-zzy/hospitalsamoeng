import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Check, Power, Trash2, UserPlus, X } from 'lucide-react'
import { requestAPI } from '@/lib/api'
import { getUserId } from '@/lib/auth'
import type { SystemUser } from '@/interface/user'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { SummaryPageShell } from '@/components/summary-page-shell'


export const Route = createFileRoute('/_admin/admin/employee/staffservice/summary')({
  component: StaffSummaryPage,
})

// NOTE: password ขั้นต่ำ 8 ตัวเป็น policy ฝั่ง frontend — backend ยังไม่บังคับ
const addUserSchema = z.object({
  username: z.string().min(3, 'username อย่างน้อย 3 ตัวอักษร'),
  password: z.string().min(8, 'รหัสผ่านอย่างน้อย 8 ตัวอักษร'),
  role: z.enum(['employee', 'admin']),
})

type AddUserForm = z.infer<typeof addUserSchema>

function StaffSummaryPage() {
  const qc = useQueryClient()
  const currentUserId = getUserId()
  const [showAdd, setShowAdd] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const { data, isLoading } = useQuery<SystemUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const resp = await requestAPI<SystemUser[]>({ method: 'GET', url: '/users' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { username: '', password: '', role: 'employee' },
  })

  const invalidateUsers = () => qc.invalidateQueries({ queryKey: ['users'] })

  const addUser = useMutation({
    mutationFn: async (payload: AddUserForm) => {
      const resp = await requestAPI<SystemUser>({ method: 'POST', url: '/users', body: payload })
      // requestAPI ไม่ throw เอง — โยน message จาก backend ต่อให้ onError ใช้แสดง toast
      if (!resp.success) throw new Error(resp.message)
      return resp.data
    },
    onSuccess: () => {
      toast.success('เพิ่มผู้ใช้งานสำเร็จ')
      invalidateUsers()
      reset()
      setShowAdd(false)
    },
    onError: (e: Error) => toast.error(e.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const toggleStatus = useMutation({
    mutationFn: async (row: SystemUser) => {
      const resp = await requestAPI<SystemUser>({
        method: 'PATCH',
        url: `/users/${row.id}/status`,
        body: { is_active: !row.is_active },
      })
      if (!resp.success) throw new Error(resp.message)
      return resp.data
    },
    onSuccess: (updated) => {
      toast.success(updated.is_active ? 'เปิดใช้งานบัญชีแล้ว' : 'ปิดใช้งานบัญชีแล้ว')
      invalidateUsers()
    },
    onError: (e: Error) => toast.error(e.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'),
  })

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      const resp = await requestAPI({ method: 'DELETE', url: `/users/${id}` })
      if (!resp.success) throw new Error(resp.message)
    },
    onSuccess: () => {
      toast.success('ลบผู้ใช้งานสำเร็จ')
      invalidateUsers()
      setConfirmDeleteId(null)
    },
    onError: (e: Error) => {
      toast.error(e.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      setConfirmDeleteId(null)
    },
  })

  const columns: DataTableColumn<SystemUser>[] = [
    {
      key: 'id',
      header: 'ไอดี',
      render: (row) => row.id,
    },
    {
      key: 'username',
      header: 'ชื่อผู้ใช้',
      render: (row) => row.username,
      searchValue: (row) => row.username,
    },
    {
      key: 'role',
      header: 'สิทธิ์การใช้งาน',
      render: (row) => row.role,
      searchValue: (row) => row.role,
    },
    {
      key: 'status',
      header: 'สถานะ',
      render: (row) => (
        <span
          className={`text-xs px-2 py-0.5 rounded-sm border border-line ${
            row.is_active ? 'text-teal' : 'text-faint'
          }`}
        >
          {row.is_active ? 'ใช้งานอยู่' : 'ปิดใช้งาน'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'จัดการ',
      render: (row) => {
        // แถวของตัวเอง: backend กันปิด/ลบตัวเองอยู่แล้ว — ฝั่ง UI ปิดปุ่มไปเลยให้ชัด
        const isSelf = row.id === currentUserId
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleStatus.mutate(row)}
              disabled={isSelf || toggleStatus.isPending}
              title={isSelf ? 'ไม่สามารถปิดใช้งานบัญชีของตัวเองได้' : row.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
              className={`p-1.5 rounded-sm border border-line transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                row.is_active ? 'text-teal hover:bg-teal/10' : 'text-faint hover:bg-paper'
              }`}
            >
              <Power className="w-4 h-4" />
            </button>

            {confirmDeleteId === row.id ? (
              <>
                <button
                  onClick={() => deleteUser.mutate(row.id)}
                  disabled={deleteUser.isPending}
                  title="ยืนยันการลบ"
                  className="p-1.5 rounded-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  title="ยกเลิก"
                  className="p-1.5 rounded-sm border border-line text-faint hover:bg-paper transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(row.id)}
                disabled={isSelf}
                title={isSelf ? 'ไม่สามารถลบบัญชีของตัวเองได้' : 'ลบผู้ใช้งาน'}
                className="p-1.5 rounded-sm border border-line text-faint hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <SummaryPageShell
      crumbs={[
        { label: 'ภาพรวมระบบ', to: '/admin/dashboard' },
        { label: 'ผู้ใช้งานในระบบ' },
      ]}
      title="ผู้ใช้งานในระบบทั้งหมด"
      subtitle="รายชื่อผู้ใช้งานทั้งหมดในระบบ ค้นหาและจัดการได้จากตารางด้านล่าง"
    >
      {/* ── Add user ── */}
      <div className="mb-4">
        {showAdd ? (
          <form
            onSubmit={handleSubmit((values) => addUser.mutate(values))}
            className="rounded-md border border-line bg-white p-5"
          >
            <h2 className="text-sm font-semibold mb-4">เพิ่มผู้ใช้งานใหม่</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">ชื่อผู้ใช้</label>
                <input
                  {...register('username')}
                  autoComplete="off"
                  className="w-full text-sm px-3 py-2 rounded-sm border border-line bg-white outline-none focus:border-teal"
                />
                {errors.username && (
                  <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">รหัสผ่าน</label>
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="new-password"
                  className="w-full text-sm px-3 py-2 rounded-sm border border-line bg-white outline-none focus:border-teal"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">สิทธิ์การใช้งาน</label>
                <select
                  {...register('role')}
                  className="w-full text-sm px-3 py-2 rounded-sm border border-line bg-white outline-none focus:border-teal"
                >
                  <option value="employee">เจ้าหน้าที่ (employee)</option>
                  <option value="admin">ผู้ดูแลระบบ (admin)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button
                type="submit"
                disabled={addUser.isPending}
                className="text-sm px-4 py-2 rounded-sm bg-teal text-white font-semibold hover:bg-teal/90 transition-colors disabled:opacity-60"
              >
                {addUser.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset()
                  setShowAdd(false)
                }}
                className="text-sm px-4 py-2 rounded-sm border border-line text-muted hover:bg-paper transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-sm bg-teal text-white font-semibold hover:bg-teal/90 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            เพิ่มผู้ใช้งาน
          </button>
        )}
      </div>

      <DataTable
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="ค้นหาผู้ใช้งาน..."
        emptyLabel="ยังไม่มีผู้ใช้งานในระบบ"
        rowKey={(row) => row.id}
      />
    </SummaryPageShell>
  )
}
