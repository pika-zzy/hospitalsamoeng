import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { requestAPI } from '@/lib/api'
import type { SystemUser } from '@/interface/user'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { SummaryPageShell } from '@/components/summary-page-shell'


export const Route = createFileRoute('/_admin/admin/employee/staffservice/summary')({
  component: StaffSummaryPage,
})

function StaffSummaryPage() {
  const { data, isLoading } = useQuery<SystemUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const resp = await requestAPI<SystemUser[]>({ method: 'GET', url: '/users' })
      return resp.success ? resp.data : []
    },
    staleTime: 5 * 60 * 1000,
  })

  const columns: DataTableColumn<SystemUser>[] = [
    {
      key: 'id',
      header: 'ไอดี',
      render: (row) => row.id,
    },
    {
      key: 'name',
      header: 'ชื่อ',
      render: (row) => row.name,
      searchValue: (row) => row.name,
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
